import React, { useState } from 'react';
import { scanAPI } from '../services/api';
import { FaGlobe, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { MdSecurity } from 'react-icons/md';

const WebsiteScanner = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScan = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (url.trim().length === 0) {
      setError('Please enter a URL to scan');
      return;
    }

    setLoading(true);

    try {
      const response = await scanAPI.website(url);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Scan failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    const colors = {
      safe: 'cyber-green',
      low: 'yellow-400',
      medium: 'orange-400',
      high: 'cyber-red',
      critical: 'red-600',
      unknown: 'gray-400'
    };
    return colors[level] || 'gray-400';
  };

  const getRiskIcon = (level) => {
    if (level === 'safe') return <FaCheckCircle className="text-cyber-green" />;
    return <FaExclamationTriangle className={`text-${getRiskColor(level)}`} />;
  };

  return (
    <div className="min-h-screen bg-cyber-black" data-testid="website-scanner-page">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <FaGlobe className="text-6xl text-cyber-blue mx-auto mb-4 animate-pulse-slow" />
            <h1 className="text-4xl font-bold text-cyber-blue font-mono" data-testid="page-title">
              Website Scanner
            </h1>
            <p className="text-gray-400 mt-2">
              Check websites for malware and security threats using VirusTotal
            </p>
          </div>

          {/* Scan Form */}
          <div className="bg-cyber-darker border-2 border-cyber-blue rounded-lg p-6 mb-6">
            <form onSubmit={handleScan}>
              <label className="block text-cyber-blue font-bold mb-2">
                Website URL
              </label>
              <input
                type="url"
                data-testid="url-input"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-cyber-black border-2 border-cyber-blue rounded-lg p-4 text-white focus:outline-none focus:border-cyber-green transition-colors"
                placeholder="https://example.com"
              />
              
              <button
                type="submit"
                data-testid="scan-button"
                disabled={loading}
                className="mt-4 w-full bg-cyber-blue text-cyber-black font-bold py-3 rounded-lg hover:bg-cyber-green transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-cyber"
              >
                {loading ? 'Scanning... (This may take a few seconds)' : 'Scan Website'}
              </button>
            </form>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-cyber-red/20 border border-cyber-red text-cyber-red px-4 py-3 rounded-lg mb-6" data-testid="error-message">
              {error}
            </div>
          )}

          {/* Results */}
          {result && !result.error && (
            <div className="bg-cyber-darker border-2 border-cyber-green rounded-lg p-6" data-testid="scan-results">
              <h2 className="text-2xl font-bold text-cyber-green mb-4 flex items-center">
                <MdSecurity className="mr-2" />
                Scan Results
              </h2>

              <div className="space-y-4">
                {/* URL */}
                <div className="bg-cyber-black border border-cyber-blue rounded-lg p-4">
                  <span className="text-gray-400 font-bold block mb-1">Scanned URL:</span>
                  <span className="text-cyber-blue break-all" data-testid="scanned-url">{result.url}</span>
                </div>

                {/* Risk Level */}
                <div className="bg-cyber-black border border-cyber-blue rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-bold">Risk Level:</span>
                    <div className="flex items-center space-x-2">
                      {getRiskIcon(result.riskLevel)}
                      <span className={`text-${getRiskColor(result.riskLevel)} font-bold uppercase text-xl`} data-testid="risk-level">
                        {result.riskLevel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Detection Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-cyber-black border border-cyber-red rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-cyber-red mb-1" data-testid="malicious-count">
                      {result.maliciousCount || 0}
                    </div>
                    <div className="text-gray-400 text-sm">Malicious Detections</div>
                  </div>
                  <div className="bg-cyber-black border border-orange-400 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-orange-400 mb-1" data-testid="suspicious-count">
                      {result.suspiciousCount || 0}
                    </div>
                    <div className="text-gray-400 text-sm">Suspicious Detections</div>
                  </div>
                  <div className="bg-cyber-black border border-cyber-blue rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-cyber-blue mb-1" data-testid="total-engines">
                      {result.totalEngines || 0}
                    </div>
                    <div className="text-gray-400 text-sm">Security Engines</div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="bg-cyber-black border border-cyber-green rounded-lg p-4">
                  <h3 className="text-cyber-green font-bold mb-2">Recommendation:</h3>
                  <p className="text-gray-300">
                    {result.maliciousCount > 0 
                      ? '🚨 This website has been flagged as malicious. Do not visit or enter any information.'
                      : result.suspiciousCount > 0
                      ? '⚠️ This website shows suspicious activity. Proceed with caution.'
                      : '✅ No security threats detected. Website appears safe.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {result && result.error && (
            <div className="bg-cyber-red/20 border border-cyber-red text-cyber-red px-4 py-3 rounded-lg" data-testid="api-error-message">
              <strong>Error:</strong> {result.error}
              {result.details && <p className="mt-2 text-sm">{result.details}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebsiteScanner;