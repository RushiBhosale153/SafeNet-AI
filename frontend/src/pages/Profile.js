import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { historyAPI } from '../services/api';
import { FaUser, FaHistory, FaShieldAlt } from 'react-icons/fa';
import { MdSecurity } from 'react-icons/md';

const Profile = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await historyAPI.getHistory();
      setHistory(response.data.history);
    } catch (err) {
      setError('Failed to load scan history');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    const colors = {
      safe: 'text-cyber-green',
      low: 'text-yellow-400',
      medium: 'text-orange-400',
      high: 'text-cyber-red',
      critical: 'text-red-600'
    };
    return colors[level] || 'text-gray-400';
  };

  const getScanTypeLabel = (type) => {
    const labels = {
      'phishing': 'Phishing Scan',
      'website': 'Website Scan',
      'leak-check': 'Leak Check'
    };
    return labels[type] || type;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-cyber-black" data-testid="profile-page">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-cyber-blue/20 to-cyber-green/20 border-2 border-cyber-blue rounded-lg p-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-cyber-blue rounded-full flex items-center justify-center">
                <FaUser className="text-4xl text-cyber-black" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-cyber-blue font-mono" data-testid="profile-title">
                  User Profile
                </h1>
                <p className="text-gray-300 mt-1" data-testid="user-email">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-cyber-darker border-2 border-cyber-blue rounded-lg p-6 text-center">
              <FaShieldAlt className="text-4xl text-cyber-blue mx-auto mb-2" />
              <div className="text-3xl font-bold text-cyber-blue" data-testid="total-scans">
                {history.length}
              </div>
              <div className="text-gray-400">Total Scans</div>
            </div>
            <div className="bg-cyber-darker border-2 border-cyber-green rounded-lg p-6 text-center">
              <MdSecurity className="text-4xl text-cyber-green mx-auto mb-2" />
              <div className="text-3xl font-bold text-cyber-green" data-testid="safe-scans">
                {history.filter(h => h.riskLevel === 'safe').length}
              </div>
              <div className="text-gray-400">Safe Results</div>
            </div>
            <div className="bg-cyber-darker border-2 border-cyber-red rounded-lg p-6 text-center">
              <FaHistory className="text-4xl text-cyber-red mx-auto mb-2" />
              <div className="text-3xl font-bold text-cyber-red" data-testid="high-risk-scans">
                {history.filter(h => h.riskLevel === 'high' || h.riskLevel === 'critical').length}
              </div>
              <div className="text-gray-400">High Risk Detected</div>
            </div>
          </div>

          {/* Scan History */}
          <div className="bg-cyber-darker border-2 border-cyber-blue rounded-lg p-6">
            <h2 className="text-2xl font-bold text-cyber-blue mb-4 flex items-center">
              <FaHistory className="mr-2" />
              Scan History
            </h2>

            {loading ? (
              <div className="text-center py-8">
                <div className="text-cyber-blue animate-pulse">Loading history...</div>
              </div>
            ) : error ? (
              <div className="bg-cyber-red/20 border border-cyber-red text-cyber-red px-4 py-3 rounded-lg" data-testid="error-message">
                {error}
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-8" data-testid="no-history">
                <p className="text-gray-400">No scan history yet. Start by using our security tools!</p>
              </div>
            ) : (
              <div className="space-y-3" data-testid="scan-history-list">
                {history.map((scan, index) => (
                  <div
                    key={scan._id || index}
                    data-testid={`scan-item-${index}`}
                    className="bg-cyber-black border border-cyber-blue rounded-lg p-4 hover:border-cyber-green transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-cyber-blue font-bold">
                            {getScanTypeLabel(scan.scanType)}
                          </span>
                          <span className={`font-bold uppercase ${getRiskColor(scan.riskLevel)}`}>
                            {scan.riskLevel}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">{scan.result}</p>
                      </div>
                      <div className="text-gray-500 text-sm mt-2 md:mt-0">
                        {formatDate(scan.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;