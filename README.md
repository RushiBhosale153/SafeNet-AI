# SafeNet AI - Cybersecurity Web Application

A comprehensive full-stack cybersecurity platform with advanced security scanning tools and AI-powered assistance.

## 🛡️ Features

### Authentication
- User registration with Email OTP verification
- Secure login with JWT tokens
- Password hashing with bcrypt
- Email verification using Resend API

### Security Tools
1. **Phishing Scanner** - Detect phishing attempts using pattern recognition
2. **Website Scanner** - Scan URLs for malware using VirusTotal API
3. **Leak Checker** - Check if emails have been compromised using LeakCheck API
4. **AI Assistant** - Get cybersecurity advice from OpenRouter-powered AI

### Additional Features
- Scan history tracking (metadata only, no sensitive data stored)
- Help desk ticketing system
- User profile with scan statistics
- Dark cybersecurity-themed UI (black + neon blue/green)

## 🚀 Tech Stack

**Frontend:**
- React 18
- React Router v6
- Tailwind CSS
- Axios
- React Icons

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

**External APIs:**
- Resend (Email OTP)
- VirusTotal (Website scanning)
- LeakCheck (Email breach detection)
- OpenRouter (AI chatbot)

## 📁 Project Structure

```
safenet-ai/
├── backend/
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth middleware
│   ├── utils/            # Helper functions & API wrappers
│   ├── server.js         # Main server file
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API service layer
│   │   ├── context/      # Auth context
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env
├── .env.example          # Environment variables template
├── .gitignore
└── README.md
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- API Keys:
  - Resend API key
  - VirusTotal API key
  - LeakCheck API key
  - OpenRouter API key

### Installation

1. **Install Backend Dependencies**
```bash
cd backend
yarn install
```

2. **Install Frontend Dependencies**
```bash
cd frontend
yarn install
```

3. **Configure Environment Variables**

Edit the `.env` files in both `backend/` and `frontend/` directories with your actual API keys.

**Backend .env:**
```env
MONGODB_URI=your_mongodb_atlas_connection_string
VIRUSTOTAL_API_KEY=your_virustotal_api_key
LEAKCHECK_API_KEY=your_leakcheck_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
EMAIL_SERVICE_KEY=your_resend_api_key
JWT_SECRET=your_secure_jwt_secret_min_32_characters
PORT=5000
NODE_ENV=development
```

**Frontend .env:**
```env
REACT_APP_BACKEND_URL=http://localhost:5000
```

### Running the Application

**Using Supervisor (Production):**
```bash
sudo supervisorctl restart all
```

**Manual Mode:**

Backend:
```bash
cd backend
node server.js
```

Frontend:
```bash
cd frontend
yarn start
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/verify-otp` - Verify email with OTP
- `POST /api/auth/resend-otp` - Resend OTP code
- `POST /api/auth/login` - User login

### Security Scans (Protected)
- `POST /api/scan/phishing` - Scan message for phishing
- `POST /api/scan/website` - Scan URL with VirusTotal
- `POST /api/scan/leak-check` - Check email breaches

### AI Assistant (Protected)
- `POST /api/ai/chat` - Chat with AI assistant

### User Data (Protected)
- `GET /api/history` - Get user's scan history

### Help Desk
- `POST /api/helpdesk/submit` - Submit support ticket

## 🔒 Security Features

- All API keys stored in environment variables (never hardcoded)
- Password hashing with bcrypt (salt rounds: 10)
- JWT token-based authentication
- OTP expiry (10 minutes)
- Input validation and sanitization
- CORS enabled
- No sensitive user data stored (only scan metadata)
- AI assistant restricted to cybersecurity topics only

## 🎨 UI Theme

Dark cybersecurity theme with:
- Background: Pure black (#000000)
- Primary: Cyan blue (#00ffff)
- Secondary: Neon green (#00ff41)
- Accent: Purple (#9d00ff)
- Alert: Red (#ff0055)

## 📊 Data Storage

**Stored Data:**
- User credentials (email, hashed password)
- Scan metadata (type, risk level, timestamp)
- Support tickets

**NOT Stored:**
- Actual messages scanned for phishing
- URLs scanned
- Emails checked for breaches
- Chat conversations with AI

## 🧪 Testing

### Backend API Testing with curl:

**Health Check:**
```bash
curl http://localhost:5000/api/health
```

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 📝 Important Notes

- **API Keys Required:** Add your actual API keys to `backend/.env` before running
- **MongoDB URI:** Configure your MongoDB Atlas connection string
- **OTP Codes:** Expire after 10 minutes
- **JWT Tokens:** Expire after 7 days
- **Rate Limits:** VirusTotal free tier has 4 requests/minute
- **Development Mode:** If EMAIL_SERVICE_KEY is not set, OTP will be displayed in console/response

## 🤝 Support

For issues or questions, use the Help Desk feature in the application.

## 📄 License

MIT License

---

Built with 🛡️ by SafeNet AI
