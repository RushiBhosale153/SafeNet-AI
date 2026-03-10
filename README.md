# SafeNet AI – Cybersecurity Threat Detection Platform 🛡️

SafeNet AI is a **full-stack cybersecurity web application** that helps users detect common online threats such as **phishing messages, malicious websites, and leaked email credentials**.

The platform integrates **threat intelligence APIs and AI-powered analysis** to provide users with real-time security insights and recommendations.

This project demonstrates practical implementation of **cybersecurity concepts, API integrations, and full-stack development using modern technologies**.

---


# 🚀 Features

## 🔐 Secure User Authentication
- Email registration with password encryption
- OTP email verification system
- JWT-based secure session management

---

## 🕵️ Phishing Message Scanner
Detect suspicious or malicious messages using pattern analysis.

**Features**
- Phishing keyword detection
- Risk scoring system
- Security advice for users

---

## 🌐 Website Malware Scanner
Check if a website is malicious using **VirusTotal API**.

**Features**
- Detect malicious URLs
- Identify suspicious websites
- Report security engine results

---

## 📧 Email Breach Checker
Check if an email address has been exposed in known data breaches using **LeakCheck API**.

**Features**
- Detect breached accounts
- Show breach sources
- Provide security recommendations

---

## 🤖 AI Cybersecurity Assistant
Integrated AI assistant that helps users understand cybersecurity threats and provides security guidance.

---

## 📊 Scan History Dashboard
Users can view previous scans and results securely.

**Privacy Protection**
- Scan metadata stored
- Sensitive user input not stored

---

# 🛠 Tech Stack

## Frontend
- React.js
- Tailwind CSS
- React Icons

## Backend
- Node.js
- Express.js
- JWT Authentication
- bcrypt Password Encryption

## Database
- MongoDB Atlas

## External APIs
- VirusTotal API
- LeakCheck API
- OpenRouter AI
- Resend Email API

---

# 🏗 System Architecture

SafeNet AI follows a **three-layer architecture**.

### Frontend Layer
React-based user interface.

### Backend Layer
Node.js REST APIs handling authentication, scanning logic, and security checks.

### Database Layer
MongoDB Atlas storing user data and scan metadata.

---

# 📂 Project Structure

CyberNet-AI
│
├── backend
│ ├── middleware
│ ├── models
│ ├── routes
│ ├── utils
│ └── server.js
│
├── frontend
│ ├── src
│ │ ├── pages
│ │ ├── components
│ │ └── services
│
├── assets
│ └── dashboard.png
│
├── .env.example
├── README.md
├── SETUP_GUIDE.md
├── ACCESS_GUIDE.md
└── PROJECT_SUMMARY.md


---

# ⚙ Installation Guide

```bash
1 Clone Repository
git clone https://github.com/RushiBhosale153/CyberNet-AI.git
cd CyberNet-AI



2 Setup Backend
cd backend
npm install

----------------------------------------
Create .env using .env.example

Example:

PORT=5000
MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret

EMAIL_SERVICE_KEY=your_resend_key
VIRUSTOTAL_API_KEY=your_virustotal_key
LEAKCHECK_API_KEY=your_leakcheck_key
OPENROUTER_API_KEY=your_ai_key

----------------------------------------
--------------------

Start backend
npm start

--------------------
--------------------

3 Setup Frontend
cd frontend
npm install
npm start


Frontend runs at:
http://localhost:3000

Backend runs at:
http://localhost:5000

🔒 Security Practices

- Password hashing using bcrypt

- JWT authentication

- Email OTP verification

- Input validation and sanitization

- Environment variables for API keys

- .env protected using .gitignore


🔐 Privacy Notice

- SafeNet AI prioritizes user privacy.

- The system does not store sensitive scan inputs such as:

- scanned messages

- scanned URLs

- scanned email addresses

- Only scan metadata is stored.


🚀 Future Improvements

- Machine learning phishing detection

- Browser extension for phishing protection

- Dark web credential monitoring

- Advanced AI threat analysis

- Real-time cybersecurity alerts


📜 License
MIT License

