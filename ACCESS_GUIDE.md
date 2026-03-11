# 🔑 SafeNet AI Access & User Guide

This guide explains how to access the various modules of the SafeNet AI platform once the application is running.

---

## 📍 Access Points

| Component | Local URL | Description |
| :--- | :--- | :--- |
| **User Dashboard** | `http://localhost:3000` | The primary entry point for all security tools. |
| **Backend API** | `http://localhost:5000/api` | The API root (requires JWT for most routes). |
| **API Health Check** | `http://localhost:5000/api/health` | Verify if the backend is responsive. |

---

## 🛡️ Getting Started

### 1. Account Creation
Navigate to the Register page. You will need to:
- Provide a valid email.
- Verify your account via an OTP (Check local console logs if email service is not configured).
- Set a secure password.

### 2. Scanning Tools
Once logged in, you can access the following modules from the sidebar or dashboard:

- **Phishing Scanner**: Paste text or upload screenshots for real-time analysis.
- **Website Scanner**: Enter any URL to check against 70+ global security engines.
- **Breach Checker**: Enter an email to see if it's part of any known data leaks.
- **AI Protocol**: Consult the integrated AI for customized security advice.

### 3. Engagement Log
Your history is tracked in the **Profile** section.
- View previous scan results.
- **Expand Cards**: Click on any log entry to see the full technical breakdown.
- **Export Data**: Download reports in PDF, CSV, or JSON format instantly.

---

## 🚦 Endpoint References (For Developers)

- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Authenticate & receive JWT
- `POST /api/scan/phishing` - Submit text/file for phishing scan
- `POST /api/scan/website` - Submit URL for malware scan
- `GET /api/history` - Retrieve your personal scan history