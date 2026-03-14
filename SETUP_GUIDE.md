# ⚙️ SafeNet AI Setup Guide

This guide covers the technical setup for local development of SafeNet AI.

## 🛠 Prerequisites

- **Node.js**: v18.x or v20.x (LTS recommended)
- **MongoDB**: A local instance or a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git**: For cloning and version control

---

## 🚀 Installation Steps

### 1. Repository Preparation
```bash
git clone https://github.com/RushiBhosale153/SafeNet-AI.git
cd SafeNet-AI
```

### 2. Backend Environment
The backend handles the orchestration of threat intelligence providers.
```bash
cd backend
npm install
cp .env.example .env
```
*Note: You must fill in the `.env` file with your own API keys for the scanner to function correctly.*

### 3. Frontend Environment
The frontend provides the interactive user dashboard.
```bash
cd ../frontend
npm install
```

---

## 🏃 Running the Servers

### Developer Mode (Local)

**Terminal 1: Backend**
```bash
cd backend
npm run dev
```

**Terminal 2: Frontend**
```bash
cd frontend
npm start
```

---

## ✅ Post-Setup Checklist

1. **Auth**: Register a new user and login.
2. **Scanner**: Run a test scan for `google.com`.
3. **Breach**: Enter an email to verify LeakCheck integration.
4. **Logs**: Ensure the "Engagement Log" displays your scan history.

## ⚠️ Common Issues

- **CORS Errors**: If the backend is on a different port than 5000, update `REACT_APP_BACKEND_URL` in your frontend environment.
- **Service Failures**: If a provider shows "Error", verify your API key in the backend `.env`.
- **GSB 403**: Ensure "Safe Browsing API" is enabled in your Google Cloud Console.