const axios = require('axios');

const scanWebsite = async (url) => {
  try {
    const apiKey = process.env.VIRUSTOTAL_API_KEY;

    if (!apiKey) {
      return {
        error: 'VirusTotal API key not configured',
        riskLevel: 'unknown'
      };
    }

    // Submit URL for scanning
    const submitResponse = await axios.post(
      'https://www.virustotal.com/api/v3/urls',
      new URLSearchParams({ url }),
      {
        headers: {
          'x-apikey': apiKey,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const analysisId = submitResponse.data.data.id;

    // Wait a moment for analysis
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Get analysis results
    const analysisResponse = await axios.get(
      `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
      {
        headers: {
          'x-apikey': apiKey
        }
      }
    );

    const stats = analysisResponse.data.data.attributes.stats;
    const maliciousCount = stats.malicious || 0;
    const suspiciousCount = stats.suspicious || 0;
    const totalEngines = Object.values(stats).reduce((a, b) => a + b, 0);

    let riskLevel;
    if (maliciousCount > 5) {
      riskLevel = 'critical';
    } else if (maliciousCount > 2) {
      riskLevel = 'high';
    } else if (maliciousCount > 0 || suspiciousCount > 2) {
      riskLevel = 'medium';
    } else if (suspiciousCount > 0) {
      riskLevel = 'low';
    } else {
      riskLevel = 'safe';
    }

    return {
      maliciousCount,
      suspiciousCount,
      totalEngines,
      riskLevel,
      stats,
      permalink: analysisResponse.data.data.links.self
    };
  } catch (error) {
    console.error('VirusTotal API error:', error.response?.data || error.message);
    return {
      error: 'Failed to scan website. Please try again.',
      details: error.response?.data?.error?.message || error.message,
      riskLevel: 'unknown'
    };
  }
};

module.exports = { scanWebsite };