# 🛰️ CyberNet AI
### Intelligent Cybersecurity Threat Detection Platform

CyberNet AI is a professional-grade cybersecurity platform that leverages multi-layer intelligence and GenAI to detect, analyze, and neutralize digital threats. From real-time phishing analysis to historical breach detection, CyberNet AI provides actionable transparency for modern security challenges.

---

## 🚀 Key Features

*   **🛡️ Multi-Layer Threat Detection**: Aggregated intelligence from VirusTotal, Google Safe Browsing, PhishTank, and more.
*   **⚖️ 0–100 Risk Scoring**: A weighted algorithmic scoring system for precise threat assessment.
*   **🤖 AI Deep Analysis**: Automated security summaries and protocol recommendations powered by **Google Gemini 1.5**.
*   **📊 SOC-Style Dashboard**: A professional Security Operations Center interface with real-time analytics and threat feeds.
*   **📧 Leak Checker**: Comprehensive credential breach auditing with detailed source reporting.
*   **📑 Intelligence Export**: Branded PDF and CSV report generation for security audits.
*   **⏳ Engagement Log**: Full persistence of scan history with drill-down technical telemetry.

---

## 💻 Tech Stack

**Frontend**
- React.js (High-performance UI)
- Tailwind CSS (Cyber-premium styling)
- Framer Motion (Dynamic micro-animations)
- Recharts (SOC analytics)

**Backend**
- Node.js & Express (Robust API core)
- MongoDB (Secure data persistence)
- Axios (Parallel intelligence fetching)

**Intelligence Core**
- Google Gemini AI (LLM Analyst)
- VirusTotal API
- AbuseIPDB
- AlienVault OTX
- LeakCheck.io

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Atlas or Local)
- API Keys for Gemini, VirusTotal, etc.

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/[your-repo]/CyberNet-AI.git
    cd CyberNet-AI
    ```

2.  **Backend Configuration**
    ```bash
    cd backend
    npm install
    cp .env.example .env
    # Update .env with your specific API keys
    npm start
    ```

3.  **Frontend Configuration**
    ```bash
    cd ../frontend
    npm install
    npm start
    ```

---

## 🔑 Environment Variables

Create a `backend/.env` file with the following:

| Key | Description |
|-----|-------------|
| `GEMINI_API_KEY` | Google AI Studio Key (for summaries) |
| `MONGODB_URI` | MongoDB Connection String |
| `VT_API_KEY` | VirusTotal API V3 Key |
| `LEAKCHECK_API_KEY` | LeakCheck.io Public API Key |
| `JWT_SECRET` | Secret key for secure authentication |

---

## 📸 Interface Preview

> [!TIP]
> **Dashboard**: Monitor live threats and aggregate statistics across your defense perimeter.
> **Scan Result**: View detailed AI-driven analysis for any suspicious URL or message.
> **Engagement Log**: Export ISO-compliant security reports directly from your profile.

---

## 🗺️ Roadmap
- [ ] Real-time browser extension for instant phishing protection.
- [ ] Advanced behavioral sandbox for file analysis.
- [ ] SIEM integration for enterprise-level log intake.

---
*CyberNet AI – Turning telemetry into transparency.*
