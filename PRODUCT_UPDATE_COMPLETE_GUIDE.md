# Complete Guide: Adding/Updating Products for Closetory

## Your Categories & Occasions

### Categories (choose ONE per product):
- `Tops & Shirts`
- `Bottoms`
- `Dresses`
- `Co-ord Sets`
- `Jackets`
- `Indian Ethnic`
- `Woollens`

### Occasions (can choose MULTIPLE per product):
- `vacations`
- `brunches`
- `evenings`
- `wedding`

---

## Method 1: Quick Update Script (RECOMMENDED)

Create a file `/app/backend/add_products.py`:

```python
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

# Your products data
products = [
    {
        "product_id": "prod_101",  # Use unique ID
        "name": "Pink Blazer and Skirt Set",
        "description": "Stunning pink co-ord set perfect for brunches and evening events",
        "price": 8900,
        "designer_id": "designer_001",  # Keep consistent designer IDs
        "category": "Co-ord Sets",  # MUST match one of your categories exactly
        "occasion": ["brunches", "evenings"],  # Can have multiple occasions
        "images": [
            "https://cdn.shopify.com/s/files/IMAGE1.jpg",
            "https://cdn.shopify.com/s/files/IMAGE2.jpg"
        ],
        "fabric": "Premium polyester blend with structured tailoring",
        "styling_notes": "Pair with heels and statement earrings for a polished look",
        "curation_note": "This set embodies modern femininity with a bold color palette - perfect for the woman who isn't afraid to stand out",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "product_id": "prod_102",
        "name": "Monte Carlo Co-ord",
        "description": "Breezy vacation-ready co-ord in soft pastel",
        "price": 6500,
        "designer_id": "designer_001",
        "category": "Co-ord Sets",
        "occasion": ["vacations", "brunches"],
        "images": [
            "https://fleye.in/cdn/shop/files/IMAGE.jpg"
        ],
        "fabric": "Breathable cotton blend",
        "styling_notes": "Perfect with sandals for day or dress up with wedges",
        "curation_note": "Vacation dressing that's effortless yet put-together",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    # Add more products here following the same format
]

async def add_products():
    try:
        for product in products:
            # Check if product already exists
            existing = await db.products.find_one({"product_id": product["product_id"]})
            if existing:
                print(f"⚠️  Product {product['product_id']} already exists. Skipping.")
                continue
            
            # Insert new product
            await db.products.insert_one(product)
            print(f"✓ Added: {product['name']} ({product['product_id']})")
        
        print(f"\n✓ Successfully added {len(products)} products!")
        
    except Exception as e:
        print(f"✗ Error: {e}")
    finally:
        client.close()

asyncio.run(add_products())
```

**To run:**
```bash
cd /app/backend
python add_products.py
```

---

## Method 2: Update Existing Products

If you want to update existing products (like prod_001, prod_002, etc.):

```python
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

async def update_existing_products():
    updates = [
        {
            "product_id": "prod_002",
            "updates": {
                "category": "Dresses",
                "occasion": ["evenings", "wedding"],
                "name": "Pink Blazer and Skirt Set",
                "price": 8900,
                "images": ["https://your-direct-image-url.jpg"]
            }
        },
        {
            "product_id": "prod_003",
            "updates": {
                "category": "Co-ord Sets",
                "occasion": ["vacations", "brunches"],
                "name": "Monte Carlo Co-ord",
                "price": 6500,
                "images": ["https://your-image-url.jpg"]
            }
        }
        # Add more product updates
    ]
    
    for item in updates:
        result = await db.products.update_one(
            {"product_id": item["product_id"]},
            {"$set": item["updates"]}
        )
        if result.modified_count > 0:
            print(f"✓ Updated {item['product_id']}")
        else:
            print(f"⚠️  {item['product_id']} not found or no changes")
    
    client.close()

asyncio.run(update_existing_products())
```

---

## Method 3: Direct MongoDB Commands

```bash
mongosh

use test_database

# View current products
db.products.find({}, {name: 1, product_id: 1, category: 1, occasion: 1}).pretty()

# Update a single product
db.products.updateOne(
  { product_id: "prod_002" },
  { 
    $set: {
      name: "Pink Blazer and Skirt Set",
      category: "Co-ord Sets",
      occasion: ["brunches", "evenings"],
      price: 8900,
      images: ["https://direct-url.jpg"]
    }
  }
)

# Delete old sample products if needed
db.products.deleteMany({product_id: {$in: ["prod_002", "prod_003", "prod_004"]}})
```

---

## How to Get Direct Image URLs

### From Shopify Stores (fleye.in, aibyprerna.com, etc.):

1. Open the product page
2. Right-click on the product image → "Inspect" or "Inspect Element"
3. Look for `<img src="...">` tag
4. Copy the URL (should look like):
   ```
   https://cdn.shopify.com/s/files/1/STORE_ID/files/IMAGE_NAME.jpg
   ```
5. Test it: Paste in browser - should show JUST the image

### Alternative Method:
1. Right-click image → "Open image in new tab"
2. Copy the URL from browser address bar

---

## Complete Product Template

Use this template for each product:

```python
{
    "product_id": "prod_XXX",  # Unique ID (prod_101, prod_102, etc.)
    "name": "Product Name",
    "description": "Detailed description of the product",
    "price": 5000,  # Price in rupees (no decimals needed)
    "designer_id": "designer_001",  # Keep consistent
    "category": "Co-ord Sets",  # EXACTLY one of: Tops & Shirts, Bottoms, Dresses, Co-ord Sets, Jackets, Indian Ethnic, Woollens
    "occasion": ["brunches", "evenings"],  # Can be multiple: vacations, brunches, evenings, wedding
    "images": [
        "https://direct-image-url-1.jpg",
        "https://direct-image-url-2.jpg"  # Multiple images optional
    ],
    "fabric": "Fabric details and material info",
    "styling_notes": "How to style this piece",
    "curation_note": "Why you chose this - what makes it special",
    "created_at": datetime.now(timezone.utc).isoformat()
}
```

---

## Quick Checklist

Before adding products, verify:
- [ ] Product has unique product_id
- [ ] Category matches EXACTLY (with capitals): "Co-ord Sets", "Indian Ethnic", etc.
- [ ] Occasions are lowercase: "vacations", "brunches", "evenings", "wedding"
- [ ] Images are direct URLs (end in .jpg, .png, .webp)
- [ ] Price is a number (not string)
- [ ] Designer_id is consistent (e.g., "designer_001")

---

## Test Your Products

After adding products, test them:

```bash
# View all products
mongosh --eval "use test_database; db.products.find().pretty()"

# Check specific product
mongosh --eval "use test_database; db.products.findOne({product_id: 'prod_101'})"

# Count products by category
mongosh --eval "use test_database; db.products.aggregate([{$group: {_id: '$category', count: {$sum: 1}}}])"
```

---

## Need Help?

- **View products**: `mongosh` → `use test_database` → `db.products.find().pretty()`
- **Delete a product**: `db.products.deleteOne({product_id: "prod_XXX"})`
- **Update price**: `db.products.updateOne({product_id: "prod_XXX"}, {$set: {price: 8000}})`
