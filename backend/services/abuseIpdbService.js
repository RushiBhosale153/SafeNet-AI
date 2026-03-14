const axios = require('axios');

/**
 * AbuseIPDB Service
 * Checks IP reputation for abuse history.
 */
const checkAbuseIpdb = async (ip) => {
  if (!ip) return { status: 'unavailable', message: 'No IP provided' };

  try {
    const apiKey = process.env.ABUSEIPDB_API_KEY;
    if (!apiKey) {
      return { status: 'unavailable', message: 'API key not configured' };
    }

    const response = await axios.get('https://api.abuseipdb.com/api/v2/check', {
      params: { ipAddress: ip, maxAgeInDays: 90 },
      headers: { 'Key': apiKey, 'Accept': 'application/json' },
      timeout: 8000
    });

    const data = response.data.data;
    const isFlagged = data.abuseConfidenceScore > 25;

    return {
      status: isFlagged ? 'flagged' : 'not_flagged',
      abuseConfidenceScore: data.abuseConfidenceScore,
      totalReports: data.totalReports,
      lastReportedAt: data.lastReportedAt,
      reason: isFlagged ? `Resolved IP ${ip} has an abuse confidence score of ${data.abuseConfidenceScore}%` : null
    };
  } catch (error) {
    console.error('AbuseIPDB Service Error:', error.response?.data || error.message);
    return { status: 'error', message: 'Service failure' };
  }
};

module.exports = checkAbuseIpdb;
