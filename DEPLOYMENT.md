# Deployment Guide - Separate Frontend & Backend on Render

Deploy your app with TWO services on Render - cleaner and more reliable setup!

## 🚀 Quick Overview
- **Backend**: Web Service (Python) for API
- **Frontend**: Static Site for React UI
- **Result**: Users visit ONE frontend URL, backend works behind the scenes

---

## STEP 1: Deploy Backend First

### Create Backend Web Service
1. Go to Render Dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `Tool-Box`

### Configure Backend Service

| Setting | Value |
|---------|-------|
| **Name** | `toolbox-backend` (or your choice) |
| **Runtime** | `Python 3` |
| **Region** | Choose nearest to you |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn server:app --host 0.0.0.0 --port $PORT` |

### Backend Environment Variables
Add these in Render dashboard:

| Key | Value (example) |
|-----|-----------------|
| `MONGO_URL` | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| `DB_NAME` | `toolbox_db` |
| `CORS_ORIGINS` | `https://your-frontend-name.onrender.com` |

**Important:** After backend deploys, **COPY THE BACKEND URL** (e.g., `https://toolbox-backend.onrender.com`)

---

## STEP 2: Deploy Frontend

### Create Frontend Static Site
1. In Render Dashboard, click **"New +"** → **"Static Site"**
2. Connect same GitHub repository: `Tool-Box`

### Configure Frontend Service

| Setting | Value |
|---------|-------|
| **Name** | `toolbox-frontend` (or your choice) |
| **Branch** | `main` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `build` |

### Frontend Environment Variable
Add ONE environment variable:

| Key | Value |
|-----|-------|
| `REACT_APP_BACKEND_URL` | `https://toolbox-backend.onrender.com` ← **Use YOUR backend URL from Step 1** |

### Click "Create Static Site"

---

## STEP 3: Update Backend CORS

1. Go back to your **Backend service** settings
2. Navigate to **Environment** section
3. Update `CORS_ORIGINS` to your **actual frontend URL**:
   ```
   https://toolbox-frontend.onrender.com
   ```
4. Save changes (backend will redeploy)

---

## ✅ You're Done!

**Your app is live at:** `https://toolbox-frontend.onrender.com`

- Frontend: `https://toolbox-frontend.onrender.com` ← **Share this link with users**
- Backend: `https://toolbox-backend.onrender.com` ← **For API only**

---

## 🔄 How to Update

**Update Frontend:**
1. Push code changes to GitHub
2. Render auto-deploys (or click "Manual Deploy")

**Update Backend:**
1. Push code changes to GitHub  
2. Render auto-deploys automatically

---

## 🐛 Troubleshooting

**Frontend shows "Network Error":**
- Check `REACT_APP_BACKEND_URL` is set correctly
- Verify backend is running (visit backend URL, should show JSON)

**CORS errors:**
- Update backend's `CORS_ORIGINS` to match frontend URL
- Make sure there are no trailing slashes

**Backend won't start:**
- Check all environment variables are set
- Check logs in Render dashboard

---

## 💰 Costs

Both services fit in Render's **free tier**:
- Free tier spins down after 15 min of inactivity
- First request after spin-down takes ~30 seconds

For always-on service, upgrade backend to paid tier ($7/month).

---

## 🎯 Optional: Custom Domain

Add your own domain in Render:
1. Go to Frontend service settings
2. Click "Custom Domain"
3. Add your domain (e.g., `toolbox.yourdomain.com`)
4. Update DNS records as instructed
5. Update backend `CORS_ORIGINS` to include new domain

