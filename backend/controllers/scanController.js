const detectionService = require('../services/detectionService');
const ScanHistory = require('../models/ScanHistory');
const { checkEmailBreach } = require('../utils/leakCheck');
const aiService = require('../services/aiService');

/**
 * Scan Controller
 * Handles unified scanning and coordinates between services
 */
const handleUnifiedScan = async (req, res) => {
  try {
    const { input } = req.body;
    const userId = req.userId;

    if (!input || input.trim().length === 0) {
      return res.status(400).json({ error: 'Input is required for scanning' });
    }

    const type = detectionService.detectInputType(input);
    let result;

    if (type === 'url') {
      result = await detectionService.analyzeUrl(input);
    } else if (type === 'email') {
      result = await checkEmailBreach(input);
      result.type = 'email';
      result.target = input;
    } else {
      result = await detectionService.analyzeText(input);
      result.type = 'text';
    }

    // Generate AI Explanation (Async but awaited for UI requirements)
    try {
        const explanation = await aiService.generateAiExplanation(result);
        result.aiExplanation = explanation;
    } catch (aiError) {
        console.error('AI Explanation failed:', aiError.message);
        result.aiExplanation = "AI explanation service is currently unavailable. Please review the technical signals manually.";
    }

    // Save to History
    try {
      await ScanHistory.create({
        userId,
        scanType: result.type,
        riskLevel: (result.verdict || result.riskLevel || 'unknown').toLowerCase(),
        result: `Score: ${result.riskScore || 0}, Verdict: ${result.verdict || result.riskLevel}`,
        target: result.target,
        details: result
      });
    } catch (dbError) {
      console.error('Failed to save scan history:', dbError.message);
    }

    res.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('Unified Scan Error:', error);
    res.status(500).json({ error: 'Deep scan failed. Please try again later.' });
  }
};

module.exports = {
  handleUnifiedScan
};
