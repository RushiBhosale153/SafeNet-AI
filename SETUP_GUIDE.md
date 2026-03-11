# ⚙️ SafeNet AI Setup Guide

Follow this guide to get your local development environment up and running.

## 🛠 Prerequisites
- **Node.js**: v18.0.0 or higher
- **Package Manager**: npm (v9+)
- **Database**: A MongoDB Atlas cluster (free tier works)
- **Git**: For cloning the repository

---

## 🚀 Step-by-Step Installation

### 1. Clone the Repository
```bash
git clone https://github.com/RushiBhosale153/CyberNet-AI.git
cd CyberNet-AI
```

### 2. Backend Configuration
The backend handles API routing, authentication, and security integrations.

```bash
cd backend
npm install
```

**Environment Variables (`backend/.env`):**
Copy `.env.example` to `.env` and fill in the following:
- `MONGODB_URI`: Your Atlas connection string.
- `JWT_SECRET`: A long, random string for token signing.
- `VIRUSTOTAL_API_KEY`: Obtain from [VirusTotal](https://www.virustotal.com/gui/my-apikey).
- `LEAKCHECK_API_KEY`: Obtain from [LeakCheck](https://leakcheck.io/).
- `GEMINI_API_KEY`: Obtain from [Google AI Studio](https://aistudio.google.com/).

### 3. Frontend Configuration
The frontend provides the interactive user dashboard.

```bash
cd ../frontend
npm install
```

---

## 🏃 Running the Servers

### Start the Backend
Execute this in the `backend/` directory:
```bash
npm run dev
```
*Port: 5000 (Default)*

### Start the Frontend
Execute this in the `frontend/` directory:
```bash
npm start
```
*Port: 3000 (Default)*

---

## ✅ Post-Installation Checks
1. Navigate to `http://localhost:3000`.
2. Register a new account.
3. Check the "Engagement Log" to ensure the database connection is active.
4. Run a "Safe" website scan (e.g., google.com) to verify VirusTotal integration.

---

## 🛠 Troubleshooting
- **CORS Error**: Ensure the backend's `ALLOWED_ORIGIN` matches your frontend URL.
- **Port Conflict**: If port 3000 is taken, update the `PORT` in your frontend environment.
- **DB Connection**: Verify that your IP is whitelisted in the MongoDB Atlas Network Access settings.