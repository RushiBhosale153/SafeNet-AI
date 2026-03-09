# 🚀 SafeNet AI - Complete Deployment Guide

## 📋 Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Push to GitHub](#push-to-github)
3. [Deploy Backend to Render](#deploy-backend-to-render)
4. [Deploy Frontend to Vercel](#deploy-frontend-to-vercel)
5. [Connect Frontend to Backend](#connect-frontend-to-backend)
6. [Final Testing](#final-testing)
7. [Troubleshooting](#troubleshooting)

---

## ✅ Pre-Deployment Checklist

### Verify Project Structure
```bash
# Check that .env files are excluded
cd /app
git status

# Should NOT see .env files listed
# Should see .env.example
```

### Required Files Present
- ✅ `/app/.gitignore` - Excludes .env files
- ✅ `/app/.env.example` - Template for environment variables
- ✅ `/app/backend/package.json` - Backend dependencies
- ✅ `/app/frontend/package.json` - Frontend dependencies
- ✅ `/app/README.md` - Project documentation
- ✅ `/app/vercel.json` - Vercel configuration

### Get Your API Keys Ready
You'll need these for deployment:
1. **MongoDB Atlas URI** - https://www.mongodb.com/cloud/atlas
2. **Resend API Key** - https://resend.com/api-keys
3. **VirusTotal API Key** - https://www.virustotal.com/gui/my-apikey
4. **LeakCheck API Key** - https://leakcheck.io/api
5. **OpenRouter API Key** - https://openrouter.ai/keys

---

## 📤 Push to GitHub

### ⚠️ IMPORTANT: Use Built-in GitHub Feature

**DO NOT manually push to GitHub using git commands.**

Instead, use the **"Save to Github"** feature available in your Emergent chat interface:

1. Look for the **"Save to Github"** button in the chat input area
2. Click on it
3. Follow the prompts to:
   - Connect your GitHub account (if not already connected)
   - Choose repository name (e.g., `safenet-ai`)
   - Confirm the push

This ensures your code is safely pushed without any issues.

### Verify GitHub Push

After using "Save to Github":
1. Go to your GitHub repository
2. Verify all files are present
3. Check that `.env` files are NOT in the repository
4. Confirm `.env.example` IS present

---

## 🔴 Deploy Backend to Render

### Step 1: Sign Up / Log In to Render
1. Go to https://render.com
2. Sign up or log in
3. Connect your GitHub account

### Step 2: Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository (safenet-ai)
3. Click on your repository

### Step 3: Configure Service

**Basic Settings:**
- **Name**: `safenet-ai-backend`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`

**Build & Deploy:**
- **Build Command**: 
  ```bash
  yarn install
  ```

- **Start Command**:
  ```bash
  node server.js
  ```

### Step 4: Add Environment Variables

In the **Environment Variables** section, add:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/safenet-ai
VIRUSTOTAL_API_KEY=your_actual_virustotal_key
LEAKCHECK_API_KEY=your_actual_leakcheck_key
OPENROUTER_API_KEY=your_actual_openrouter_key
EMAIL_SERVICE_KEY=your_actual_resend_key
JWT_SECRET=your_secure_random_string_min_32_chars
PORT=8001
NODE_ENV=production
```

**⚠️ Important Notes:**
- Replace ALL placeholder values with your actual API keys
- Make sure MongoDB URI is from MongoDB Atlas
- JWT_SECRET should be a long random string (at least 32 characters)

### Step 5: Advanced Settings

- **Health Check Path**: `/api/health`
- **Auto-Deploy**: Enable (recommended)

### Step 6: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (3-5 minutes)
3. Once deployed, you'll get a URL like:
   ```
   https://safenet-ai-backend.onrender.com
   ```

### Step 7: Test Backend

```bash
# Test health endpoint
curl https://safenet-ai-backend.onrender.com/api/health

# Expected response:
# {"status":"ok","message":"SafeNet AI Backend is running","timestamp":"..."}
```

**✅ Backend deployment complete!** Copy your backend URL for frontend deployment.

---

## 🔵 Deploy Frontend to Vercel

### Step 1: Sign Up / Log In to Vercel
1. Go to https://vercel.com
2. Sign up or log in with GitHub
3. Authorize Vercel to access your repositories

### Step 2: Import Project

1. Click **"Add New..."** → **"Project"**
2. Find and select your `safenet-ai` repository
3. Click **"Import"**

### Step 3: Configure Project

**Framework Preset:**
- Vercel should auto-detect: **Create React App**

**Root Directory:**
- Click **"Edit"**
- Set to: `frontend`

**Build Settings:**
- **Build Command**: `yarn build` (auto-detected)
- **Output Directory**: `build` (auto-detected)
- **Install Command**: `yarn install` (auto-detected)

### Step 4: Add Environment Variables

Click **"Environment Variables"** and add:

```
Name: REACT_APP_BACKEND_URL
Value: https://safenet-ai-backend.onrender.com
```

**⚠️ Replace with your actual Render backend URL from Step 6 above!**

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for build and deployment (2-4 minutes)
3. Once deployed, you'll get a URL like:
   ```
   https://safenet-ai.vercel.app
   ```

### Step 6: Test Frontend

1. Open your Vercel URL in a browser
2. You should see:
   - ✅ SafeNet AI homepage
   - ✅ Dark cybersecurity theme
   - ✅ Neon blue/green colors
   - ✅ Navigation menu

**✅ Frontend deployment complete!**

---

## 🔗 Connect Frontend to Backend

### Verify Connection

1. Open your Vercel frontend URL
2. Click **"Register"**
3. Try to create an account
4. Open browser console (F12)
5. Check for API calls to your Render backend

### If Connection Fails

**Check CORS:**

The backend should already have CORS enabled, but verify in `/app/backend/server.js`:

```javascript
const cors = require('cors');
app.use(cors());
```

**Check Environment Variable:**

In Vercel dashboard:
1. Go to your project
2. Click **"Settings"** → **"Environment Variables"**
3. Verify `REACT_APP_BACKEND_URL` is set correctly
4. Should be: `https://safenet-ai-backend.onrender.com` (your actual URL)

**Redeploy if Needed:**

If you change environment variables:
1. Go to **"Deployments"** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**

---

## 🧪 Final Testing

### Test Complete User Flow

1. **Homepage**: Visit your Vercel URL
   - ✅ Page loads with dark theme
   - ✅ Hero section displays
   - ✅ Feature cards visible

2. **Registration**:
   ```
   Email: test@safenet.ai
   Password: TestPassword123!
   ```
   - ✅ Form submission works
   - ✅ OTP sent (check email or response)

3. **OTP Verification**:
   - Enter 6-digit code
   - ✅ Email verified
   - ✅ Redirected to dashboard

4. **Login**:
   - Use same credentials
   - ✅ Successfully logged in
   - ✅ Redirected to dashboard

5. **Dashboard**:
   - ✅ User email displayed
   - ✅ Security tool cards visible
   - ✅ Navigation works

6. **Phishing Scanner**:
   ```
   Message: "URGENT! Your account will be suspended. Click here now!"
   ```
   - ✅ Scan completes
   - ✅ Risk level displayed
   - ✅ Threats detected

7. **Website Scanner**:
   ```
   URL: https://example.com
   ```
   - ✅ Scan initiates
   - ✅ Results from VirusTotal
   - ✅ Risk assessment shown

8. **Leak Checker**:
   ```
   Email: test@example.com
   ```
   - ✅ Check completes
   - ✅ Breach data displayed (if any)

9. **AI Assistant**:
   ```
   Question: "What is phishing?"
   ```
   - ✅ AI responds
   - ✅ Security-focused answer

10. **Help Desk**:
    - Submit test ticket
    - ✅ Ticket created successfully

11. **Profile**:
    - ✅ User info displayed
    - ✅ Scan history shown
    - ✅ Statistics accurate

---

## 🔧 Troubleshooting

### Frontend Issues

**Problem: White screen / Blank page**

Solution:
```bash
# Check build logs in Vercel
# Common issues:
1. Build failed - Check Vercel deployment logs
2. Environment variable not set - Add REACT_APP_BACKEND_URL
3. Wrong root directory - Should be "frontend"
```

**Problem: API calls failing**

Solution:
```javascript
// Check browser console (F12)
// Look for:
1. CORS errors - Backend needs cors() middleware
2. 404 errors - Check REACT_APP_BACKEND_URL is correct
3. Network errors - Backend might be down
```

**Problem: Styles not loading**

Solution:
```bash
# Verify in package.json:
"tailwindcss": "^3.3.5"

# Check build output includes CSS
```

### Backend Issues

**Problem: "Application failed to respond"**

Solution:
```bash
# In Render dashboard:
1. Check "Logs" tab
2. Look for errors
3. Common issues:
   - Missing environment variables
   - MongoDB connection failed
   - Port not set to 8001
```

**Problem: MongoDB connection error**

Solution:
```bash
# Verify:
1. MONGODB_URI is correct format:
   mongodb+srv://user:pass@cluster.mongodb.net/dbname
2. MongoDB Atlas IP whitelist includes:
   0.0.0.0/0 (allow all) for Render
3. Database user has correct permissions
```

**Problem: API keys not working**

Solution:
```bash
# In Render environment variables:
1. No quotes around values
2. No spaces in keys
3. Restart service after adding variables
```

### Connection Issues

**Problem: Frontend can't reach backend**

Solution:
```bash
# Test backend directly:
curl https://your-backend.onrender.com/api/health

# If that works, check:
1. REACT_APP_BACKEND_URL in Vercel
2. CORS enabled in backend
3. Redeploy frontend after env change
```

### Render-Specific Issues

**Problem: Free tier spin-down**

Render free tier spins down after inactivity:
- First request takes 30-60 seconds
- Use Render cron job or external ping service
- Or upgrade to paid tier for always-on

**Problem: Build timeout**

Solution:
```bash
# In render.yaml or dashboard:
- Ensure build command is just: yarn install
- Don't run unnecessary scripts
```

---

## 📊 Deployment Checklist

### Pre-Deployment
- [ ] All .env files excluded from git
- [ ] .env.example included with placeholders
- [ ] All dependencies in package.json
- [ ] README.md updated
- [ ] Code pushed to GitHub (via "Save to Github")

### Backend (Render)
- [ ] Service created and deployed
- [ ] All environment variables added
- [ ] Health check configured (/api/health)
- [ ] Deployment successful
- [ ] API endpoint tested with curl

### Frontend (Vercel)
- [ ] Project imported from GitHub
- [ ] Root directory set to "frontend"
- [ ] REACT_APP_BACKEND_URL configured
- [ ] Deployment successful
- [ ] Site accessible in browser

### Testing
- [ ] Homepage loads correctly
- [ ] Registration works
- [ ] Login works
- [ ] Dashboard accessible
- [ ] All security tools functional
- [ ] Help desk works
- [ ] Profile displays correctly

---

## 🎉 Deployment Complete!

### Your Live URLs:

**Frontend (Vercel):**
```
https://safenet-ai.vercel.app
(or your custom domain)
```

**Backend (Render):**
```
https://safenet-ai-backend.onrender.com
```

### Custom Domains (Optional)

**Vercel:**
1. Go to project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records

**Render:**
1. Go to service settings
2. Click "Custom Domain"
3. Add your domain
4. Update DNS records

---

## 📝 Production Recommendations

### Security
1. **Enable rate limiting** on API endpoints
2. **Add request validation** middleware
3. **Implement API usage monitoring**
4. **Regular security audits**
5. **Keep dependencies updated**

### Performance
1. **Enable caching** for static assets
2. **Optimize images** (use WebP)
3. **Implement CDN** for frontend
4. **Database indexing** for MongoDB
5. **Monitor response times**

### Monitoring
1. **Set up error tracking** (Sentry, LogRocket)
2. **Monitor uptime** (UptimeRobot)
3. **Track user analytics** (Google Analytics)
4. **API usage metrics**
5. **Database performance**

### Backup
1. **Enable MongoDB Atlas backups**
2. **Regular code backups** to GitHub
3. **Document deployment process**
4. **Keep environment variables documented** (not values, just keys)

---

## 🆘 Need Help?

### Resources
- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com/

### Common Issues
- Check deployment logs first
- Verify all environment variables
- Test backend API directly with curl
- Check browser console for frontend errors

---

## 🎊 Congratulations!

Your SafeNet AI cybersecurity platform is now live and accessible to users worldwide!

**Share your application:**
- Frontend: `https://your-app.vercel.app`
- Documentation: Link to your GitHub README
- Demo video: Record and share on social media

**Next Steps:**
1. Test all features thoroughly
2. Gather user feedback
3. Monitor performance
4. Plan feature updates
5. Scale as needed

---

**Built with 🛡️ SafeNet AI - Protecting the Digital World**
