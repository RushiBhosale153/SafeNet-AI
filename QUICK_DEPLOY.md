# 🚀 SafeNet AI - Quick Deployment Reference

## ⚡ Quick Start (5 Minutes)

### 1️⃣ Push to GitHub
**Use the "Save to Github" button in your chat interface** ✅
- DO NOT use git commands manually
- Located in the chat input area
- Follow prompts to push code

### 2️⃣ Deploy Backend (Render)
```
Platform: https://render.com
Type: Web Service
Root: backend
Build: yarn install
Start: node server.js
Port: 8001
```

**Environment Variables:**
```env
MONGODB_URI=mongodb+srv://...
VIRUSTOTAL_API_KEY=...
LEAKCHECK_API_KEY=...
OPENROUTER_API_KEY=...
EMAIL_SERVICE_KEY=...
JWT_SECRET=your_secure_32char_string
PORT=8001
NODE_ENV=production
```

**Health Check:** `/api/health`

### 3️⃣ Deploy Frontend (Vercel)
```
Platform: https://vercel.com
Type: Create React App
Root: frontend
Build: yarn build (auto)
Output: build (auto)
```

**Environment Variable:**
```env
REACT_APP_BACKEND_URL=https://your-backend.onrender.com
```

---

## 📋 API Keys Checklist

Get these before deploying:

- [ ] **MongoDB Atlas URI**
  - Sign up: https://www.mongodb.com/cloud/atlas
  - Create cluster (free tier)
  - Get connection string
  - Format: `mongodb+srv://user:pass@cluster.mongodb.net/safenet-ai`

- [ ] **Resend API Key**
  - Sign up: https://resend.com
  - Dashboard → API Keys
  - Create new key
  - Format: `re_xxxxxxxxxxxxx`

- [ ] **VirusTotal API Key**
  - Sign up: https://www.virustotal.com
  - My API Key: https://www.virustotal.com/gui/my-apikey
  - Format: 64-character hex string

- [ ] **LeakCheck API Key**
  - Sign up: https://leakcheck.io
  - API section
  - Get key

- [ ] **OpenRouter API Key**
  - Sign up: https://openrouter.ai
  - Keys: https://openrouter.ai/keys
  - Format: `sk-or-xxxxxxxxxxxxx`

---

## 🧪 Quick Test Commands

### Test Backend
```bash
# Health check
curl https://your-backend.onrender.com/api/health

# Expected: {"status":"ok",...}
```

### Test Frontend
```
Open: https://your-app.vercel.app
Expected: SafeNet AI homepage with dark theme
```

### Test Connection
```
1. Open frontend URL
2. Click Register
3. Check browser console (F12)
4. Look for API calls to backend
5. Should see requests to your-backend.onrender.com
```

---

## ⚠️ Common Issues

### Backend not starting on Render
**Fix:** Check logs → Usually missing environment variable

### Frontend shows blank page on Vercel
**Fix:** Check build logs → Usually build error or wrong root directory

### API calls failing from frontend
**Fix:** 
1. Verify REACT_APP_BACKEND_URL in Vercel
2. Check CORS enabled in backend
3. Test backend URL directly with curl

### MongoDB connection error
**Fix:**
1. Check MONGODB_URI format
2. Whitelist all IPs (0.0.0.0/0) in MongoDB Atlas
3. Verify database user has correct permissions

---

## 📊 Deployment Order

**Correct Order:**
1. ✅ Push to GitHub first
2. ✅ Deploy Backend to Render (get backend URL)
3. ✅ Deploy Frontend to Vercel (use backend URL)
4. ✅ Test complete flow

**Why this order?**
- Frontend needs backend URL as environment variable
- Backend can be tested independently
- Frontend deployment is faster

---

## 🔗 Useful Links

**Platforms:**
- Render: https://render.com
- Vercel: https://vercel.com
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas

**API Providers:**
- Resend: https://resend.com
- VirusTotal: https://www.virustotal.com
- LeakCheck: https://leakcheck.io
- OpenRouter: https://openrouter.ai

**Documentation:**
- Full Guide: `/app/DEPLOYMENT_GUIDE.md`
- Render Config: `/app/RENDER_CONFIG.md`
- Project README: `/app/README.md`

---

## ✅ Deployment Checklist

**Before Deployment:**
- [ ] Run `/app/verify_deployment.sh`
- [ ] All checks passed
- [ ] API keys ready

**GitHub:**
- [ ] Used "Save to Github" button
- [ ] Verified .env files NOT in repo
- [ ] Confirmed .env.example IS in repo

**Backend (Render):**
- [ ] Service created
- [ ] All env variables added
- [ ] Deployed successfully
- [ ] Health check returns 200

**Frontend (Vercel):**
- [ ] Project imported
- [ ] Root directory = frontend
- [ ] REACT_APP_BACKEND_URL set
- [ ] Deployed successfully
- [ ] Homepage loads

**Testing:**
- [ ] Homepage accessible
- [ ] Registration works
- [ ] Login works
- [ ] Dashboard loads
- [ ] Scanners functional

---

## 🎉 Success Criteria

Your deployment is successful when:

✅ Backend health endpoint returns 200
✅ Frontend homepage loads with dark theme
✅ User can register and login
✅ Dashboard displays after login
✅ All security tools are accessible
✅ No console errors in browser

---

## 📞 Need Help?

1. **Read full guide:** `/app/DEPLOYMENT_GUIDE.md`
2. **Check logs:** Render and Vercel dashboards
3. **Test individually:** Backend first, then frontend
4. **Verify env variables:** Most issues are here

---

**Time to Deploy:** ~15 minutes
**Difficulty:** Beginner-friendly
**Cost:** Free tier available on both platforms

**🛡️ Start deploying your SafeNet AI now!**
