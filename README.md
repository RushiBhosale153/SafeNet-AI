SafeNet AI – Cybersecurity Threat Detection Platform 🛡️

SafeNet AI is a full-stack cybersecurity web application that helps users detect common online threats such as phishing messages, malicious websites, and leaked email credentials.

The platform integrates threat intelligence APIs and AI-powered analysis to provide users with real-time security insights and recommendations.

This project demonstrates practical implementation of cybersecurity concepts, API integrations, and full-stack development using modern technologies.

Project Preview

(Add a screenshot of your application inside the assets folder)

Features
Secure User Authentication

Email registration with password encryption

OTP email verification system

JWT-based secure session management

Phishing Message Scanner

Detect suspicious or malicious messages using pattern analysis.

Features:

Phishing keyword detection

Risk scoring system

Security advice for users

Website Malware Scanner

Check if a website is malicious using threat intelligence from VirusTotal.

Features:

Detect malicious URLs

Identify suspicious websites

Report security engine results

Email Breach Checker

Check if an email address has been exposed in known data breaches using LeakCheck API.

Features:

Detect breached accounts

Show breach sources

Provide security recommendations

AI Cybersecurity Assistant

Integrated AI assistant that helps users understand cybersecurity threats and provides security guidance.

Scan History Dashboard

Users can view previous scans and results securely.

Privacy protection:

Scan metadata stored

Sensitive user input not stored

Tech Stack
Frontend

React.js

Tailwind CSS

React Icons

Backend

Node.js

Express.js

JWT Authentication

bcrypt Password Encryption

Database

MongoDB Atlas

External APIs

VirusTotal API (Malicious website detection)

LeakCheck API (Email breach detection)

OpenRouter AI (Cybersecurity assistant)

Resend Email API (OTP verification)

System Architecture

SafeNet AI follows a three-layer architecture.

Frontend Layer
React-based UI for user interaction.

Backend Layer
Node.js REST APIs handling authentication, scanning logic, and security checks.

Database Layer
MongoDB Atlas stores user accounts and scan metadata securely.

Project Structure
CyberNet-AI
│
├── backend
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── pages
│   │   ├── components
│   │   └── services
│
├── assets
│   └── dashboard.png
│
├── .env.example
├── README.md
├── SETUP_GUIDE.md
├── ACCESS_GUIDE.md
└── PROJECT_SUMMARY.md
Installation Guide
1 Clone the Repository
git clone https://github.com/YOUR_USERNAME/CyberNet-AI.git
cd CyberNet-AI
2 Setup Backend
cd backend
npm install

Create a .env file using .env.example.

Example:

PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret

EMAIL_SERVICE_KEY=your_resend_api_key
VIRUSTOTAL_API_KEY=your_virustotal_key
LEAKCHECK_API_KEY=your_leakcheck_key
OPENROUTER_API_KEY=your_ai_api_key

Start backend:

npm start
3 Setup Frontend
cd frontend
npm install
npm start

Frontend will run on:

http://localhost:3000

Backend runs on:

http://localhost:5000
Security Practices Implemented

Password hashing with bcrypt

JWT authentication

OTP email verification

Input validation and sanitization

Secure environment variables

Sensitive files excluded using .gitignore

Privacy Notice

SafeNet AI prioritizes user privacy.

The system does not store sensitive scan inputs such as:

scanned messages

scanned URLs

scanned email addresses

Only scan metadata is stored for user history.

Future Improvements

Potential enhancements include:

Machine learning based phishing detection

Browser extension for phishing protection

Real-time threat intelligence integration

Dark web credential monitoring

Advanced AI cybersecurity assistant

License

This project is licensed under the MIT License.