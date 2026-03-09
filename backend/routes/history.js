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

module.exports = router;