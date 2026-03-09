#!/bin/bash

# SafeNet AI - Pre-Deployment Verification Script

echo "🛡️  SafeNet AI - Pre-Deployment Verification"
echo "=============================================="
echo ""

# Check 1: Verify .gitignore exists
echo "✓ Check 1: Verify .gitignore"
if [ -f "/app/.gitignore" ]; then
    echo "  ✅ .gitignore exists"
    if grep -q "\.env" /app/.gitignore; then
        echo "  ✅ .env files are excluded"
    else
        echo "  ❌ .env not in .gitignore!"
    fi
else
    echo "  ❌ .gitignore not found!"
fi
echo ""

# Check 2: Verify .env.example exists
echo "✓ Check 2: Verify .env.example"
if [ -f "/app/.env.example" ]; then
    echo "  ✅ .env.example exists"
else
    echo "  ❌ .env.example not found!"
fi
echo ""

# Check 3: Verify .env files are NOT tracked
echo "✓ Check 3: Verify .env files not tracked by git"
cd /app
if git ls-files | grep -q "\.env$"; then
    echo "  ❌ WARNING: .env files are tracked by git!"
    echo "  Run: git rm --cached backend/.env frontend/.env"
else
    echo "  ✅ .env files are not tracked"
fi
echo ""

# Check 4: Verify package.json files exist
echo "✓ Check 4: Verify package.json files"
if [ -f "/app/backend/package.json" ]; then
    echo "  ✅ Backend package.json exists"
else
    echo "  ❌ Backend package.json not found!"
fi

if [ -f "/app/frontend/package.json" ]; then
    echo "  ✅ Frontend package.json exists"
else
    echo "  ❌ Frontend package.json not found!"
fi
echo ""

# Check 5: Verify required documentation
echo "✓ Check 5: Verify documentation"
docs=("README.md" "DEPLOYMENT_GUIDE.md" ".env.example")
for doc in "${docs[@]}"; do
    if [ -f "/app/$doc" ]; then
        echo "  ✅ $doc exists"
    else
        echo "  ⚠️  $doc not found"
    fi
done
echo ""

# Check 6: Count files to be committed
echo "✓ Check 6: Project structure"
echo "  Backend files: $(find /app/backend -type f -not -path "*/node_modules/*" | wc -l)"
echo "  Frontend files: $(find /app/frontend -type f -not -path "*/node_modules/*" | wc -l)"
echo ""

# Check 7: Verify vercel.json
echo "✓ Check 7: Verify Vercel configuration"
if [ -f "/app/vercel.json" ]; then
    echo "  ✅ vercel.json exists"
else
    echo "  ⚠️  vercel.json not found (optional)"
fi
echo ""

# Summary
echo "=============================================="
echo "📋 Pre-Deployment Summary"
echo "=============================================="
echo ""
echo "✅ If all checks passed, you're ready to deploy!"
echo ""
echo "📤 Next Steps:"
echo "  1. Use 'Save to Github' button in chat interface"
echo "  2. Follow DEPLOYMENT_GUIDE.md for Vercel & Render"
echo "  3. Add environment variables in deployment platforms"
echo ""
echo "📚 Documentation:"
echo "  • Deployment Guide: /app/DEPLOYMENT_GUIDE.md"
echo "  • Render Config: /app/RENDER_CONFIG.md"
echo "  • README: /app/README.md"
echo ""
