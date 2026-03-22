# 📑 CyberNet AI: API Documentation

This document details the secure API endpoints provided by the CyberNet AI backend.

## 🔒 Authentication
All endpoints (except health and basic info) require a `Bearer` token in the `Authorization` header.

```http
Authorization: Bearer <your_jwt_token>
```

---

## 🛰️ Security Scanning

### 1. Unified Multi-Source Scan
Performs a deep analysis across all intelligence vectors.

- **URL**: `POST /api/scan/unified`
- **Payload**:
  ```json
  { "input": "https://example-suspicious-link.com" }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "riskScore": 75,
    "confidence": { "score": 90, "level": "High" },
    "verdict": "Malicious",
    "aiExplanation": "### 🔍 Threat Analysis ... ### 🛡️ Risk Factors ...",
    "sources": { "virustotal": { ... }, "phishtank": { ... } }
  }
  ```

### 2. Email Leak Checker
Queries global breach databases for credential exposures.

- **URL**: `POST /api/scan/leak-check`
- **Payload**:
  ```json
  { "email": "user@example.com" }
  ```
- **Response**:
  ```json
  {
    "breachCount": 5,
    "riskLevel": "high",
    "sources": [ { "name": "Adobe", "date": "2013" } ],
    "advice": "Consider rotating your credentials immediately."
  }
  ```

---

## 🕰️ Engagement History

### 1. Fetch History
Retrieves the authenticated user's scan history and global stats.

- **URL**: `GET /api/history`
- **Response**:
  ```json
  {
    "history": [ { "target": "google.com", "riskLevel": "safe", ... } ],
    "stats": { "totalScans": 12, "threatsBlocked": 2 }
  }
  ```

---

## 🤖 Advanced AI

### 1. AI Assistant Chat
Interactive cybersecurity consultation unit.

- **URL**: `POST /api/ai/chat`
- **Payload**:
  ```json
  { "message": "How do I spot a phishing email?" }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "🔒 Spotting phishing requires vigilance. Look for..."
  }
  ```

---

## 🛠️ System Utilities

### 1. Health Check
- **URL**: `GET /api/health`
- **Response**: `{ "status": "ok", "version": "1.0.0" }`
