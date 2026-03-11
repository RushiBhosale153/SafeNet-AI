const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const ScanHistory = require('../models/ScanHistory');

// Get scan history for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const history = await ScanHistory.find({ userId: req.userId })
      .sort({ timestamp: -1 })
      .limit(50);

    res.json({
      success: true,
      history
    });
  } catch (error) {
    console.error('Fetch history error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Seed 2 demo scan entries for the logged-in user (idempotent)
router.post('/seed-demo', authMiddleware, async (req, res) => {
  try {
    const existing = await ScanHistory.countDocuments({
      userId: req.userId,
      result: { $regex: /\[demo\]/ }
    });

    if (existing >= 2) {
      return res.json({ success: true, message: 'Demo entries already exist' });
    }

    const now = new Date();

    await ScanHistory.insertMany([
      {
        userId: req.userId,
        scanType: 'phishing',
        riskLevel: 'low',
        result: 'Score: 8, Threats: 1 [demo]',
        timestamp: new Date(now.getTime() - 2 * 60 * 1000), // 2 min ago
        details: {
          riskScore: 8,
          riskLevel: 'low',
          detectedThreats: ['Suspicious keyword: "click here"'],
          advice: '✓ Low risk, but stay vigilant. Always verify unexpected messages.',
          analysisDetails: { keywordsFound: 1, messageLength: 45 }
        }
      },
      {
        userId: req.userId,
        scanType: 'website',
        riskLevel: 'medium',
        result: 'Malicious: 1, Suspicious: 3 [demo]',
        timestamp: new Date(now.getTime() - 1 * 60 * 1000), // 1 min ago
        details: {
          maliciousCount: 1,
          suspiciousCount: 3,
          totalEngines: 68,
          riskLevel: 'medium',
          permalink: 'https://www.virustotal.com/gui/home/upload'
        }
      }
    ]);

    res.json({ success: true, message: 'Demo entries created' });
  } catch (error) {
    console.error('Seed demo error:', error);
    res.status(500).json({ error: 'Failed to seed demo history' });
  }
});

module.exports = router;