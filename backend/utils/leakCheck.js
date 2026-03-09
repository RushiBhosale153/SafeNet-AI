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

    const response = await axios.get('https://leakcheck.io/api/public', {
      params: {
        key: apiKey,
        check: email,
        type: 'email'
      }
    });

    const data = response.data;

    // If LeakCheck says "not found", treat it as SAFE, not an error
    if (
      data?.success === false &&
      typeof data?.error === 'string' &&
      data.error.toLowerCase().includes('not found')
    ) {
      return {
        breachCount: 0,
        sources: [],
        riskLevel: 'safe',
        advice: 'No breaches found for this email. Stay vigilant!'
      };
    }

    // Other actual API failures
    if (data?.success === false) {
      return {
        error: data.error || 'Failed to check email',
        riskLevel: 'unknown'
      };
    }

    const breachCount = Number(data?.found || 0);
    const rawSources = Array.isArray(data?.sources) ? data.sources : [];

    const sources = rawSources.slice(0, 10).map((source) => {
      if (typeof source === 'string') {
        return {
          name: source,
          date: 'Unknown'
        };
      }

      return {
        name: source?.name || 'Unknown Source',
        date: source?.date || 'Unknown'
      };
    });

    let riskLevel = 'safe';
    if (breachCount > 10) {
      riskLevel = 'critical';
    } else if (breachCount > 5) {
      riskLevel = 'high';
    } else if (breachCount > 2) {
      riskLevel = 'medium';
    } else if (breachCount > 0) {
      riskLevel = 'low';
    }

    return {
      breachCount,
      sources,
      riskLevel,
      advice:
        breachCount > 0
          ? 'Your email has been found in data breaches. Change passwords for affected accounts immediately.'
          : 'No breaches found for this email. Stay vigilant!'
    };
  } catch (error) {
    const apiError = error.response?.data;
    const apiErrorMessage =
      typeof apiError?.error === 'string'
        ? apiError.error.toLowerCase()
        : '';

    // Also treat HTTP/API "not found" responses as SAFE
    if (
      error.response?.status === 404 ||
      apiErrorMessage.includes('not found')
    ) {
      return {
        breachCount: 0,
        sources: [],
        riskLevel: 'safe',
        advice: 'No breaches found for this email. Stay vigilant!'
      };
    }

    console.error('LeakCheck API error:', apiError || error.message);

    return {
      error: 'Failed to check email breach. Please try again.',
      details: apiError || error.message,
      riskLevel: 'unknown'
    };
  }
};

module.exports = { checkEmailBreach };