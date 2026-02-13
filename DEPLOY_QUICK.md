# Quick Deployment Steps

## 1️⃣ Deploy Backend (5 minutes)

**On Render:**
- Type: **Web Service**
- Runtime: **Python 3**
- Root Directory: `backend`
- Build: `pip install -r requirements.txt`
- Start: `uvicorn server:app --host 0.0.0.0 --port $PORT`

**Environment Variables:**
```
MONGO_URL = your_mongodb_connection_string
DB_NAME = toolbox_db
CORS_ORIGINS = https://your-frontend-name.onrender.com
```

**After deploy:** Copy the backend URL (e.g., `https://toolbox-backend-xyz.onrender.com`)

---

## 2️⃣ Deploy Frontend (3 minutes)

**On Render:**
- Type: **Static Site**
- Root Directory: `frontend`
- Build: `npm install && npm run build`
- Publish: `build`

**Environment Variable:**
```
REACT_APP_BACKEND_URL = https://toolbox-backend-xyz.onrender.com
```
*(Use the backend URL from step 1)*

---

## 3️⃣ Update Backend CORS (1 minute)

Go back to backend service → Environment → Update:
```
CORS_ORIGINS = https://toolbox-frontend-abc.onrender.com
```
*(Use your actual frontend URL)*

---

## ✅ Done!

Your app is live at: `https://toolbox-frontend-abc.onrender.com`

Share this frontend URL with users!

---

## 📝 Notes

- Free tier services spin down after 15 min inactivity
- First request after spin-down takes ~30 seconds to wake up
- Both services auto-deploy when you push to GitHub
- Check logs in Render dashboard if something goes wrong
