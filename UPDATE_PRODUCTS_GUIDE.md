# How to Update Products in Your Database

## Method 1: Using MongoDB Shell (Easiest)

### Step 1: Access MongoDB Shell
```bash
mongosh
```

### Step 2: Switch to Your Database
```bash
use test_database
```

### Step 3: View Current Products
```bash
db.products.find({}, {name: 1, product_id: 1}).pretty()
```

### Step 4: Update a Product
Replace `prod_001` with your product ID and update the fields:

```javascript
db.products.updateOne(
  { product_id: "prod_001" },
  { 
    $set: {
      name: "Your Product Name",
      description: "Product description here",
      price: 4500,
      images: [
        "https://direct-image-url-1.jpg",
        "https://direct-image-url-2.jpg"
      ],
      fabric: "Fabric details",
      styling_notes: "How to style this piece",
      curation_note: "Why we love this"
    }
  }
)
```

### Step 5: Verify Update
```bash
db.products.findOne({product_id: "prod_001"})
```

---

## Method 2: Using Python Script

Create a file `update_products.py` in `/app/backend/`:

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

async def update_products():
    # Update multiple products at once
    products_to_update = [
        {
            "product_id": "prod_002",
            "name": "Pink Blazer and Skirt Set",
            "price": 8900,
            "images": [
                "https://direct-image-url.jpg"
            ]
        },
        # Add more products here
    ]
    
    for product in products_to_update:
        product_id = product.pop("product_id")
        await db.products.update_one(
            {"product_id": product_id},
            {"$set": product}
        )
        print(f"✓ Updated {product_id}")
    
    client.close()

asyncio.run(update_products())
```

Run it:
```bash
cd /app/backend
python update_products.py
```

---

## Quick Reference: Your Current Products

| Product ID | Current Name |
|------------|-------------|
| prod_001 | Mint Green Lucknowi Set (✓ Updated) |
| prod_002 | Scarlet Silk Evening Dress |
| prod_003 | Gold Temple Jewelry Set |
| prod_004 | Beige Linen Vacation Set |
| prod_005 | Midnight Blue Festive Ensemble |
| prod_006 | Emerald Silk Kurta Set |
| prod_007 | Coral Evening Saree |
| prod_008 | Pearl Statement Necklace |

---

## Tips for Getting Image URLs

1. **From Product Pages**: 
   - Right-click on product image → "Open image in new tab"
   - Copy the direct URL (should end in .jpg, .png, .webp)

2. **Shopify Store Images**:
   - Format: `https://domain.com/cdn/shop/files/IMAGE_NAME.jpg`
   - Usually found in page source or by inspecting image element

3. **Test the URL**:
   - Paste it in browser - should show just the image
   - If it redirects or shows a page, it's not a direct URL

---

## Need Help?

View all products:
```bash
mongosh
use test_database
db.products.find().pretty()
```

Delete a product:
```bash
db.products.deleteOne({product_id: "prod_XXX"})
```

Add a new product:
```bash
db.products.insertOne({
  product_id: "prod_009",
  name: "New Product",
  description: "Description",
  price: 5000,
  designer_id: "designer_001",
  category: "Outfits",
  occasion: ["brunch", "evening"],
  images: ["url1", "url2"],
  fabric: "Fabric info",
  styling_notes: "Styling tips",
  curation_note: "Why we curated this",
  created_at: new Date().toISOString()
})
```
