from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Cookie
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import httpx

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SessionRequest(BaseModel):
    session_id: str

class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    product_id: str
    name: str
    description: str
    price: float
    designer_id: str
    category: str
    occasion: List[str]
    images: List[str]
    fabric: Optional[str] = None
    styling_notes: Optional[str] = None
    curation_note: Optional[str] = None
    label_url: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Designer(BaseModel):
    model_config = ConfigDict(extra="ignore")
    designer_id: str
    name: str
    story: str
    philosophy: str
    signature_style: str
    image: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class WishlistItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    product_id: str
    added_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CartItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    product_id: str
    quantity: int = 1
    added_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class NewsletterSubscriber(BaseModel):
    model_config = ConfigDict(extra="ignore")
    email: str
    subscribed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    order_id: str
    user_id: str
    items: List[dict]
    total: float
    status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    designer_id: str
    category: str
    occasion: List[str]
    images: List[str]
    fabric: Optional[str] = None
    styling_notes: Optional[str] = None
    curation_note: Optional[str] = None
    label_url: Optional[str] = None

class DesignerCreate(BaseModel):
    name: str
    story: str
    philosophy: str
    signature_style: str
    image: str

async def get_current_user(request: Request) -> Optional[User]:
    session_token = request.cookies.get("session_token")
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.replace("Bearer ", "")
    
    if not session_token:
        return None
    
    session_doc = await db.user_sessions.find_one({"session_token": session_token}, {"_id": 0})
    if not session_doc:
        return None
    
    expires_at = session_doc["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        return None
    
    user_doc = await db.users.find_one({"user_id": session_doc["user_id"]}, {"_id": 0})
    if not user_doc:
        return None
    
    return User(**user_doc)

@api_router.post("/auth/session")
async def create_session(session_req: SessionRequest, response: Response):
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": session_req.session_id}
            )
            resp.raise_for_status()
            session_data = resp.json()
        
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        existing_user = await db.users.find_one({"email": session_data["email"]}, {"_id": 0})
        
        if existing_user:
            user_id = existing_user["user_id"]
            await db.users.update_one(
                {"user_id": user_id},
                {"$set": {
                    "name": session_data["name"],
                    "picture": session_data["picture"]
                }}
            )
        else:
            user_doc = {
                "user_id": user_id,
                "email": session_data["email"],
                "name": session_data["name"],
                "picture": session_data["picture"],
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            await db.users.insert_one(user_doc)
        
        session_token = session_data["session_token"]
        session_doc = {
            "user_id": user_id,
            "session_token": session_token,
            "expires_at": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.user_sessions.insert_one(session_doc)
        
        response.set_cookie(
            key="session_token",
            value=session_token,
            httponly=True,
            secure=True,
            samesite="none",
            path="/",
            max_age=7*24*60*60
        )
        
        user = await db.users.find_one({"user_id": user_id}, {"_id": 0})
        return User(**user)
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@api_router.get("/auth/me", response_model=User)
async def get_me(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    response.delete_cookie("session_token", path="/")
    return {"message": "Logged out successfully"}

@api_router.get("/products", response_model=List[Product])
async def get_products(category: Optional[str] = None, occasion: Optional[str] = None, designer_id: Optional[str] = None):
    query = {}
    if category:
        query["category"] = category
    if occasion:
        query["occasion"] = occasion
    if designer_id:
        query["designer_id"] = designer_id
    
    products = await db.products.find(query, {"_id": 0}).to_list(100)
    return products

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"product_id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@api_router.post("/products", response_model=Product)
async def create_product(product_data: ProductCreate):
    product_id = f"prod_{uuid.uuid4().hex[:12]}"
    product_doc = product_data.model_dump()
    product_doc["product_id"] = product_id
    product_doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.products.insert_one(product_doc)
    product = await db.products.find_one({"product_id": product_id}, {"_id": 0})
    return Product(**product)

@api_router.get("/designers", response_model=List[Designer])
async def get_designers():
    designers = await db.designers.find({}, {"_id": 0}).to_list(100)
    return designers

@api_router.get("/designers/{designer_id}", response_model=Designer)
async def get_designer(designer_id: str):
    designer = await db.designers.find_one({"designer_id": designer_id}, {"_id": 0})
    if not designer:
        raise HTTPException(status_code=404, detail="Designer not found")
    return designer

@api_router.post("/designers", response_model=Designer)
async def create_designer(designer_data: DesignerCreate):
    designer_id = f"designer_{uuid.uuid4().hex[:12]}"
    designer_doc = designer_data.model_dump()
    designer_doc["designer_id"] = designer_id
    designer_doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.designers.insert_one(designer_doc)
    designer = await db.designers.find_one({"designer_id": designer_id}, {"_id": 0})
    return Designer(**designer)

@api_router.get("/wishlist")
async def get_wishlist(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    wishlist_items = await db.wishlist.find({"user_id": user.user_id}, {"_id": 0}).to_list(100)
    product_ids = [item["product_id"] for item in wishlist_items]
    products = await db.products.find({"product_id": {"$in": product_ids}}, {"_id": 0}).to_list(100)
    return products

@api_router.post("/wishlist/{product_id}")
async def add_to_wishlist(product_id: str, request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    existing = await db.wishlist.find_one({"user_id": user.user_id, "product_id": product_id})
    if existing:
        return {"message": "Already in wishlist"}
    
    wishlist_doc = {
        "user_id": user.user_id,
        "product_id": product_id,
        "added_at": datetime.now(timezone.utc).isoformat()
    }
    await db.wishlist.insert_one(wishlist_doc)
    return {"message": "Added to wishlist"}

@api_router.delete("/wishlist/{product_id}")
async def remove_from_wishlist(product_id: str, request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    await db.wishlist.delete_one({"user_id": user.user_id, "product_id": product_id})
    return {"message": "Removed from wishlist"}

@api_router.get("/cart")
async def get_cart(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    cart_items = await db.cart.find({"user_id": user.user_id}, {"_id": 0}).to_list(100)
    product_ids = [item["product_id"] for item in cart_items]
    products = await db.products.find({"product_id": {"$in": product_ids}}, {"_id": 0}).to_list(100)
    
    result = []
    for cart_item in cart_items:
        product = next((p for p in products if p["product_id"] == cart_item["product_id"]), None)
        if product:
            result.append({**product, "quantity": cart_item["quantity"]})
    return result

@api_router.post("/cart/{product_id}")
async def add_to_cart(product_id: str, request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    existing = await db.cart.find_one({"user_id": user.user_id, "product_id": product_id})
    if existing:
        await db.cart.update_one(
            {"user_id": user.user_id, "product_id": product_id},
            {"$inc": {"quantity": 1}}
        )
    else:
        cart_doc = {
            "user_id": user.user_id,
            "product_id": product_id,
            "quantity": 1,
            "added_at": datetime.now(timezone.utc).isoformat()
        }
        await db.cart.insert_one(cart_doc)
    return {"message": "Added to cart"}

@api_router.delete("/cart/{product_id}")
async def remove_from_cart(product_id: str, request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    await db.cart.delete_one({"user_id": user.user_id, "product_id": product_id})
    return {"message": "Removed from cart"}

@api_router.post("/orders")
async def create_order(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    cart_items = await db.cart.find({"user_id": user.user_id}, {"_id": 0}).to_list(100)
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    
    product_ids = [item["product_id"] for item in cart_items]
    products = await db.products.find({"product_id": {"$in": product_ids}}, {"_id": 0}).to_list(100)
    
    items = []
    total = 0
    for cart_item in cart_items:
        product = next((p for p in products if p["product_id"] == cart_item["product_id"]), None)
        if product:
            items.append({
                "product_id": product["product_id"],
                "name": product["name"],
                "price": product["price"],
                "quantity": cart_item["quantity"]
            })
            total += product["price"] * cart_item["quantity"]
    
    order_id = f"order_{uuid.uuid4().hex[:12]}"
    order_doc = {
        "order_id": order_id,
        "user_id": user.user_id,
        "items": items,
        "total": total,
        "status": "completed",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.orders.insert_one(order_doc)
    await db.cart.delete_many({"user_id": user.user_id})
    
    return {"order_id": order_id, "total": total, "status": "completed"}

@api_router.post("/newsletter")
async def subscribe_newsletter(email: str):
    existing = await db.newsletter.find_one({"email": email})
    if existing:
        return {"message": "Already subscribed"}
    
    newsletter_doc = {
        "email": email,
        "subscribed_at": datetime.now(timezone.utc).isoformat()
    }
    await db.newsletter.insert_one(newsletter_doc)
    return {"message": "Subscribed successfully"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()