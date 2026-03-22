const axios = require('axios');

/**
 * Google Safe Browsing Service
 * Checks URL against Google's malware and phishing lists.
 */
const checkGoogleSafeBrowsing = async (url) => {
  try {
    const apiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
    if (!apiKey) {
      return { status: 'unavailable', message: 'API key not configured' };
    }

    const response = await axios.post(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`,
      {
        client: { clientId: "cybernet-ai", clientVersion: "1.0.0" },
        threatInfo: {
          threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [{ url: url }]
        }
      },
      { 
        headers: { 
          'Content-Type': 'application/json',
          'User-Agent': 'CyberNet-AI/1.0.0'
        },
        timeout: 10000 
      }
    );

    const hasMatches = response.data && response.data.matches && response.data.matches.length > 0;

    if (hasMatches) {
      const threats = response.data.matches.map(m => m.threatType);
      return {
        status: 'flagged',
        threats: threats,
        reason: `Detected as ${threats.join(', ')} by Google Safe Browsing`
      };
    }

    return { status: 'not_flagged' };
  } catch (error) {
    if (error.response?.status === 403) {
      console.error('GSB Error: API not enabled or restricted (403). Ensure "Safe Browsing API" is enabled in GCP Console.');
      return { status: 'error', message: 'API disabled in GCP Console', diag: '403 Forbidden' };
    }
    console.error('GSB Error Response:', error.response?.data || error.message);
    return { status: 'error', message: 'Service failure' };
  }
};

module.exports = checkGoogleSafeBrowsing;
