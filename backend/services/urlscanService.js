const axios = require('axios');

/**
 * urlscan.io Service
 * Submits URL for behavioral analysis and polls for result.
 */
const checkUrlscan = async (url) => {
  try {
    const apiKey = process.env.URLSCAN_API_KEY;
    if (!apiKey) {
      return { status: 'unavailable', message: 'API key not configured' };
    }

    // 1. Submit scan
    const submitResponse = await axios.post(
      'https://urlscan.io/api/v1/scan/',
      { url, visibility: 'public' },
      {
        headers: { 'API-Key': apiKey, 'Content-Type': 'application/json' },
        timeout: 10000
      }
    );

    const uuid = submitResponse.data.uuid;

    // 2. Poll for result (max 15-20 seconds total wait)
    let maxAttempts = 5;
    let verdict = null;

    for (let i = 0; i < maxAttempts; i++) {
      // Wait before polling (urlscan needs time, 4s start, then every 3s)
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      try {
        const resultResponse = await axios.get(`https://urlscan.io/api/v1/result/${uuid}/`, {
          timeout: 5000
        });
        
        if (resultResponse.data && resultResponse.data.verdicts) {
          const overall = resultResponse.data.verdicts.overall;
          verdict = {
            status: overall.malicious ? 'flagged' : 'not_flagged',
            score: overall.score,
            brands: overall.brands,
            reason: overall.malicious ? 'Flagged as malicious by behavioral analysis on urlscan.io' : null
          };
          break;
        }
      } catch (e) {
        // Continue polling if not ready (usually 404 until processed)
        if (i === maxAttempts - 1) {
          console.error('urlscan Polling Timeout for UID:', uuid);
        }
      }
    }

    return verdict || { 
      status: 'partial', 
      message: 'Scan submitted, but result not yet available',
      scanUrl: submitResponse.data.result 
    };

  } catch (error) {
    console.error('urlscan Error Response:', error.response?.data || error.message);
    return { status: 'error', message: 'Could not complete scan on urlscan.io' };
  }
};

module.exports = checkUrlscan;
