const mongoose = require('mongoose');

const scanHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scanType: {
    type: String,
    required: true,
    enum: ['phishing', 'phishing-file', 'website', 'leak-check']
  },
  riskLevel: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'critical', 'safe', 'unknown']
  },
  result: {
    type: String
  },
  target: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  details: {
    type: Object
  }
});

module.exports = mongoose.model('ScanHistory', scanHistorySchema);