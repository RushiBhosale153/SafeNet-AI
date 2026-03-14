const dns = require('dns').promises;

/**
 * Resolves a hostname to its IP address.
 * @param {string} url - The URL to resolve.
 * @returns {Promise<string|null>} - The resolved IP address or null.
 */
const resolveIp = async (url) => {
  try {
    const hostname = new URL(url).hostname;
    const result = await dns.lookup(hostname);
    return result.address;
  } catch (err) {
    console.error(`IP Resolution failed for ${url}:`, err.message);
    return null;
  }
};

module.exports = resolveIp;
