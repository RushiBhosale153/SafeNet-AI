import React, { useState } from 'react';
import { scanAPI } from '../services/api';
import { 
  FaGlobe, FaExclamationTriangle,
  FaFilePdf,
  FaLink, FaRobot
} from 'react-icons/fa';
import { exportToPDF } from '../utils/exportUtils';
import { motion, AnimatePresence } from 'framer-motion';

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
      // Use the unified scanner for consistency and AI explanations
      const response = await scanAPI.unified(url);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Scan failed. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getVerdictColor = (verdict) => {
    switch(verdict?.toLowerCase()) {
      case 'high risk': case 'malicious': return 'text-cyber-red border-cyber-red/50 bg-cyber-red/10';
      case 'medium risk': case 'suspicious': return 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10';
      case 'low risk': case 'safe': case 'likely safe': return 'text-cyber-green border-cyber-green/50 bg-cyber-green/10';
      default: return 'text-gray-400 border-gray-400/50 bg-gray-400/10';
    }
  };



  return (
    <div className="min-h-screen bg-cyber-black pb-20 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <FaGlobe className="text-6xl text-cyber-blue mx-auto mb-4 animate-pulse-slow" />
            <h1 className="text-4xl font-black uppercase tracking-widest">Website <span className="text-cyber-blue">Scanner</span></h1>
            <p className="text-gray-500 font-mono text-xs mt-2 uppercase">Deep URL Intelligence & Reputation Probe</p>
          </div>

          {/* Form */}
          <div className="glass border border-cyber-blue/30 rounded-2xl p-8 mb-12 shadow-2xl">
            <form onSubmit={handleScan} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FaLink className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-black/60 border-2 border-cyber-blue/20 rounded-xl py-4 pl-12 pr-6 focus:border-cyber-blue transition-all font-mono text-sm"
                  placeholder="Enter URL (e.g., https://example.com)..."
                />
              </div>
              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="bg-cyber-blue text-black font-black uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-white transition-all disabled:opacity-30"
              >
                {loading ? 'Analyzing...' : 'Execute Scan'}
              </button>
            </form>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-cyber-red/10 border border-cyber-red/30 p-4 rounded-xl text-cyber-red flex items-center gap-3 mb-8">
                <FaExclamationTriangle /> <span className="text-xs font-mono uppercase">{error}</span>
              </motion.div>
            )}

            {loading && (
              <div className="flex flex-col items-center py-20">
                <div className="w-12 h-12 border-4 border-cyber-blue border-t-transparent rounded-full animate-spin mb-4"></div>
                <div className="text-cyber-blue font-mono text-[10px] uppercase animate-pulse">Contacting Global Nodes...</div>
              </div>
            )}

            {result && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="glass border border-cyber-blue/20 rounded-3xl p-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-white/5 pb-8">
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Target Identity</div>
                      <div className="font-mono text-cyber-blue text-sm break-all">{result.normalizedUrl || result.target}</div>
                    </div>
                    <div className={`text-2xl font-black uppercase px-6 py-2 rounded-xl border-2 ${getVerdictColor(result.verdict || result.riskLevel)}`}>
                      {result.verdict || result.riskLevel}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <div className="md:col-span-8 space-y-6">
                       <h3 className="text-xs font-bold text-cyber-blue uppercase tracking-widest flex items-center gap-2">
                         <FaRobot /> AI Intelligence Explanation
                       </h3>
                       <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                         {result.aiExplanation}
                       </div>
                    </div>
                    <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-black/40 rounded-2xl border border-white/5">
                       <div className="text-[10px] text-gray-500 uppercase font-bold mb-4">Risk Score</div>
                       <div className="text-6xl font-black text-cyber-blue">{result.riskScore || 0}</div>
                       <div className="text-[10px] text-gray-500 uppercase font-bold mt-2">of 100</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-4">
                  <button onClick={() => exportToPDF(result)} className="flex items-center gap-2 px-6 py-2 bg-cyber-red/10 border border-cyber-red/30 rounded text-[10px] text-cyber-red font-bold uppercase hover:bg-cyber-red/20 transition-all">
                    <FaFilePdf /> Export Report
                  </button>
                  <button onClick={() => { setUrl(''); setResult(null); }} className="px-6 py-2 bg-white/5 border border-white/10 rounded text-[10px] text-gray-500 font-bold uppercase hover:text-white transition-all">
                    Reset
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default WebsiteScanner;