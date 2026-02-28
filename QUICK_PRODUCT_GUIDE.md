# Quick Reference: Adding More Products

## What You Have Now

✓ Script created: `/app/backend/add_products.py`
✓ 3 products already added:
  - Pinkwood Rosette Co-Ord (₹9,550)
  - Monte Carlo Co-ord (₹7,650)
  - Mint Green Lucknowi Set (₹4,500)

## To Add More Products

### Step 1: Get Direct Image URLs

For each product URL you have:
1. Open the product page
2. Right-click on the main product image
3. Select "Inspect" or "Inspect Element"
4. Find the `<img src="...">` tag
5. Copy the URL (should look like: https://cdn.shopify.com/...)
6. Test it in browser - should show JUST the image

### Step 2: Fill in the Template

Open `/app/backend/add_products.py` and add products using this template:

```python
{
    "product_id": "prod_104",  # Increment number
    "name": "Blue Stripe Dress",
    "description": "Full product description here",
    "price": 6500,  # Price in rupees
    "designer_id": "designer_001",  
    "category": "Dresses",  # MUST be exact: Co-ord Sets, Dresses, etc.
    "occasion": ["vacations", "brunches"],  # lowercase
    "images": [
        "https://direct-url-1.jpg",
        "https://direct-url-2.jpg"
    ],
    "fabric": "Material and fabric details",
    "styling_notes": "How to wear it",
    "curation_note": "Why you love this piece",
    "created_at": datetime.now(timezone.utc).isoformat()
},
```

### Step 3: Run the Script

```bash
cd /app/backend
python add_products.py
```

## Your Remaining Products to Add

From your list, you still need to add:

(d) Jumpsuit - https://fleye.in/.../jumpsuit
(e) Embroidered Velvet Jacket - https://modishjaipur.com/...
(f) Blue Stripe Dress - https://www.endlesssummershop.com/...
(g) Amalfi Set - https://www.endlesssummershop.com/...
(h) Kerfuffle Top - https://shopunrush.com/...
(i) Retro Hot Pants - https://shopunrush.com/...
(j) Romaji Trench Coat - https://shopunrush.com/...

## Categories & Occasions Reference

### Categories (Pick ONE):
- `Tops & Shirts`
- `Bottoms`
- `Dresses`
- `Co-ord Sets`
- `Jackets`
- `Indian Ethnic`
- `Woollens`

### Occasions (Can pick MULTIPLE):
- `vacations`
- `brunches`
- `evenings`
- `wedding`

## Tips

✅ **DO:**
- Use exact category names with capitals
- Use lowercase occasion names
- Test image URLs in browser
- Write engaging curation notes
- Include fabric and styling details

❌ **DON'T:**
- Mix up category/occasion spelling
- Use product page URLs as images
- Skip the curation note (this is your voice!)
- Forget to increment product_id

## Quick Commands

View all products:
```bash
mongosh --eval "use test_database; db.products.find({}, {name:1, product_id:1, category:1, price:1}).pretty()"
```

Delete a product:
```bash
mongosh --eval "use test_database; db.products.deleteOne({product_id: 'prod_XXX'})"
```

Update product price:
```bash
mongosh --eval "use test_database; db.products.updateOne({product_id: 'prod_101'}, {\$set: {price: 8500}})"
```

## Need Help?

Check the complete guide: `/app/PRODUCT_UPDATE_COMPLETE_GUIDE.md`
