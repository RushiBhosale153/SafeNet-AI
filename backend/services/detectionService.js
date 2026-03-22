const virusTotalService = require('./virusTotalService');
const googleSafeBrowsingService = require('./googleSafeBrowsingService');
const phishTankService = require('./phishTankService');
const urlscanService = require('./urlscanService');
const abuseIpdbService = require('./abuseIpdbService');
const otxService = require('./otxService');
const normalizeUrl = require('../utils/normalizeUrl');
const validateUrl = require('../utils/validateUrl');
const resolveIp = require('../utils/resolveIp');
const { detectPhishing } = require('../utils/phishingDetector');

/**
 * Detection Service
 * Handles multi-layer threat analysis for URLs, Emails, and Text.
 */
class DetectionService {
  /**
   * Identifies the type of input (URL, Email, or Text)
   */
  detectInputType(input) {
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (urlRegex.test(input)) return 'url';
    if (emailRegex.test(input)) return 'email';
    return 'text';
  }

  /**
   * Performs deep analysis on a URL
   */
  async analyzeUrl(url) {
    const normalizedUrl = normalizeUrl(url);
    if (!validateUrl(normalizedUrl)) {
      throw new Error('Invalid URL format');
    }

    const domain = new URL(normalizedUrl).hostname;
    const ip = await resolveIp(normalizedUrl);

    // Execute services in parallel
    const results = await Promise.allSettled([
      virusTotalService(normalizedUrl),
      googleSafeBrowsingService(normalizedUrl),
      urlscanService(normalizedUrl),
      phishTankService(normalizedUrl),
      abuseIpdbService(ip),
      otxService('domain', domain)
    ]);

    const sources = {
      virustotal: results[0].status === 'fulfilled' ? results[0].value : { status: 'error' },
      googleSafeBrowsing: results[1].status === 'fulfilled' ? results[1].value : { status: 'error' },
      urlscan: results[2].status === 'fulfilled' ? results[2].value : { status: 'error' },
      phishTank: results[3].status === 'fulfilled' ? results[3].value : { status: 'error' },
      abuseIpdb: results[4].status === 'fulfilled' ? results[4].value : { status: 'error' },
      otx: results[5].status === 'fulfilled' ? results[5].value : { status: 'error' }
    };

    const { riskScore, confidence } = this.calculateUrlRiskStats(sources);
    const verdict = this.getVerdict(riskScore);

    return {
      type: 'url',
      target: url,
      normalizedUrl,
      domain,
      ip,
      sources,
      riskScore,
      confidence,
      verdict,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Performs analysis on raw text/phishing content
   */
  async analyzeText(text) {
    const result = detectPhishing(text);
    return {
      type: 'text',
      target: text.length > 100 ? text.substring(0, 100) + '...' : text,
      ...result,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Calculates weighted risk score and confidence level
   */
  calculateUrlRiskStats(sources) {
    let score = 0;
    let confidencePoints = 0;
    const totalSources = Object.keys(sources).length;

    // 1. VirusTotal (Max 40)
    if (sources.virustotal?.status !== 'error' && sources.virustotal?.status !== 'unavailable') {
      confidencePoints++;
      const vt = sources.virustotal;
      if (vt.malicious >= 5) score += 40;
      else if (vt.malicious >= 3) score += 30;
      else if (vt.malicious >= 1) score += 20;
    }

    // 2. Google Safe Browsing (Max 35)
    if (sources.googleSafeBrowsing?.status !== 'error' && sources.googleSafeBrowsing?.status !== 'unavailable') {
      confidencePoints++;
      if (sources.googleSafeBrowsing.status === 'flagged') score += 35;
    }

    // 3. PhishTank (Max 25)
    if (sources.phishTank?.status !== 'error' && sources.phishTank?.status !== 'unavailable') {
      confidencePoints++;
      if (sources.phishTank.status === 'flagged') score += 25;
    }

    // 4. urlscan.io (Max 20)
    if (sources.urlscan?.status !== 'error' && sources.urlscan?.status !== 'unavailable') {
      confidencePoints++;
      const us = sources.urlscan;
      if (us.score >= 80 || us.status === 'flagged') score += 20;
      else if (us.score >= 50) score += 15;
      else if (us.score >= 20) score += 10;
    }

    // 5. AbuseIPDB (Max 15)
    if (sources.abuseIpdb?.status !== 'error' && sources.abuseIpdb?.status !== 'unavailable') {
      confidencePoints++;
      const ab = sources.abuseIpdb;
      if (ab.abuseConfidenceScore >= 75) score += 15;
      else if (ab.abuseConfidenceScore >= 50) score += 10;
      else if (ab.abuseConfidenceScore >= 25) score += 5;
    }

    // 6. OTX (Max 10)
    if (sources.otx?.status !== 'error' && sources.otx?.status !== 'unavailable') {
      confidencePoints++;
      const otx = sources.otx;
      if (otx.pulseCount >= 5) score += 10;
      else if (otx.pulseCount >= 1) score += 5;
    }

    return {
      riskScore: Math.min(score, 100),
      confidence: {
        score: Math.round((confidencePoints / totalSources) * 100),
        level: confidencePoints >= 5 ? 'High' : confidencePoints >= 3 ? 'Medium' : 'Low'
      }
    };
  }

  /**
   * Returns a human-readable verdict
   */
  getVerdict(score) {
    if (score >= 75) return 'Malicious';
    if (score >= 45) return 'Suspicious';
    if (score >= 15) return 'Low Risk';
    return 'Safe';
  }
}

module.exports = new DetectionService();
