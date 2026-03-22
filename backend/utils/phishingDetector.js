const phishingKeywords = [
  'urgent', 'verify', 'suspend', 'account', 'security', 'alert', 'click here',
  'confirm', 'password', 'bank', 'payment', 'prize', 'winner', 'congratulations',
  'claim', 'expire', 'immediately', 'act now', 'limited time', 'verify account',
  'update payment', 'unusual activity', 'locked', 'suspended', 'invoice',
  'shipping', 'delivery', 'amazon', 'netflix', '2fa', 'otp', 'gift card',
  'refund', 'unauthorized', 'action required', 'login attempt', 'bit.ly',
  't.co', 'goo.gl', 'security update', 'billing issue', 're-verify',
  'parcel', 'tracking', 'tax refund', 'irs', 'hmrc', 'whatsapp', 'telegram',
  'crypto', 'wallet', 'binance', 'coinbase', 'metamask', 'airdrop'
];

const suspiciousPatterns = [
  { regex: /https?:\/\/[^\s]+/gi, name: 'URL Link' },
  { regex: /\b[A-Z0-9._%+-]+@(?!(google|microsoft|amazon|apple|paypal)\.com)[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, name: 'External Email' },
  { regex: /\b\d{16}\b/g, name: 'Potential Card Number' },
  { regex: /password|credential|secret|key/gi, name: 'Sensitive Keyword' },
  { regex: /%[0-9A-F]{2}/gi, name: 'URL Encoding' },
  { regex: /\.{2,}/g, name: 'Suspicious Dots' },
  { regex: /(@|!|\$|&|\?){3,}/g, name: 'Excessive Symbols' }
];

const suspiciousTLDs = [
  '.xyz', '.top', '.pw', '.buzz', '.monster', '.icu', '.work', '.click', '.zip',
  '.casa', '.bid', '.gdn', '.loan', '.mom', '.men', '.live', '.today', '.rocks'
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
  suspiciousPatterns.forEach(pattern => {
    if (message.match(pattern.regex)) {
      riskScore += 12;
      detectedThreats.push(`Structural anomaly: ${pattern.name} detected`);
    }
  });

  // Check for suspicious TLDs if URL exists
  suspiciousTLDs.forEach(tld => {
    if (messageLower.includes(tld)) {
      riskScore += 20;
      detectedThreats.push(`High-risk domain extension found: ${tld}`);
    }
  });

  // Check for urgency indicators
  const urgencyWords = ['urgent', 'immediately', 'act now', 'expire', 'asap', 'within 24 hours'];
  urgencyWords.forEach(word => {
    if (messageLower.includes(word)) {
      riskScore += 8;
    }
  });

  // Check for money-related scam patterns
  const moneyPatterns = [/\$/, /amount/, /refund/, /payment/];
  moneyPatterns.forEach(pattern => {
    if (messageLower.match(pattern)) {
      riskScore += 5;
    }
  });

  // Check for all caps (shouting)
  const capsRatio = (message.match(/[A-Z]/g) || []).length / message.length;
  if (capsRatio > 0.5 && message.length > 20) {
    riskScore += 10;
    detectedThreats.push('Excessive use of capital letters');
  }

  // Cap risk score at 100
  riskScore = Math.min(riskScore, 100);

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