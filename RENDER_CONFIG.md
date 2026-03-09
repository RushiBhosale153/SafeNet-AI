# SafeNet AI Backend - Render Deployment

## Deployment Type
Web Service

## Build Command
```
cd backend && yarn install
```

## Start Command
```
cd backend && node server.js
```

## Environment Variables (Required)
Add these in Render Dashboard under "Environment":

```
MONGODB_URI=your_mongodb_atlas_uri
VIRUSTOTAL_API_KEY=your_virustotal_key
LEAKCHECK_API_KEY=your_leakcheck_key
OPENROUTER_API_KEY=your_openrouter_key
EMAIL_SERVICE_KEY=your_resend_key
JWT_SECRET=your_secure_jwt_secret
PORT=8001
NODE_ENV=production
```

## Health Check Path
```
/api/health
```

## Instance Type
- Free tier is sufficient for testing
- Upgrade to Starter for production use
