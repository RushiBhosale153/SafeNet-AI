/**
 * Calculates a weighted risk score based on detections from multiple sources.
 */
const calculateRiskScore = (results) => {
  let score = 0;

  // VirusTotal
  if (results.virustotal && results.virustotal.status === 'flagged' && results.virustotal.malicious > 0) {
    score += 45;
  }

  // Google Safe Browsing
  if (results.googleSafeBrowsing && results.googleSafeBrowsing.status === 'flagged') {
    score += 35;
  }

  // PhishTank
  if (results.phishTank && results.phishTank.status === 'flagged') {
    score += 30;
  }

  // urlscan.io
  if (results.urlscan && results.urlscan.status === 'flagged') {
    score += 20;
  }

  // AbuseIPDB
  if (results.abuseIpdb && results.abuseIpdb.status === 'flagged' && results.abuseIpdb.abuseConfidenceScore > 50) {
    score += 15;
  }

  // OTX AlienVault
  if (results.otx && results.otx.status === 'flagged') {
    score += 10;
  }

  return Math.min(score, 100);
};

/**
 * Calculates scan confidence based on successful provider responses.
 */
const calculateConfidence = (results) => {
  const sources = Object.values(results);
  const total_sources = sources.length;
  const responding_sources = sources.filter(s => s.status !== 'error' && s.status !== 'unavailable').length;
  
  return {
    percentage: Math.round((responding_sources / total_sources) * 100),
    responding_sources,
    total_sources
  };
};

/**
 * Returns a text verdict based on the risk score.
 */
const getVerdict = (score) => {
  if (score >= 50) return 'Malicious';
  if (score >= 25) return 'Suspicious';
  return 'Likely Safe';
};

/**
 * Generates a summary explanation for the verdict.
 */
const getSummary = (score, reasons, confidence) => {
  const lowCoverage = confidence.percentage < 50;
  const coverageNote = lowCoverage ? " (Scan completed with limited intelligence sources due to missing API keys or service errors)" : "";

  if (score >= 50) {
    return `This URL is classified as malicious because it was flagged by multiple high-confidence threat intelligence sources.${coverageNote}`;
  }
  if (score >= 25) {
    return `This URL is considered suspicious. some intelligence sources detected potential issues or risky behavior.${coverageNote}`;
  }
  if (reasons.length > 0) {
    return `This URL appears mostly safe, but minor indicators were noted by some intelligence platforms.${coverageNote}`;
  }
  return `No security threats were detected by any of the analyzed intelligence sources. This URL is likely safe.${coverageNote}`;
};

module.exports = { calculateRiskScore, calculateConfidence, getVerdict, getSummary };
