/**
 * Merges results from all services and formats them for the frontend response.
 */
const formatThreatResponse = (url, metadata, sourceResults, scoreData) => {
  const { normalizedUrl, domain, ip } = metadata;
  const { riskScore, finalVerdict, summary, reasons, confidence } = scoreData;

  return {
    success: true,
    url,
    normalizedUrl,
    domain,
    ip,
    finalVerdict,
    riskScore,
    summary,
    reasons,
    confidence,
    sources: sourceResults
  };
};

module.exports = formatThreatResponse;
