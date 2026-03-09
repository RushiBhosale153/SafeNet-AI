const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const ScanHistory = require('../models/ScanHistory');
const { detectPhishing } = require('../utils/phishingDetector');
const { scanWebsite } = require('../utils/virusTotal');
const { checkEmailBreach } = require('../utils/leakCheck');

// Phishing Scanner
router.post('/phishing', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const result = detectPhishing(message);

    // Save to scan history (DO NOT store the actual message)
    await ScanHistory.create({
      userId: req.userId,
      scanType: 'phishing',
      riskLevel: result.riskLevel,
      result: `Score: ${result.riskScore}, Threats: ${result.detectedThreats.length}`
    });

    res.json({
      success: true,
      scanType: 'phishing',
      ...result
    });
  } catch (error) {
    console.error('Phishing scan error:', error);
    res.status(500).json({ error: 'Scan failed' });
  }
});

// Website Scanner (VirusTotal)
router.post('/website', authMiddleware, async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || url.trim().length === 0) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    const result = await scanWebsite(url);

    if (!result.error) {
      // Save to scan history
      await ScanHistory.create({
        userId: req.userId,
        scanType: 'website',
        riskLevel: result.riskLevel,
        result: `Malicious: ${result.maliciousCount}, Suspicious: ${result.suspiciousCount}`
      });
    }

    res.json({
      success: !result.error,
      scanType: 'website',
      url: url,
      ...result
    });
  } catch (error) {
    console.error('Website scan error:', error);
    res.status(500).json({ error: 'Scan failed' });
  }
});

// Leak Checker
router.post('/leak-check', authMiddleware, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || email.trim().length === 0) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const result = await checkEmailBreach(email);

    if (!result.error) {
      // Save to scan history (DO NOT store the actual email)
      await ScanHistory.create({
        userId: req.userId,
        scanType: 'leak-check',
        riskLevel: result.riskLevel,
        result: `Breaches found: ${result.breachCount}`
      });
    }

    res.json({
      success: !result.error,
      scanType: 'leak-check',
      ...result
    });
  } catch (error) {
    console.error('Leak check error:', error);
    res.status(500).json({ error: 'Check failed' });
  }
});

module.exports = router;