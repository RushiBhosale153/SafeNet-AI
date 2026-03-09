const axios = require('axios');

const checkEmailBreach = async (email) => {
  try {
    const apiKey = process.env.LEAKCHECK_API_KEY;

    if (!apiKey) {
      return {
        error: 'LeakCheck API key not configured',
        riskLevel: 'unknown'
      };
    }

    const response = await axios.get(
      `https://leakcheck.io/api/public`,
      {
        params: {
          key: apiKey,
          check: email,
          type: 'email'
        }
      }
    );

    const data = response.data;

    if (data.success === false) {
      return {
        error: data.error || 'Failed to check email',
        riskLevel: 'unknown'
      };
    }

    const breachCount = data.found || 0;
    const sources = data.sources || [];

    let riskLevel;
    if (breachCount > 10) {
      riskLevel = 'critical';
    } else if (breachCount > 5) {
      riskLevel = 'high';
    } else if (breachCount > 2) {
      riskLevel = 'medium';
    } else if (breachCount > 0) {
      riskLevel = 'low';
    } else {
      riskLevel = 'safe';
    }

    return {
      breachCount,
      sources: sources.slice(0, 10), // Limit to 10 sources
      riskLevel,
      advice: breachCount > 0 
        ? 'Your email has been found in data breaches. Change passwords for affected accounts immediately.'
        : 'No breaches found for this email. Stay vigilant!'
    };
  } catch (error) {
    console.error('LeakCheck API error:', error.response?.data || error.message);
    return {
      error: 'Failed to check email breach. Please try again.',
      details: error.response?.data || error.message,
      riskLevel: 'unknown'
    };
  }
};

module.exports = { checkEmailBreach };