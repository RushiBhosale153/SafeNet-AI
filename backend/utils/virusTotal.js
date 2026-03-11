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

    // Poll for analysis results
    let maxAttempts = 10; // Wait up to 30 seconds
    let isCompleted = false;
    let stats = null;

    while (maxAttempts > 0 && !isCompleted) {
      await new Promise(resolve => setTimeout(resolve, 3000));

      const analysisResponse = await axios.get(
        `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
        {
          headers: {
            'x-apikey': apiKey
          }
        }
      );

      const status = analysisResponse.data.data.attributes.status;
      if (status === 'completed') {
        isCompleted = true;
        stats = analysisResponse.data.data.attributes.stats;
      }

      maxAttempts--;
    }

    if (!stats) {
      // If still not completed after polling, we can't provide accurate results
      return {
        error: 'Analysis took too long. Please try scanning again later.',
        riskLevel: 'unknown'
      };
    }

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
      permalink: `https://www.virustotal.com/gui/url/${analysisId}`
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