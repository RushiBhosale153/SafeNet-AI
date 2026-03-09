import React, { useState } from 'react';
import { scanAPI } from '../services/api';
import { FaEnvelope, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { MdSecurity } from 'react-icons/md';

const LeakChecker = () => {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheck = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (email.trim().length === 0) {
      setError('Please enter an email address');
      return;
    }

    setLoading(true);

    try {
      const response = await scanAPI.leakCheck(email);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Check failed. Please try again.');
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
    <div className="min-h-screen bg-cyber-black" data-testid="leak-checker-page">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <FaEnvelope className="text-6xl text-cyber-purple mx-auto mb-4 animate-pulse-slow" />
            <h1 className="text-4xl font-bold text-cyber-blue font-mono" data-testid="page-title">
              Email Leak Checker
            </h1>
            <p className="text-gray-400 mt-2">
              Check if your email has been compromised in data breaches
            </p>
          </div>

          {/* Check Form */}
          <div className="bg-cyber-darker border-2 border-cyber-blue rounded-lg p-6 mb-6">
            <form onSubmit={handleCheck}>
              <label className="block text-cyber-blue font-bold mb-2">
                Email Address
              </label>
              <input
                type="email"
                data-testid="email-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-cyber-black border-2 border-cyber-blue rounded-lg p-4 text-white focus:outline-none focus:border-cyber-green transition-colors"
                placeholder="your@email.com"
              />
              
              <div className="bg-cyber-blue/10 border border-cyber-blue rounded-lg p-3 mt-3">
                <p className="text-gray-300 text-sm">
                  🔒 <strong>Privacy Notice:</strong> Your email is NOT stored. We only save scan metadata.
                </p>
              </div>

              <button
                type="submit"
                data-testid="check-button"
                disabled={loading}
                className="mt-4 w-full bg-cyber-blue text-cyber-black font-bold py-3 rounded-lg hover:bg-cyber-green transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-cyber"
              >
                {loading ? 'Checking...' : 'Check for Breaches'}
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
            <div className="bg-cyber-darker border-2 border-cyber-green rounded-lg p-6" data-testid="check-results">
              <h2 className="text-2xl font-bold text-cyber-green mb-4 flex items-center">
                <MdSecurity className="mr-2" />
                Breach Check Results
              </h2>

              <div className="space-y-4">
                {/* Risk Level */}
                <div className="bg-cyber-black border border-cyber-blue rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-400 font-bold">Risk Level:</span>
                    <div className="flex items-center space-x-2">
                      {getRiskIcon(result.riskLevel)}
                      <span className={`text-${getRiskColor(result.riskLevel)} font-bold uppercase text-xl`} data-testid="risk-level">
                        {result.riskLevel}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-bold">Breaches Found:</span>
                    <span className="text-cyber-red font-bold text-3xl" data-testid="breach-count">
                      {result.breachCount || 0}
                    </span>
                  </div>
                </div>

                {/* Breach Sources */}
                {result.sources && result.sources.length > 0 && (
                  <div className="bg-cyber-black border border-cyber-red rounded-lg p-4">
                    <h3 className="text-cyber-red font-bold mb-3">Breach Sources:</h3>
                    <div className="space-y-2" data-testid="breach-sources">
                      {result.sources.map((source, index) => (
                        <div key={index} className="bg-cyber-darker border border-cyber-red/50 rounded p-3">
                          <div className="text-gray-300">
                            🚨 <strong className="text-cyber-red">{source}</strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Advice */}
                <div className="bg-cyber-black border border-cyber-green rounded-lg p-4">
                  <h3 className="text-cyber-green font-bold mb-2">Recommendation:</h3>
                  <p className="text-gray-300" data-testid="security-advice">{result.advice}</p>
                  
                  {result.breachCount > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-cyber-blue font-bold">Immediate Actions:</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                        <li>Change passwords for all affected accounts immediately</li>
                        <li>Enable two-factor authentication (2FA) where available</li>
                        <li>Monitor your accounts for suspicious activity</li>
                        <li>Consider using a password manager</li>
                      </ul>
                    </div>
                  )}
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

export default LeakChecker;