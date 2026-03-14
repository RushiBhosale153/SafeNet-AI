/**
 * Normalizes a URL by adding protocol if missing and removing trailing slashes.
 * @param {string} url - The URL to normalize.
 * @returns {string} - The normalized URL.
 */
const normalizeUrl = (url) => {
  if (!url) return '';
  
  let normalized = url.trim().toLowerCase();
  
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = 'http://' + normalized;
  }
  
  // Remove trailing slashes
  normalized = normalized.replace(/\/+$/, '');
  
  return normalized;
};

module.exports = normalizeUrl;
