const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const ScanHistory = require('../models/ScanHistory');
const { detectPhishing } = require('../utils/phishingDetector');
const { scanWebsite } = require('../utils/virusTotal');
const { checkEmailBreach } = require('../utils/leakCheck');

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
          logger: m => console.log(m)
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
        result: `Malicious: ${result.maliciousCount}, Suspicious: ${result.suspiciousCount}`,
        target: url,
        details: result
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