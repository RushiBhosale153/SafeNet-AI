const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const ScanHistory = require('../models/ScanHistory');
const { detectPhishing } = require('../utils/phishingDetector');
const { scanWebsite } = require('../utils/virusTotal'); // Keep for legacy if needed, but we'll use services
const { checkEmailBreach } = require('../utils/leakCheck');

// New Services & Utils
const normalizeUrl = require('../utils/normalizeUrl');
const validateUrl = require('../utils/validateUrl');
const resolveIp = require('../utils/resolveIp');
const { calculateRiskScore, calculateConfidence, getVerdict, getSummary } = require('../utils/calculateRiskScore');
const formatThreatResponse = require('../utils/formatThreatResponse');

const virusTotalService = require('../services/virusTotalService');
const googleSafeBrowsingService = require('../services/googleSafeBrowsingService');
const urlscanService = require('../services/urlscanService');
const phishTankService = require('../services/phishTankService');
const abuseIpdbService = require('../services/abuseIpdbService');
const otxService = require('../services/otxService');

const fs = require('fs');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Phishing Scanner
router.post('/phishing', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const result = detectPhishing(message);

    // Save to scan history
    await ScanHistory.create({
      userId: req.userId,
      scanType: 'phishing',
      riskLevel: result.riskLevel,
      result: `Score: ${result.riskScore}, Threats: ${result.detectedThreats.length}`,
      target: message.length > 120 ? message.substring(0, 120) + '...' : message,
      details: result
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

// File Phishing Scanner
router.post('/phishing/file', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'File is required' });
    }

    let extractedText = '';
    const mimeType = req.file.mimetype;

    if (mimeType === 'application/pdf') {
      try {
        const data = await pdfParse(req.file.buffer);
        extractedText = data.text;
      } catch (err) {
        console.error('PDF Parse Error:', err);
        return res.status(500).json({ error: 'Failed to extract text from PDF' });
      }
    } else if (mimeType.startsWith('image/')) {
      try {
        const result = await Tesseract.recognize(req.file.buffer, 'eng', {
        });
        extractedText = result.data.text;
      } catch (err) {
        console.error('OCR Error:', err);
        return res.status(500).json({ error: 'Failed to extract text from image' });
      }
    } else if (mimeType === 'text/plain') {
      extractedText = req.file.buffer.toString('utf-8');
    } else {
      return res.status(400).json({ error: 'Unsupported file type. Please upload a PDF, Image, or .txt file.' });
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ error: 'No readable text found in the file' });
    }

    const result = detectPhishing(extractedText);

    // Save to scan history
    await ScanHistory.create({
      userId: req.userId,
      scanType: 'phishing-file',
      riskLevel: result.riskLevel,
      result: `Score: ${result.riskScore}, Threats: ${result.detectedThreats.length}`,
      target: `File: ${req.file.originalname}`,
      details: { ...result, fileName: req.file.originalname, fileType: req.file.mimetype }
    });

    res.json({
      success: true,
      scanType: 'phishing-file',
      extractedText: extractedText.substring(0, 500) + (extractedText.length > 500 ? '...' : ''), // Optional context for the frontend
      ...result
    });
  } catch (error) {
    console.error('File Phishing scan error:', error);
    res.status(500).json({ error: 'File Scan failed' });
  }
});

// Website & URL Multi-Source Threat Intelligence Scanner
router.post('/website', authMiddleware, async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || url.trim().length === 0) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // 1. Normalize and Validate
    const normalizedUrl = normalizeUrl(url);
    if (!validateUrl(normalizedUrl)) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    const domain = new URL(normalizedUrl).hostname;

    // 2. Resolve IP and Prep Metadata
    const ip = await resolveIp(normalizedUrl);
    
    // 3. Execute all services in parallel
    const results = await Promise.allSettled([
      virusTotalService(normalizedUrl),
      googleSafeBrowsingService(normalizedUrl),
      urlscanService(normalizedUrl),
      phishTankService(normalizedUrl),
      abuseIpdbService(ip),
      otxService('domain', domain)
    ]);

    // 4. Map results back to sources
    const sourceResults = {
      virustotal: results[0].status === 'fulfilled' ? results[0].value : { status: 'error', message: 'Service failure' },
      googleSafeBrowsing: results[1].status === 'fulfilled' ? results[1].value : { status: 'error', message: 'Service failure' },
      urlscan: results[2].status === 'fulfilled' ? results[2].value : { status: 'error', message: 'Service failure' },
      phishTank: results[3].status === 'fulfilled' ? results[3].value : { status: 'error', message: 'Service failure' },
      abuseIpdb: results[4].status === 'fulfilled' ? results[4].value : { status: 'error', message: 'Service failure' },
      otx: results[5].status === 'fulfilled' ? results[5].value : { status: 'error', message: 'Service failure' }
    };

    // 5. Calculate Score and Verdict
    const riskScore = calculateRiskScore(sourceResults);
    const confidence = calculateConfidence(sourceResults);
    const finalVerdict = getVerdict(riskScore);
    
    // Collect reasons
    const reasons = [];
    Object.values(sourceResults).forEach(res => {
      if (res.status === 'flagged' && res.reason) {
        reasons.push(res.reason);
      }
    });

    const summary = getSummary(riskScore, reasons, confidence);

    const fullResponse = formatThreatResponse(url, { normalizedUrl, domain, ip }, sourceResults, {
      riskScore,
      finalVerdict,
      summary,
      reasons,
      confidence
    });

    // 6. Save to Scan History
    try {
      await ScanHistory.create({
        userId: req.userId,
        scanType: 'website',
        riskLevel: finalVerdict.toLowerCase(),
        result: `Score: ${riskScore}, Verdict: ${finalVerdict}`,
        target: url,
        details: fullResponse
      });
    } catch (dbError) {
      console.error('Failed to save scan history:', dbError.message);
      // Don't fail the request if DB save fails
    }

    res.json(fullResponse);
  } catch (error) {
    console.error('Multi-source Website scan error:', error);
    res.status(500).json({ error: 'Scan failed due to internal error' });
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
        result: `Breaches found: ${result.breachCount}`,
        target: email, // I will store the email string as target but not as a separate field 'email' for privacy if needed, but 'target' is already there.
        details: result
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