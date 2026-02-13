# Deployment Guide - Single Service on Render

Your app is now configured to deploy as a **SINGLE service** on Render - the backend serves both the API and the React frontend!

## What Changed:
✅ Backend now serves the React build files
✅ Frontend uses same domain for API calls (no CORS issues)
✅ One URL for everything
✅ Simpler deployment

## How to Deploy on Render:

### Step 1: Create Web Service
1. Go to Render Dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository

### Step 2: Configure Service
**Basic Settings:**
- Name: `toolbox` (or your choice)
- Runtime: `Python 3`
- Region: Choose nearest to you
- Branch: `main`

**Root Directory:** Leave empty (uses root)

**Build Command:**
```bash
chmod +x build.sh && ./build.sh
```

**Start Command:**
```bash
cd backend && uvicorn server:app --host 0.0.0.0 --port $PORT
```

### Step 3: Environment Variables
Add these in Render dashboard:

| Key | Value |
|-----|-------|
| `MONGO_URL` | Your MongoDB connection string |
| `DB_NAME` | `toolbox_db` |
| `CORS_ORIGINS` | `*` |

### Step 4: Deploy
Click "Create Web Service" and wait for deployment!

## After Deployment:
You'll get ONE URL like: `https://toolbox.onrender.com`
- Frontend: `https://toolbox.onrender.com/`
- API: `https://toolbox.onrender.com/api/`

## Alternative: Deploy Separately
If you prefer separate deployments, see the original configuration with two services.

## Testing Locally:
1. Build frontend: `cd frontend && npm run build`
2. Start backend: `cd backend && uvicorn server:app --reload`
3. Visit: `http://localhost:8000`
