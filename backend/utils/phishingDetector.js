const phishingKeywords = [
  'urgent', 'verify', 'suspend', 'account', 'security', 'alert', 'click here',
  'confirm', 'password', 'bank', 'payment', 'prize', 'winner', 'congratulations',
  'claim', 'expire', 'immediately', 'act now', 'limited time', 'verify account',
  'update payment', 'unusual activity', 'locked', 'suspended'
];

const suspiciousPatterns = [
  /https?:\/\/[^\s]+/gi, // URLs
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, // Email addresses
  /\b\d{16}\b/g, // Credit card numbers
  /password/gi,
  /ssn|social security/gi
];

const detectPhishing = (message) => {
  let riskScore = 0;
  let detectedThreats = [];
  const messageLower = message.toLowerCase();

  // Check for phishing keywords
  phishingKeywords.forEach(keyword => {
    if (messageLower.includes(keyword)) {
      riskScore += 10;
      detectedThreats.push(`Suspicious keyword: "${keyword}"`);
    }
  });

  // Check for suspicious patterns
  if (message.match(/https?:\/\/[^\s]+/gi)) {
    riskScore += 15;
    detectedThreats.push('Contains URL links');
  }

  if (message.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi)) {
    riskScore += 5;
    detectedThreats.push('Contains email address');
  }

  // Check for urgency indicators
  const urgencyWords = ['urgent', 'immediately', 'act now', 'expire'];
  urgencyWords.forEach(word => {
    if (messageLower.includes(word)) {
      riskScore += 8;
    }
  });

  // Check for all caps (shouting)
  const capsRatio = (message.match(/[A-Z]/g) || []).length / message.length;
  if (capsRatio > 0.5 && message.length > 20) {
    riskScore += 10;
    detectedThreats.push('Excessive use of capital letters');
  }

  // Determine risk level
  let riskLevel;
  let advice;

  if (riskScore >= 50) {
    riskLevel = 'critical';
    advice = '🚨 High phishing risk! Do not click any links or provide personal information. Delete this message immediately.';
  } else if (riskScore >= 30) {
    riskLevel = 'high';
    advice = '⚠️ Likely phishing attempt. Be extremely cautious. Verify sender through official channels before taking action.';
  } else if (riskScore >= 15) {
    riskLevel = 'medium';
    advice = '⚡ Suspicious content detected. Verify the authenticity before responding or clicking links.';
  } else if (riskScore > 0) {
    riskLevel = 'low';
    advice = '✓ Low risk, but stay vigilant. Always verify unexpected messages.';
  } else {
    riskLevel = 'safe';
    advice = '✅ No obvious phishing indicators detected. Message appears safe.';
  }

  return {
    riskScore,
    riskLevel,
    detectedThreats,
    advice,
    analysisDetails: {
      keywordsFound: detectedThreats.length,
      messageLength: message.length
    }
  };
};

module.exports = { detectPhishing };