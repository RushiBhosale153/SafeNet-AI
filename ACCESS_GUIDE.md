# 🔑 CyberNet AI Access & User Guide

This guide explains how to access and utilize the CyberNet AI security modules.

---

## 📍 Access Points

| Component | URL (Local) | Description |
| :--- | :--- | :--- |
| **User Dashboard** | `http://localhost:3000` | Primary entry point for all security tools. |
| **Backend API** | `http://localhost:5000` | The core orchestration engine. |

---

## 🛡️ Quick Start Guide

### 1. Unified Security Dashboard
Navigate to the Home page after logging in. You can access all modules via the sidebar or the central feature cards:
- **Phishing Scanner**: Analyze messages and upload screenshots.
- **Website Scanner**: The main hub for multi-source URL intelligence.
- **Breach Checker**: Real-time identification leak analysis.

### 2. Utilizing the Multi-Source Scanner
1. Go to the **Website Scanner** page.
2. Enter a URL (e.g., `https://google.com`).
3. View the **Risk Gauge** for an immediate verdict.
4. Scroll down to see the **Intelligence Source Breakdown**.
5. Read the **AI-Powered Summary** for a plain-English explanation of why the result was generated.

---

## 📊 Viewing History & Reports

- All scans are saved to the **Engagement Log** (linked to your MongoDB cluster).
- Click on any log entry to view the **Source breakdownUI**.
- Click **Export** to download the results in **PDF**, **CSV**, or **JSON** format.

---

## 🛠 Developer API Endpoints

- `POST /api/auth/register` - Create user account
- `POST /api/auth/login` - Authenticate & obtain JWT
- `POST /api/scan/website` - Execute multi-source URL scan
- `POST /api/scan/phishing` - Execute text-based phishing analysis
- `POST /api/scan/leak-check` - Execute email breach check
- `GET /api/history` - Retrieve authenticated scan history