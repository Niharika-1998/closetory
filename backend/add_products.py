import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# YOUR PRODUCTS - Ready to add!
# Instructions: 
# 1. Replace image URLs with direct links (right-click image → inspect → copy src URL)
# 2. Assign proper category and occasion
# 3. Add your curation notes

products = [
    {
        "product_id": "prod_101",
        "name": "Pinkwood Rosette Co-Ord",
        "description": "Light pink tweed blazer and skirt set with rosette details. The fitted blazer features a shawl lapel collar, lace-up front closure, and unique rosette patch pockets. Includes matching mini skirt with front button opening.",
        "price": 9550,
        "designer_id": "designer_001",
        "category": "Co-ord Sets",
        "occasion": ["brunches", "evenings"],
        "images": [
            "https://fleye.in/cdn/shop/files/0T6A8319.jpg?v=1763565491&width=1600",
            "https://fleye.in/cdn/shop/files/0T6A8321.jpg?v=1763565490&width=1600",
            "https://fleye.in/cdn/shop/files/0T6A8324.jpg?v=1766141519&width=1600"
        ],
        "fabric": "Textured light pink tweed with subtle sequin integration for soft shimmer. Features functional drawstring/lace-up closure.",
        "styling_notes": "Wear with nude heels to let the texture shine, or pair the blazer with white denim for versatile day looks.",
        "curation_note": "This co-ord is what happens when classic tailoring meets contemporary charm—structured yet playful, feminine without being delicate. The rosette details are conversation-starters.",
        "label_url": "https://fleye.in/collections/new-drops/products/4-pink-blazer-and-skirt",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "product_id": "prod_102",
        "name": "Monte Carlo Co-ord",
        "description": "Lustrous silk satin blazer in warm gold paired with a whisper-soft sheer pleated skirt. The blazer features asymmetrical wrap silhouette, sharp lapels, and exaggerated flared sleeves. Perfect blend of structure and fluidity.",
        "price": 7650,
        "designer_id": "designer_001",
        "category": "Co-ord Sets",
        "occasion": ["evenings", "wedding"],
        "images": [
            "https://fleye.in/cdn/shop/files/0T6A4338.jpg?v=1743456019&width=1600",
            "https://fleye.in/cdn/shop/files/0T6A4317copy.jpg?v=1743456019&width=1600",
            "https://fleye.in/cdn/shop/files/Copyof0T6A4331.jpg?v=1743456019&width=1600"
        ],
        "fabric": "Lustrous silk satin blazer with sheer pleated skirt. Double-button closure cinches the waist for tailored fit.",
        "styling_notes": "Perfect for soirées, destination weddings, or statement eveningwear. Transitions effortlessly from day to night.",
        "curation_note": "Ethereal elegance meets structured sophistication. The sheer skirt adds contemporary edge to the tailored blazer—this is for the woman who wants to make an entrance.",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "product_id": "prod_103",
        "name": "Mint Green Lucknowi Set",
        "description": "Embroidered Lucknowi cape and pant set in mint green georgette. Features intricate embroidery with front-open cape and comfortable crepe-lined pants with back elastic.",
        "price": 4500,
        "designer_id": "designer_002",
        "category": "Indian Ethnic",
        "occasion": ["wedding", "evenings"],
        "images": [
            "https://aibyprerna.com/cdn/shop/files/IMG_4574_a80f3709-40d9-4605-9398-c1298c8999ca.jpg",
            "https://aibyprerna.com/cdn/shop/files/IMG_4587.jpg",
            "https://aibyprerna.com/cdn/shop/files/IMG_4591_6bee3272-75e4-41f1-b479-c4e09bc61b85.jpg"
        ],
        "fabric": "Georgette with embroidered Lucknowi work. Cape is front-open, free size. Pants are crepe-lined with back elastic.",
        "styling_notes": "Pair with statement earrings and mojris for a complete festive look. The mint green is perfect for daytime celebrations.",
        "curation_note": "Traditional Lucknowi craftsmanship with a contemporary silhouette—this is heritage fashion for the modern Indian woman who values both culture and comfort.",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    
    # TEMPLATE FOR REMAINING PRODUCTS
    # Copy this template and fill in details for your other products:
    
    # {
    #     "product_id": "prod_104",  # Change this
    #     "name": "Product Name Here",
    #     "description": "Detailed product description...",
    #     "price": 0000,  # Add price
    #     "designer_id": "designer_001",
    #     "category": "Choose One: Tops & Shirts | Bottoms | Dresses | Co-ord Sets | Jackets | Indian Ethnic | Woollens",
    #     "occasion": ["Choose Multiple: vacations | brunches | evenings | wedding"],
    #     "images": [
    #         "https://direct-image-url-1.jpg",
    #         "https://direct-image-url-2.jpg"
    #     ],
    #     "fabric": "Fabric and material details",
    #     "styling_notes": "How to wear and style this piece",
    #     "curation_note": "Why you chose this - what makes it special for Closetory",
    #     "created_at": datetime.now(timezone.utc).isoformat()
    # },
]

async def add_products():
    try:
        added_count = 0
        skipped_count = 0
        
        for product in products:
            # Check if product already exists
            existing = await db.products.find_one({"product_id": product["product_id"]})
            if existing:
                print(f"⚠️  {product['product_id']} already exists. Skipping.")
                skipped_count += 1
                continue
            
            # Insert new product
            await db.products.insert_one(product)
            print(f"✓ Added: {product['name']} ({product['product_id']}) - ₹{product['price']}")
            added_count += 1
        
        print(f"\n{'='*50}")
        print(f"✓ Successfully added {added_count} products!")
        print(f"⚠️  Skipped {skipped_count} existing products")
        print(f"{'='*50}\n")
        
        # Show total products in database
        total = await db.products.count_documents({})
        print(f"Total products in database: {total}")
        
    except Exception as e:
        print(f"✗ Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    print("Adding products to Closetory database...\n")
    asyncio.run(add_products())
