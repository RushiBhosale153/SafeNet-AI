const axios = require('axios');

/**
 * PhishTank Service
 * Checks if a URL is in the PhishTank database using their API.
 */
const checkPhishTank = async (url) => {
  try {
    const apiKey = process.env.PHISHTANK_API_KEY;
    
    // Using the official PhishTank check endpoint
    const response = await axios.post(
      'https://check.phishtank.com/check.php',
      require('querystring').stringify({
        url: url,
        format: 'json',
        app_key: apiKey || ''
      }),
      { 
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'phishtank/CyberNet-AI' 
        },
        timeout: 10000 
      }
    );

    if (response.data && response.data.results) {
      const result = response.data.results;
      if (result.in_database) {
        const isPhish = result.valid === true || result.valid === "true";
        return {
          status: isPhish ? 'flagged' : 'not_flagged',
          verified: result.verified,
          phishId: result.phish_id,
          reason: isPhish ? 'URL is a verified phishing site on PhishTank' : null
        };
      }
    }

    return { status: 'not_flagged' };
  } catch (error) {
    const errMsg = error.response?.data || error.message;
    console.error('PhishTank Error Response:', errMsg);
    return { status: 'error', message: 'Service failure', diag: errMsg };
  }
};

module.exports = checkPhishTank;
