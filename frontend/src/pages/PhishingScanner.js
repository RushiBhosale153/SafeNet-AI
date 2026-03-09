import React, { useState } from 'react';
import { scanAPI } from '../services/api';
import { FaBug, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

const PhishingScanner = () => {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScan = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (message.trim().length === 0) {
      setError('Please enter a message to scan');
      return;
    }

    setLoading(true);

    try {
      const response = await scanAPI.phishing(message);
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
      critical: 'red-600'
    };
    return colors[level] || 'gray-400';
  };

  const getRiskIcon = (level) => {
    if (level === 'safe') return <FaCheckCircle className="text-cyber-green" />;
    return <FaExclamationTriangle className={`text-${getRiskColor(level)}`} />;
  };

  return (
    <div className="min-h-screen bg-cyber-black" data-testid="phishing-scanner-page">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <FaBug className="text-6xl text-cyber-red mx-auto mb-4 animate-pulse-slow" />
            <h1 className="text-4xl font-bold text-cyber-blue font-mono" data-testid="page-title">
              Phishing Scanner
            </h1>
            <p className="text-gray-400 mt-2">
              Paste suspicious messages to detect phishing attempts
            </p>
          </div>

          {/* Scan Form */}
          <div className="bg-cyber-darker border-2 border-cyber-blue rounded-lg p-6 mb-6">
            <form onSubmit={handleScan}>
              <label className="block text-cyber-blue font-bold mb-2">
                Message Content
              </label>
              <textarea
                data-testid="message-input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-cyber-black border-2 border-cyber-blue rounded-lg p-4 text-white min-h-[200px] focus:outline-none focus:border-cyber-green transition-colors"
                placeholder="Paste the message or email content here..."
              />
              
              <button
                type="submit"
                data-testid="scan-button"
                disabled={loading}
                className="mt-4 w-full bg-cyber-blue text-cyber-black font-bold py-3 rounded-lg hover:bg-cyber-green transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-cyber"
              >
                {loading ? 'Scanning...' : 'Scan Message'}
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
          {result && (
            <div className="bg-cyber-darker border-2 border-cyber-green rounded-lg p-6" data-testid="scan-results">
              <h2 className="text-2xl font-bold text-cyber-green mb-4 flex items-center">
                {getRiskIcon(result.riskLevel)}
                <span className="ml-2">Scan Results</span>
              </h2>

              <div className="space-y-4">
                {/* Risk Level */}
                <div className="bg-cyber-black border border-cyber-blue rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 font-bold">Risk Level:</span>
                    <span className={`text-${getRiskColor(result.riskLevel)} font-bold uppercase text-xl`} data-testid="risk-level">
                      {result.riskLevel}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-bold">Risk Score:</span>
                    <span className="text-cyber-blue font-bold text-xl" data-testid="risk-score">
                      {result.riskScore}/100
                    </span>
                  </div>
                </div>

                {/* Detected Threats */}
                {result.detectedThreats && result.detectedThreats.length > 0 && (
                  <div className="bg-cyber-black border border-cyber-red rounded-lg p-4">
                    <h3 className="text-cyber-red font-bold mb-2">Detected Threats:</h3>
                    <ul className="list-disc list-inside space-y-1" data-testid="detected-threats">
                      {result.detectedThreats.map((threat, index) => (
                        <li key={index} className="text-gray-300">{threat}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Advice */}
                <div className="bg-cyber-black border border-cyber-green rounded-lg p-4">
                  <h3 className="text-cyber-green font-bold mb-2">Security Advice:</h3>
                  <p className="text-gray-300" data-testid="security-advice">{result.advice}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhishingScanner;