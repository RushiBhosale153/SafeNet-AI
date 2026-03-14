/**
 * Validates a URL string for basic correctness.
 * @param {string} url - The URL to validate.
 * @returns {boolean} - True if valid, false otherwise.
 */
const validateUrl = (url) => {
  if (!url) return false;
  
  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch (err) {
    return false;
  }
};

module.exports = validateUrl;
