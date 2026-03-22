import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { historyAPI } from '../services/api';
import { FaUser, FaHistory, FaShieldAlt, FaExclamationTriangle, FaChevronDown, FaBug, FaEnvelope, FaGlobe, FaChevronRight, FaTerminal, FaFilePdf, FaFileCsv, FaFileCode, FaRobot } from 'react-icons/fa';
import { MdSecurity } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import { exportToPDF, exportToJSON, exportToCSV, normalizeReportData } from '../utils/exportUtils';

const Profile = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    const init = async () => {
      try { await historyAPI.seedDemo(); } catch (_) {}
      fetchHistory();
    };
    init();
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

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };
  const getRiskColor = (level) => {
    const colors = {
      safe: 'text-cyber-green',
      'likely safe': 'text-cyber-green',
      low: 'text-yellow-400',
      'low risk': 'text-yellow-400',
      medium: 'text-orange-400',
      'medium risk': 'text-orange-400',
      suspicious: 'text-orange-400',
      high: 'text-cyber-red',
      'high risk': 'text-cyber-red',
      critical: 'text-red-600',
      malicious: 'text-red-600'
    };
    return colors[level.toLowerCase()] || 'text-gray-400';
  };

  const getRiskBorder = (level) => {
    const borders = {
      safe: 'border-cyber-green/30',
      'likely safe': 'border-cyber-green/30',
      low: 'border-yellow-400/30',
      medium: 'border-orange-400/30',
      suspicious: 'border-orange-400/30',
      high: 'border-cyber-red/30',
      critical: 'border-red-600/30',
      malicious: 'border-red-600/30'
    };
    return borders[level.toLowerCase()] || 'border-gray-600/30';
  };

  const getScanTypeLabel = (type) => {
    const labels = {
      'phishing': 'Phishing Scan',
      'phishing-file': 'File Phishing Scan',
      'website': 'Website Scan',
      'leak-check': 'Leak Check'
    };
    return labels[type] || type;
  };

  const getScanTypeIcon = (type) => {
    switch(type) {
      case 'phishing': return <FaBug className="text-cyber-blue" />;
      case 'phishing-file': return <FaBug className="text-cyber-blue" />;
      case 'website': return <FaGlobe className="text-cyber-blue" />;
      case 'leak-check': return <FaEnvelope className="text-cyber-purple" />;
      default: return <FaHistory className="text-gray-400" />;
    }
  };

  const renderDetails = (item) => {
    const data = normalizeReportData(item);
    if (!data) return <p className="text-gray-500 font-mono text-xs italic">No detailed scan data available.</p>;

    return (
      <div className="space-y-6 pt-6 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-500">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black/40 p-4 rounded-xl border border-white/5">
            <div className="text-[10px] text-gray-500 uppercase font-black mb-1">Risk Score</div>
            <div className={`text-2xl font-black ${getRiskColor(item.riskLevel)}`}>{data.metrics.score}/100</div>
          </div>
          <div className="bg-black/40 p-4 rounded-xl border border-white/5">
            <div className="text-[10px] text-gray-500 uppercase font-black mb-1">Critical Hits</div>
            <div className="text-2xl font-black text-white">{data.metrics.totalHits}</div>
          </div>
          <div className="bg-black/40 p-4 rounded-xl border border-white/5">
            <div className="text-[10px] text-gray-500 uppercase font-black mb-1">Scan Status</div>
            <div className="text-2xl font-black text-cyber-blue font-mono">{data.status}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-cyber-blue uppercase tracking-widest border-b border-cyber-blue/10 pb-2">Technical Telemetry</h4>
            <div className="flex flex-wrap gap-2">
              {data.findings.map((finding, idx) => (
                <span key={idx} className="text-[9px] bg-white/5 border border-white/10 text-gray-400 px-3 py-1 rounded uppercase font-mono">
                  {finding}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-cyber-blue uppercase tracking-widest border-b border-cyber-blue/10 pb-2 flex items-center gap-2">
              <FaRobot /> AI Deep Analysis
            </h4>
            <div className="bg-black/40 p-4 rounded-xl border border-white/5 max-h-[200px] overflow-y-auto custom-scrollbar">
              <p className="text-[11px] text-gray-400 leading-relaxed whitespace-pre-wrap">
                {item.details?.aiExplanation || data.advice}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-cyber-black" data-testid="profile-page">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="glass border border-cyber-blue/30 rounded-2xl p-8 mb-10 relative overflow-hidden group">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyber-blue to-transparent opacity-50"></div>
            <div className="flex items-center space-x-8 relative z-10">
              <div className="relative">
                <div className="w-24 h-24 bg-cyber-blue rounded-full flex items-center justify-center relative z-10 cyber-glow-blue shadow-[0_0_30px_#00ffff44]">
                  <FaUser className="text-5xl text-cyber-black" />
                </div>
                <div className="absolute inset-0 bg-cyber-blue/20 blur-2xl rounded-full"></div>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white tracking-widest uppercase mb-2">
                  Agent <span className="text-cyber-blue">Profile</span>
                </h1>
                <p className="text-gray-500 font-mono text-sm uppercase tracking-widest" data-testid="user-email">
                  {user?.email}_SECURE_ID
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="glass border border-cyber-blue/20 rounded-xl p-8 text-center group hover:border-cyber-blue transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                 <FaShieldAlt className="text-6xl text-cyber-blue" />
              </div>
              <div className="text-5xl font-black text-white mb-2" data-testid="total-scans">
                {history.length}
              </div>
              <div className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-black">Invocations</div>
            </div>
            
            <div className="glass border border-cyber-green/20 rounded-xl p-8 text-center group hover:border-cyber-green transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                 <MdSecurity className="text-6xl text-cyber-green" />
              </div>
              <div className="text-5xl font-black text-white mb-2" data-testid="safe-scans">
                {history.filter(h => h.riskLevel === 'safe').length}
              </div>
              <div className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-black">Threats Neutralized</div>
            </div>

            <div className="glass border border-cyber-red/20 rounded-xl p-8 text-center group hover:border-cyber-red transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                 <FaHistory className="text-6xl text-cyber-red" />
              </div>
              <div className="text-5xl font-black text-white mb-2" data-testid="high-risk-scans">
                {history.filter(h => h.riskLevel === 'high' || h.riskLevel === 'critical').length}
              </div>
              <div className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-black">Critical Breaches</div>
            </div>
          </div>

          {/* Scan History - Interactive Accordion */}
          <div className="glass border border-cyber-blue/30 rounded-2xl overflow-hidden shadow-2xl">
            {/* Terminal Header */}
            <div className="bg-cyber-blue/20 px-8 py-4 border-b border-cyber-blue/30 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white tracking-widest uppercase flex items-center">
                 <FaHistory className="mr-3 text-cyber-blue" />
                 Engagement Log
              </h2>
              <div className="flex space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-cyber-red/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-cyber-green/50"></div>
              </div>
            </div>

            <div className="p-8 bg-black/40 min-h-[400px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="w-12 h-12 border-4 border-cyber-blue border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-cyber-blue font-mono text-xs uppercase tracking-widest animate-pulse">Syncing with Mainframe...</p>
                </div>
              ) : error ? (
                <div className="bg-cyber-red/10 border border-cyber-red/50 text-cyber-red p-6 rounded-xl flex items-center gap-4" data-testid="error-message">
                   <FaExclamationTriangle className="text-2xl" />
                   <div className="font-mono text-sm uppercase">{error}</div>
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-500 font-mono text-sm tracking-widest uppercase animate-pulse">
                    [DATABASE_EMPTY] - NO_LOG_ENTRIES_FOUND
                  </p>
                </div>
              ) : (
                <div className="space-y-4" data-testid="scan-history-list">
                  {history
                    .filter(item => !item.result.includes('[demo]'))
                    .map((item) => {
                      const isExpanded = expandedId === item._id;
                      return (
                        <div
                          key={item._id}
                          data-testid={`history-item-${item._id}`}
                          className={`glass border transition-all duration-300 rounded-xl overflow-hidden cursor-pointer group ${isExpanded ? 'border-cyber-blue shadow-[0_0_15px_rgba(0,255,255,0.1)]' : 'border-white/5 hover:border-white/20'}`}
                          onClick={() => toggleExpand(item._id)}
                        >
                          {/* Header Block */}
                          <div className={`p-6 relative transition-colors ${isExpanded ? 'bg-cyber-blue/5' : 'hover:bg-white/5'}`}>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                              <div className="flex-1">
                                <div className="flex items-center space-x-4 mb-3">
                                  <div className={`p-2 rounded-lg bg-black/60 border ${getRiskBorder(item.riskLevel)}`}>
                                     {getScanTypeIcon(item.scanType)}
                                  </div>
                                  <span className={`text-[10px] font-bold uppercase tracking-widest text-cyber-blue`}>
                                    {getScanTypeLabel(item.scanType)}
                                  </span>
                                  <span className="text-[10px] text-gray-600 font-mono uppercase">
                                    [{new Date(item.createdAt).toLocaleString().toUpperCase()}]
                                  </span>
                                </div>
                                <div className="text-sm font-mono text-white mb-2 break-all opacity-80 group-hover:opacity-100 transition-opacity flex items-center">
                                   <FaChevronRight className={`mr-3 text-[10px] text-cyber-blue transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                   {item.target}
                                </div>
                              </div>

                              <div className="flex items-center gap-6">
                                <div className={`inline-block text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-lg border-2 bg-black/60 ${getRiskColor(item.riskLevel).replace('text-', 'border-').replace('text-', 'text-')}`}>
                                  {item.riskLevel}
                                </div>
                                <FaChevronDown className={`text-gray-600 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-cyber-blue' : ''}`} />
                              </div>
                            </div>
                          </div>

                          {/* Expanded Content */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                              >
                                <div className="px-6 pb-8 bg-black/20">
                                   {renderDetails(item)}
                                   
                                   <div className="mt-8 flex flex-wrap items-center justify-between gap-6 border-t border-white/5 pt-6">
                                      <div className="flex items-center gap-3">
                                         <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mr-2">Export Protocol:</h4>
                                         <button 
                                           onClick={(e) => {
                                             e.stopPropagation();
                                             exportToPDF(item);
                                             setToast("PDF export started");
                                           }}
                                           className="px-3 py-1.5 bg-cyber-red/10 border border-cyber-red/30 rounded text-[9px] text-cyber-red font-bold uppercase tracking-widest hover:bg-cyber-red/20 transition-all flex items-center gap-2"
                                         >
                                            <FaFilePdf /> PDF
                                         </button>
                                         <button 
                                           onClick={(e) => {
                                             e.stopPropagation();
                                             exportToCSV(item.details);
                                             setToast("CSV export started");
                                           }}
                                           className="px-3 py-1.5 bg-cyber-green/10 border border-cyber-green/30 rounded text-[9px] text-cyber-green font-bold uppercase tracking-widest hover:bg-cyber-green/20 transition-all flex items-center gap-2"
                                         >
                                            <FaFileCsv /> CSV
                                         </button>
                                         <button 
                                           onClick={(e) => {
                                             e.stopPropagation();
                                             exportToJSON(item.details);
                                             setToast("JSON export started");
                                           }}
                                           className="px-3 py-1.5 bg-cyber-blue/10 border border-cyber-blue/30 rounded text-[9px] text-cyber-blue font-bold uppercase tracking-widest hover:bg-cyber-blue/20 transition-all flex items-center gap-2"
                                         >
                                            <FaFileCode /> JSON
                                         </button>
                                      </div>

                                      <div className="flex items-center gap-4">
                                         <button 
                                           onClick={(e) => {
                                             e.stopPropagation();
                                             navigator.clipboard.writeText(JSON.stringify(item.details, null, 2));
                                             setToast("JSON copied to clipboard");
                                           }}
                                           className="text-[9px] text-gray-500 hover:text-cyber-blue transition-colors uppercase font-bold tracking-widest flex items-center gap-2"
                                         >
                                            <FaTerminal /> Copy Logic
                                         </button>
                                         <div className="h-4 w-[1px] bg-white/10"></div>
                                         <span className="text-[9px] text-gray-600 font-mono uppercase">Node_ID: {item._id}</span>
                                      </div>
                                   </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 glass border border-cyber-blue/50 px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(0,255,255,0.2)]"
          >
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 bg-cyber-blue rounded-full animate-ping"></div>
               <span className="text-xs font-bold text-white uppercase tracking-widest">{toast}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;