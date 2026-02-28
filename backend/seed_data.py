import os
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

designers_data = [
    {
        "designer_id": "designer_001",
        "name": "Aanya Kapoor",
        "story": "Growing up in Jaipur's textile district, Aanya witnessed the decline of traditional block printing. She founded her label to revive these ancient techniques through contemporary silhouettes.",
        "philosophy": "Heritage meets modernity. Every piece tells the story of artisans who've been perfecting their craft for generations.",
        "signature_style": "Contemporary fusion with traditional block prints",
        "image": "https://images.unsplash.com/photo-1721807644923-df3186074d89?crop=entropy&cs=srgb&fm=jpg&w=800&q=85",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "designer_id": "designer_002",
        "name": "Rohan Mehta",
        "story": "After years in Milan's fashion houses, Rohan returned to India to explore the intersection of European tailoring and Indian textiles.",
        "philosophy": "Sharp silhouettes. Rich fabrics. Timeless elegance with an Indian soul.",
        "signature_style": "Structured tailoring with luxe Indian textiles",
        "image": "https://images.unsplash.com/photo-1721807551095-63f747538a35?crop=entropy&cs=srgb&fm=jpg&w=800&q=85",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "designer_id": "designer_003",
        "name": "Meera Singh",
        "story": "Inspired by India's temple architecture and jewelry, Meera creates pieces that are equal parts art and fashion.",
        "philosophy": "Maximalism with intention. Every detail matters, every embellishment has meaning.",
        "signature_style": "Intricate embroidery and statement silhouettes",
        "image": "https://images.unsplash.com/photo-1728381031272-ba3f537feadd?crop=entropy&cs=srgb&fm=jpg&w=800&q=85",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
]

products_data = [
    {
        "product_id": "prod_001",
        "name": "Ivory Block Print Co-ord Set",
        "description": "A timeless co-ord set featuring traditional Rajasthani block prints on luxurious cotton silk. The minimalist silhouette lets the intricate handwork shine.",
        "price": 12500,
        "designer_id": "designer_001",
        "category": "Co-ords",
        "occasion": ["brunch", "vacation"],
        "images": [
            "https://images.unsplash.com/photo-1740198827446-08055241eb87?crop=entropy&cs=srgb&fm=jpg&w=800&q=85",
            "https://images.unsplash.com/photo-1610047592780-aa246f5635c2?crop=entropy&cs=srgb&fm=jpg&w=800&q=85"
        ],
        "fabric": "100% cotton silk with hand block printing. Each piece takes 3-4 days to create.",
        "styling_notes": "Pair with minimal gold jewelry and nude heels for daytime elegance. Add a statement clutch for evening events.",
        "curation_note": "This piece represents everything we love about slow fashion—artisan craftsmanship, timeless design, and versatile styling.",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "product_id": "prod_002",
        "name": "Scarlet Silk Evening Dress",
        "description": "A dramatic floor-length dress in pure silk with contemporary draping. The rich scarlet hue commands attention while the silhouette stays refined.",
        "price": 18900,
        "designer_id": "designer_002",
        "category": "Dresses",
        "occasion": ["evening", "wedding"],
        "images": [
            "https://images.unsplash.com/photo-1721807644923-df3186074d89?crop=entropy&cs=srgb&fm=jpg&w=800&q=85",
            "https://images.unsplash.com/photo-1767790693645-2373e54d4f02?crop=entropy&cs=srgb&fm=jpg&w=800&q=85"
        ],
        "fabric": "Pure mulberry silk with Italian tailoring techniques. Fully lined for a luxurious drape.",
        "styling_notes": "Keep accessories minimal—let the dress be the statement. A sleek bun and classic red lip complete the look.",
        "curation_note": "For the woman who doesn't need to shout to be heard. This dress speaks volumes in whispers.",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "product_id": "prod_003",
        "name": "Gold Temple Jewelry Set",
        "description": "An heirloom-quality jewelry set inspired by South Indian temple architecture. Features intricate Nakashi work and traditional motifs.",
        "price": 25000,
        "designer_id": "designer_003",
        "category": "Jewelry",
        "occasion": ["wedding", "festive"],
        "images": [
            "https://images.unsplash.com/photo-1721807551095-63f747538a35?crop=entropy&cs=srgb&fm=jpg&w=800&q=85",
            "https://images.unsplash.com/photo-1728381031272-ba3f537feadd?crop=entropy&cs=srgb&fm=jpg&w=800&q=85"
        ],
        "fabric": "22K gold-plated brass with semi-precious stones. Each piece is handcrafted by master artisans in Chennai.",
        "styling_notes": "Perfect with traditional sarees or contemporary fusion wear. This set elevates any outfit to occasion-worthy.",
        "curation_note": "Investment jewelry that tells a story. This is the kind of piece you'll pass down generations.",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "product_id": "prod_004",
        "name": "Beige Linen Vacation Set",
        "description": "Effortless vacation dressing in premium linen. This breezy set features wide-leg pants and an asymmetric top.",
        "price": 9800,
        "designer_id": "designer_001",
        "category": "Outfits",
        "occasion": ["vacation", "brunch"],
        "images": [
            "https://images.unsplash.com/photo-1669197800714-2dc0c62b7c09?crop=entropy&cs=srgb&fm=jpg&w=800&q=85",
            "https://images.unsplash.com/photo-1755223738124-9aa6f5ea763f?crop=entropy&cs=srgb&fm=jpg&w=800&q=85"
        ],
        "fabric": "European linen blend. Breathable, easy-care, and gets softer with every wash.",
        "styling_notes": "Throw on with sandals for beach days or dress up with heels for sunset dinners. Versatility at its finest.",
        "curation_note": "Because vacation dressing should be effortless, not thoughtless. This set does all the work for you.",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "product_id": "prod_005",
        "name": "Midnight Blue Festive Ensemble",
        "description": "A regal ensemble in midnight blue featuring intricate gota patti work and contemporary cuts. Perfect for making an entrance.",
        "price": 32000,
        "designer_id": "designer_003",
        "category": "Outfits",
        "occasion": ["festive", "wedding", "evening"],
        "images": [
            "https://images.unsplash.com/photo-1759906760638-eeffcb471e53?crop=entropy&cs=srgb&fm=jpg&w=800&q=85",
            "https://images.unsplash.com/photo-1767790693645-2373e54d4f02?crop=entropy&cs=srgb&fm=jpg&w=800&q=85"
        ],
        "fabric": "Silk georgette with hand-embroidered gota patti. Over 200 hours of craftsmanship.",
        "styling_notes": "This is a statement outfit that needs minimal styling. Let the embroidery do the talking.",
        "curation_note": "For those moments when you need to be unforgettable. This isn't just an outfit—it's an entrance.",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "product_id": "prod_006",
        "name": "Emerald Silk Kurta Set",
        "description": "A contemporary take on the classic kurta. Clean lines, rich emerald silk, and subtle gold detailing.",
        "price": 14500,
        "designer_id": "designer_002",
        "category": "Outfits",
        "occasion": ["festive", "brunch"],
        "images": [
            "https://images.unsplash.com/photo-1755223738124-9aa6f5ea763f?crop=entropy&cs=srgb&fm=jpg&w=800&q=85",
            "https://images.unsplash.com/photo-1740198827446-08055241eb87?crop=entropy&cs=srgb&fm=jpg&w=800&q=85"
        ],
        "fabric": "Pure silk with gold zari detailing. Comfortable yet elevated.",
        "styling_notes": "Dress it down with juttis for day events or up with heels and statement jewelry for evening.",
        "curation_note": "The kind of kurta that makes you rethink everything you thought you knew about traditional wear.",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "product_id": "prod_007",
        "name": "Coral Evening Saree",
        "description": "Six yards of pure elegance. This contemporary saree drapes like a dream and needs no introduction.",
        "price": 28000,
        "designer_id": "designer_002",
        "category": "Outfits",
        "occasion": ["wedding", "evening"],
        "images": [
            "https://images.unsplash.com/photo-1767790693645-2373e54d4f02?crop=entropy&cs=srgb&fm=jpg&w=800&q=85",
            "https://images.unsplash.com/photo-1759906760638-eeffcb471e53?crop=entropy&cs=srgb&fm=jpg&w=800&q=85"
        ],
        "fabric": "Handwoven silk with contemporary blouse. The drape is what dreams are made of.",
        "styling_notes": "Keep the blouse simple and let the saree take center stage. Statement earrings complete the look.",
        "curation_note": "For the woman who understands that a saree isn't traditional—it's timeless.",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "product_id": "prod_008",
        "name": "Pearl Statement Necklace",
        "description": "Contemporary pearl jewelry that challenges everything you thought you knew about pearls. Bold, modern, unapologetic.",
        "price": 15800,
        "designer_id": "designer_003",
        "category": "Jewelry",
        "occasion": ["evening", "brunch"],
        "images": [
            "https://images.unsplash.com/photo-1728381031272-ba3f537feadd?crop=entropy&cs=srgb&fm=jpg&w=800&q=85",
            "https://images.unsplash.com/photo-1721807551095-63f747538a35?crop=entropy&cs=srgb&fm=jpg&w=800&q=85"
        ],
        "fabric": "Baroque freshwater pearls with gold-plated brass. Each pearl is hand-selected for its unique character.",
        "styling_notes": "Perfect with a simple black dress or to elevate a basic tee and jeans. This necklace is the outfit.",
        "curation_note": "Pearls, but make it fashion. This is jewelry for the rule-breakers.",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
]

async def seed_database():
    try:
        await db.designers.delete_many({})
        await db.products.delete_many({})
        
        await db.designers.insert_many(designers_data)
        print(f"✓ Inserted {len(designers_data)} designers")
        
        await db.products.insert_many(products_data)
        print(f"✓ Inserted {len(products_data)} products")
        
        print("\n✓ Database seeded successfully!")
        
    except Exception as e:
        print(f"✗ Error seeding database: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
