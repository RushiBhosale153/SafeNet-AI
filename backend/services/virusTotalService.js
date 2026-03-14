const axios = require('axios');

/**
 * VirusTotal Service
 * Checks URL reputation using VirusTotal API v3.
 */
const checkVirusTotal = async (url) => {
  try {
    const apiKey = process.env.VT_API_KEY;
    if (!apiKey) {
      return { status: 'unavailable', message: 'API key not configured' };
    }

    // Submission
    const submitResponse = await axios.post(
      'https://www.virustotal.com/api/v3/urls',
      new URLSearchParams({ url }),
      {
        headers: {
          'x-apikey': apiKey,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: 10000
      }
    );

    const analysisId = submitResponse.data.data.id;

    // Polling (simplified for performance)
    let maxAttempts = 5;
    let stats = null;

    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      const analysisResponse = await axios.get(
        `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
        { headers: { 'x-apikey': apiKey } }
      );

      const status = analysisResponse.data.data.attributes.status;
      if (status === 'completed') {
        stats = analysisResponse.data.data.attributes.stats;
        break;
      }
    }

    if (!stats) {
      return { status: 'partial', message: 'Analysis in progress' };
    }

    const isFlagged = stats.malicious > 0;

    return {
      status: isFlagged ? 'flagged' : 'not_flagged',
      malicious: stats.malicious,
      suspicious: stats.suspicious,
      harmless: stats.harmless,
      undetected: stats.undetected,
      reason: isFlagged ? `Flagged by ${stats.malicious} security vendors on VirusTotal` : null
    };
  } catch (error) {
    console.error('VirusTotal Service Error:', error.response?.data || error.message);
    return { status: 'error', message: 'Service failure' };
  }
};

module.exports = checkVirusTotal;
