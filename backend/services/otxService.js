const axios = require('axios');

/**
 * OTX AlienVault Service
 * Checks for indicators of compromise (IOCs) in AlienVault OTX.
 */
const checkOTX = async (type, indicator) => {
  try {
    const apiKey = process.env.OTX_API_KEY;
    if (!apiKey) {
      return { status: 'unavailable', message: 'API key not configured' };
    }

    // type can be 'url', 'domain', or 'IPv4'
    const response = await axios.get(
      `https://otx.alienvault.com/api/v1/indicators/${type}/${indicator}/general`,
      {
        headers: { 'X-OTX-API-KEY': apiKey },
        timeout: 8000
      }
    );

    const pulseCount = response.data.pulse_info?.count || 0;
    const isFlagged = pulseCount > 0;

    return {
      status: isFlagged ? 'flagged' : 'not_flagged',
      pulseCount: pulseCount,
      reputation: response.data.reputation,
      reason: isFlagged ? `Identified in ${pulseCount} threat pulses on AlienVault OTX` : null
    };
  } catch (error) {
    console.error('OTX Service Error:', error.response?.data || error.message);
    return { status: 'error', message: 'Service failure' };
  }
};

module.exports = checkOTX;
