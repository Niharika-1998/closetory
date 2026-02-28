# Closetory - Complete Project Code & Setup Guide

## Project Structure

```
closetory/
├── backend/
│   ├── .env
│   ├── requirements.txt
│   ├── server.py
│   └── add_products.py
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/          # Shadcn components (already in project)
│   │   │   ├── AuthCallback.js
│   │   │   ├── Footer.js
│   │   │   ├── Navbar.js
│   │   │   ├── ProductCard.js
│   │   │   └── ScrollToTop.js
│   │   ├── contexts/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── AboutPage.js
│   │   │   ├── ContactPage.js
│   │   │   ├── DesignersPage.js
│   │   │   ├── ShopPage.js
│   │   │   ├── ProductDetailPage.js
│   │   │   ├── WishlistPage.js
│   │   │   ├── CartPage.js
│   │   │   ├── CheckoutPage.js
│   │   │   └── LoginPage.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.css
│   ├── .env
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## Environment Variables

### Backend `.env` (backend/.env)
```
MONGO_URL=your_mongodb_connection_string
DB_NAME=your_database_name
CORS_ORIGINS=http://localhost:3000,https://your-domain.com
```

### Frontend `.env` (frontend/.env)
```
REACT_APP_BACKEND_URL=http://localhost:8001
```

## Key Files Locations

All your code is currently at:
- **Backend**: `/app/backend/`
- **Frontend**: `/app/frontend/`

## How to Export to GitHub

### Option 1: Manual Export (Recommended)

1. **Copy all files from `/app/backend/` to your local machine**
2. **Copy all files from `/app/frontend/` to your local machine**
3. **Create a GitHub repository**
4. **Push the code**

### Option 2: Using Commands

```bash
# On the server, create a tar archive
cd /app
tar -czf closetory-backup.tar.gz backend/ frontend/

# Download this file to your local machine
# Then extract and push to GitHub
```

## Setup Instructions for GitHub

### 1. Create `.gitignore`

```gitignore
# Backend
backend/.env
backend/__pycache__/
backend/*.pyc
backend/.venv/
backend/venv/

# Frontend
frontend/node_modules/
frontend/.env
frontend/build/
frontend/.env.local
frontend/.env.development.local
frontend/.env.test.local
frontend/.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS
.DS_Store
Thumbs.db
```

### 2. Create README.md

```markdown
# Closetory - Fashion Curation Platform

A premium editorial-style fashion curation platform featuring handpicked outfits from India's emerging designers.

## Features

- Curated product discovery
- Filter by occasion and category
- Wishlist functionality
- Google OAuth authentication
- Mobile responsive design
- Direct links to label websites

## Tech Stack

- **Frontend**: React, Tailwind CSS, Shadcn UI
- **Backend**: FastAPI, Python
- **Database**: MongoDB
- **Authentication**: Google OAuth + JWT

## Setup

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create `.env` file with:
   ```
   MONGO_URL=your_mongodb_url
   DB_NAME=closetory
   CORS_ORIGINS=http://localhost:3000
   ```

5. Run server:
   ```bash
   uvicorn server:app --reload --host 0.0.0.0 --port 8001
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Create `.env` file with:
   ```
   REACT_APP_BACKEND_URL=http://localhost:8001
   ```

4. Run development server:
   ```bash
   yarn start
   ```

5. Build for production:
   ```bash
   yarn build
   ```

## Adding Products

Use the product management script:

```bash
cd backend
python add_products.py
```

Edit `add_products.py` to add your products with:
- Product name, description, price
- Category (e.g., "Co-ord Sets", "Indian Ethnic")
- Occasions (e.g., ["brunches", "evenings"])
- Images (direct URLs)
- Label URL (original website)

## Environment Variables

### Required Backend Variables
- `MONGO_URL`: MongoDB connection string
- `DB_NAME`: Database name
- `CORS_ORIGINS`: Allowed origins for CORS

### Required Frontend Variables
- `REACT_APP_BACKEND_URL`: Backend API URL

## Contact

Email: closetory.cs@gmail.com
Instagram: @closetory.cs

## License

Private - All rights reserved
```

### 3. Create `package.json` scripts section

Ensure your `frontend/package.json` has:

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

## Important Notes

### MongoDB Setup
You'll need to set up your own MongoDB instance:
- Option 1: MongoDB Atlas (Free tier available)
- Option 2: Local MongoDB installation

### Google OAuth Setup
For authentication to work on GitHub/deployment:
1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs
4. Use Emergent Auth as configured in the code

### Deployment Options

**Vercel (Frontend)**
```bash
vercel deploy
```

**Railway/Render (Backend)**
- Connect your GitHub repo
- Set environment variables
- Deploy

**Full Stack**
- Frontend: Vercel, Netlify, or GitHub Pages
- Backend: Railway, Render, or Heroku
- Database: MongoDB Atlas

## File Count Summary

- **Backend**: 3 core files (server.py, requirements.txt, add_products.py)
- **Frontend**: 20+ component/page files
- **Total Project**: ~50 files including config

## Next Steps After GitHub Setup

1. ✅ Push code to GitHub
2. ✅ Set up MongoDB database
3. ✅ Configure environment variables
4. ✅ Deploy backend (Railway/Render)
5. ✅ Deploy frontend (Vercel/Netlify)
6. ✅ Update CORS origins
7. ✅ Test authentication
8. ✅ Add more products

---

**All your code is ready at `/app/backend/` and `/app/frontend/`**

Use file manager or commands to copy these folders to your local machine, then push to GitHub!
