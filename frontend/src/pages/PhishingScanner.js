import React, { useState, useRef } from 'react';
import { scanAPI } from '../services/api';
import { FaBug, FaExclamationTriangle, FaFileUpload, FaTimes, FaFilePdf, FaRobot } from 'react-icons/fa';
import { exportToPDF } from '../utils/exportUtils';
import { motion, AnimatePresence } from 'framer-motion';

const PhishingScanner = () => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleScan = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    if (message.trim().length === 0 && !file) {
      setError('Please enter a message or upload a file to scan');
      return;
    }

    setLoading(true);

    try {
      let response;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        response = await scanAPI.phishingFile(formData);
      } else {
        // Use unified for text as well for AI benefits
        response = await scanAPI.unified(message);
      }
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Scan failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (verdict) => {
    switch(verdict?.toLowerCase()) {
      case 'high risk': case 'malicious': case 'critical': return 'text-cyber-red border-cyber-red/50 bg-cyber-red/10';
      case 'medium risk': case 'suspicious': case 'high': return 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10';
      case 'low risk': case 'safe': return 'text-cyber-green border-cyber-green/50 bg-cyber-green/10';
      default: return 'text-gray-400 border-gray-400/50 bg-gray-400/10';
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black text-white pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <FaBug className="text-6xl text-cyber-red mx-auto mb-4 animate-pulse-slow" />
            <h1 className="text-4xl font-black uppercase tracking-widest">Phishing <span className="text-cyber-red">Probe</span></h1>
            <p className="text-gray-500 font-mono text-xs mt-2 uppercase">Heuristic & AI Pattern Analysis Engine</p>
          </div>

          {/* Form */}
          <div className="glass border border-cyber-red/30 rounded-2xl p-8 mb-12 shadow-2xl">
            <form onSubmit={handleScan}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`w-full bg-black/60 border-2 border-white/10 rounded-xl p-6 text-white min-h-[180px] focus:border-cyber-red transition-all font-mono text-sm mb-6 ${file ? 'opacity-30 pointer-events-none' : ''}`}
                placeholder="Paste suspicious message or email content here..."
              />
              
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex items-center gap-2">
                  <input type="file" ref={fileInputRef} onChange={(e) => setFile(e.target.files[0])} className="hidden" />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="flex-1 py-4 bg-white/5 border border-white/20 rounded-xl text-xs font-bold uppercase hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                    <FaFileUpload /> {file ? file.name : 'Upload Document'}
                  </button>
                  {file && <button type="button" onClick={() => setFile(null)} className="p-4 bg-cyber-red/20 text-cyber-red rounded-xl"><FaTimes /></button>}
                </div>
                <button type="submit" disabled={loading || (!message.trim() && !file)} className="bg-cyber-red text-white font-black uppercase tracking-widest px-12 py-4 rounded-xl hover:bg-white hover:text-black transition-all disabled:opacity-30">
                  {loading ? 'Analyzing...' : 'Execute Scan'}
                </button>
              </div>
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
                <div className="w-12 h-12 border-4 border-cyber-red border-t-transparent rounded-full animate-spin mb-4"></div>
                <div className="text-cyber-red font-mono text-[10px] uppercase animate-pulse">Running Depth Analysis...</div>
              </div>
            )}

            {result && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="glass border border-cyber-red/20 rounded-3xl p-8">
                   <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 border-b border-white/5 pb-8">
                      <div className="text-center md:text-left">
                        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Risk Assessment Score</div>
                        <div className="text-6xl font-black text-cyber-red">{result.riskScore || 0}<span className="text-sm opacity-50">/100</span></div>
                      </div>
                      <div className={`text-2xl font-black uppercase px-8 py-3 rounded-xl border-2 ${getRiskColor(result.verdict || result.riskLevel)}`}>
                        {result.verdict || result.riskLevel}
                      </div>
                   </div>

                   <div className="space-y-6">
                      <h3 className="text-xs font-bold text-cyber-red uppercase tracking-widest flex items-center gap-2">
                        <FaRobot /> AI Deep Analysis Report
                      </h3>
                      <div className="bg-black/60 border border-white/5 rounded-2xl p-6 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {result.aiExplanation || result.analysis}
                      </div>
                   </div>
                </div>

                <div className="flex justify-center gap-4">
                  <button onClick={() => exportToPDF(result)} className="flex items-center gap-2 px-6 py-2 bg-cyber-red/10 border border-cyber-red/30 rounded text-[10px] text-cyber-red font-bold uppercase hover:bg-cyber-red/20 transition-all">
                    <FaFilePdf /> Export Report
                  </button>
                  <button onClick={() => { setMessage(''); setFile(null); setResult(null); }} className="px-6 py-2 bg-white/5 border border-white/10 rounded text-[10px] text-gray-500 font-bold uppercase hover:text-white transition-all">
                    Reset System
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

export default PhishingScanner;