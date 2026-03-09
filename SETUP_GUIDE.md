# SafeNet AI - Setup Guide

## 🚀 Quick Start

Your SafeNet AI application has been successfully created! Follow these steps to complete the setup.

## ✅ What's Already Done

1. ✅ Full-stack application structure created
2. ✅ Backend (Node.js + Express) - Running on port 5000
3. ✅ Frontend (React + Tailwind CSS) - Running on port 3000
4. ✅ MongoDB service running locally
5. ✅ All routes and security tools implemented
6. ✅ Dark cybersecurity theme applied

## 🔑 Required: Add Your API Keys

### Step 1: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (if you don't have one)
3. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/safenet-ai`)
4. Add it to `/app/backend/.env`:
   ```
   MONGODB_URI=your_actual_mongodb_connection_string
   ```

### Step 2: Get API Keys

Add the following API keys to `/app/backend/.env`:

**Resend (Email OTP):**
- Get key from: https://resend.com/api-keys
- Add to .env: `EMAIL_SERVICE_KEY=re_xxxxx`

**VirusTotal (Website Scanner):**
- Get key from: https://www.virustotal.com/gui/my-apikey
- Add to .env: `VIRUSTOTAL_API_KEY=xxxxx`

**LeakCheck (Email Breach Checker):**
- Get key from: https://leakcheck.io/api
- Add to .env: `LEAKCHECK_API_KEY=xxxxx`

**OpenRouter (AI Assistant):**
- Get key from: https://openrouter.ai/keys
- Add to .env: `OPENROUTER_API_KEY=sk-or-xxxxx`

### Step 3: Restart Services

After adding your API keys:

```bash
sudo supervisorctl restart backend frontend
```

## 🧪 Testing the Application

### Frontend Access
- Open your browser to: `http://localhost:3000`
- Or use the preview URL provided by your environment

### Backend API Testing

**Health Check:**
```bash
curl http://localhost:5000/api/health
```

**Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"SecurePass123"}'
```

**Verify OTP:**
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"userId":"USER_ID_FROM_REGISTER","otp":"123456"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"SecurePass123"}'
```

**Test Phishing Scanner (requires JWT token):**
```bash
curl -X POST http://localhost:5000/api/scan/phishing \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"message":"URGENT! Click here to verify your account now!"}'
```

## 📂 Important Files

- **Backend Environment**: `/app/backend/.env`
- **Frontend Environment**: `/app/frontend/.env`
- **Backend Code**: `/app/backend/server.js`
- **Frontend Code**: `/app/frontend/src/App.js`
- **API Routes**: `/app/backend/routes/`
- **Frontend Pages**: `/app/frontend/src/pages/`

## 🔍 Checking Logs

**Backend Logs:**
```bash
tail -f /var/log/supervisor/backend_node.out.log
```

**Frontend Logs:**
```bash
tail -f /var/log/supervisor/frontend.out.log
```

**MongoDB Logs:**
```bash
tail -f /var/log/mongodb.out.log
```

## 🎨 Application Features

### Pages Available:
1. **Home** (`/`) - Landing page with features
2. **Register** (`/register`) - User registration
3. **Login** (`/login`) - User login
4. **Verify OTP** (`/verify-otp`) - Email verification
5. **Dashboard** (`/dashboard`) - Main dashboard (protected)
6. **Phishing Scanner** (`/phishing-scanner`) - Detect phishing (protected)
7. **Website Scanner** (`/website-scanner`) - Scan URLs (protected)
8. **Leak Checker** (`/leak-checker`) - Check email breaches (protected)
9. **AI Assistant** (`/ai-assistant`) - Cybersecurity chatbot (protected)
10. **Help Desk** (`/help-desk`) - Submit tickets (protected)
11. **Profile** (`/profile`) - User profile & history (protected)

### Security Tools:
- ✅ Phishing detection with pattern matching
- ✅ Website malware scanning (VirusTotal API)
- ✅ Email breach checking (LeakCheck API)
- ✅ AI cybersecurity assistant (OpenRouter API)

## ⚙️ Development Mode Features

### Without API Keys:
- **Email OTP**: System will show OTP in console/response (development mode)
- **Website Scanner**: Will return error message about missing API key
- **Leak Checker**: Will return error message about missing API key
- **AI Assistant**: Will return error message about missing API key
- **Phishing Scanner**: Works without API keys (uses local pattern matching)

## 🚨 Troubleshooting

### Backend Not Starting:
```bash
cd /app/backend
node server.js
# Check for errors
```

### Frontend Not Loading:
```bash
cd /app/frontend
yarn start
# Check for compilation errors
```

### MongoDB Connection Issues:
- Ensure MONGODB_URI is set in `/app/backend/.env`
- Check if MongoDB Atlas IP whitelist includes your IP
- Verify the connection string format

### API Endpoints Not Working:
- Check if backend is running: `curl http://localhost:5000/api/health`
- Verify you're using correct JWT token for protected routes
- Check backend logs for errors

## 📊 Service Management

**Check Status:**
```bash
sudo supervisorctl status
```

**Restart Services:**
```bash
sudo supervisorctl restart backend
sudo supervisorctl restart frontend
sudo supervisorctl restart all
```

**Stop Services:**
```bash
sudo supervisorctl stop backend
sudo supervisorctl stop frontend
```

## 🔐 Security Notes

1. ✅ All API keys are in `.env` files (NOT committed to git)
2. ✅ `.gitignore` configured to exclude `.env` files
3. ✅ Passwords are hashed with bcrypt
4. ✅ JWT tokens for authentication
5. ✅ OTP codes expire in 10 minutes
6. ✅ No sensitive scan data is stored
7. ✅ AI assistant cannot reveal system prompts or API keys

## 📖 Next Steps

1. **Add API Keys**: Update `/app/backend/.env` with your API keys
2. **Test Registration**: Try creating a user account
3. **Test Security Tools**: Use the phishing scanner, website scanner, etc.
4. **Customize**: Modify colors, text, or features as needed
5. **Deploy**: When ready, deploy to production

## 🎉 You're All Set!

Your SafeNet AI cybersecurity platform is ready to use. Just add your API keys and you're good to go!

For support or questions, use the Help Desk feature in the application.

---

**Built with** 🛡️ **SafeNet AI**
