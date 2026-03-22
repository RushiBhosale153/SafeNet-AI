import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { scanAPI } from '../services/api';
import { FaShieldAlt, FaSearch, FaExclamationTriangle, FaCheckCircle, FaRobot, FaInfoCircle, FaLink, FaFilePdf } from 'react-icons/fa';
import { exportToPDF } from '../utils/exportUtils';
import { motion, AnimatePresence } from 'framer-motion';
import AiSummary from '../components/AiSummary';

const Home = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('scan'); // 'scan' or 'recent'
  
  const handleUnifiedScan = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await scanAPI.unified(input);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Scan failed. Connection lost or service unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (verdict) => {
    switch(verdict?.toLowerCase()) {
      case 'high risk': case 'malicious': return 'text-cyber-red border-cyber-red/50 bg-cyber-red/10';
      case 'medium risk': case 'suspicious': return 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10';
      case 'low risk': case 'safe': case 'likely safe': return 'text-cyber-green border-cyber-green/50 bg-cyber-green/10';
      default: return 'text-gray-400 border-gray-400/50 bg-gray-400/10';
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black text-white pb-20 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyber-blue/5 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyber-purple/5 blur-[120px] rounded-full"></div>

      <div className="container mx-auto px-4 pt-12 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block p-4 rounded-full bg-cyber-blue/10 border border-cyber-blue/20 mb-6"
            >
              <FaShieldAlt className="text-5xl text-cyber-blue animate-pulse-slow" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-6xl font-black uppercase tracking-tighter mb-4"
            >
              CyberNet <span className="text-cyber-blue">AI</span>
            </motion.h1>
            <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">
              Professional Unified Threat Detection Interface v4.0
            </p>
          </div>

          {/* Main Input Component */}
          <div className="glass border border-cyber-blue/30 rounded-3xl p-2 mb-12 shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/5 via-transparent to-cyber-purple/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <form onSubmit={handleUnifiedScan} className="relative flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-600" />
                </div>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Analyze URL, Email, or generic suspicious message content..."
                  className="w-full bg-black/40 border-none rounded-2xl py-6 pl-16 pr-6 text-lg focus:ring-2 ring-cyber-blue/50 transition-all font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-cyber-blue text-black font-black uppercase tracking-widest px-12 py-6 rounded-2xl hover:bg-white transition-all disabled:opacity-30 shadow-[0_0_20px_#00ffff44]"
              >
                {loading ? 'Initializing...' : 'Execute Scan'}
              </button>
            </form>
          </div>

          {/* Results Area */}
          <AnimatePresence>
            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20"
              >
                 <div className="w-16 h-16 border-4 border-cyber-blue border-t-transparent rounded-full animate-spin mb-6"></div>
                 <div className="text-cyber-blue font-mono animate-pulse uppercase tracking-[0.3em] text-xs">Synchronizing Intelligence Sources...</div>
              </motion.div>
            )}

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-cyber-red/10 border border-cyber-red/30 p-6 rounded-2xl text-cyber-red flex items-center gap-4 mb-12"
              >
                <FaExclamationTriangle className="text-2xl" />
                <div className="font-mono text-xs uppercase tracking-tight">ERR_FATAL: {error}</div>
              </motion.div>
            )}

            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20"
              >
                {/* Left Col: Verdict & AI Explanation */}
                <div className="lg:col-span-8 space-y-8">
                  <div className="glass border border-cyber-blue/20 rounded-3xl p-8 relative overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-8 border-b border-white/5">
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em] mb-2">Analysis Type: {result.type}</div>
                        <div className="text-cyber-blue font-mono text-sm break-all">{result.target}</div>
                      </div>
                      <div className={`text-2xl font-black uppercase px-8 py-3 rounded-xl border-2 ${getRiskColor(result.verdict || result.riskLevel)}`}>
                        {result.verdict || result.riskLevel}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                       <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                          <div className="text-[8px] text-gray-500 uppercase font-bold mb-1">Risk Score</div>
                          <div className={`text-xl font-black ${result.riskScore > 60 ? 'text-cyber-red' : result.riskScore > 30 ? 'text-yellow-400' : 'text-cyber-green'}`}>
                            {result.riskScore}/100
                          </div>
                       </div>
                       <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                          <div className="text-[8px] text-gray-500 uppercase font-bold mb-1">Confidence</div>
                          <div className="text-xl font-black text-cyber-blue">
                            {result.confidence?.score || 100}%
                          </div>
                       </div>
                       <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                          <div className="text-[8px] text-gray-500 uppercase font-bold mb-1">Status</div>
                          <div className="text-xl font-black text-cyber-green uppercase">Verified</div>
                       </div>
                       <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                          <div className="text-[8px] text-gray-500 uppercase font-bold mb-1">Integrity</div>
                          <div className="text-xl font-black text-cyber-purple uppercase">Secure</div>
                       </div>
                    </div>
                  </div>

                  <AiSummary 
                    explanation={result.aiExplanation} 
                    riskLevel={result.verdict || result.riskLevel} 
                  />

                  {/* Recommendation Card */}
                  <div className={`bg-cyber-blue/5 border border-cyber-blue/20 rounded-3xl p-8 border-l-8 ${
                    (result.verdict || result.riskLevel)?.toLowerCase().includes('safe') ? 'border-l-cyber-green' : 'border-l-cyber-red'
                  }`}>
                    <h3 className="text-xs font-bold text-cyber-blue uppercase tracking-widest mb-4 flex items-center gap-2">
                      <FaInfoCircle /> Protocol Recommendation
                    </h3>
                    <p className="text-white font-bold text-lg italic leading-snug">
                       "{result.advice || ( (result.verdict || result.riskLevel)?.toLowerCase().includes('safe') ? 'No action required. Content is safe for use.' : 'Exercise high caution. Do not interact with this resource.')}"
                    </p>
                  </div>
                </div>

                {/* Right Col: Stats & Export */}
                <div className="lg:col-span-4 space-y-8">
                  <div className="glass border border-cyber-blue/20 rounded-3xl p-8 text-center flex flex-col items-center justify-center">
                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-6">Consolidated Risk Score</div>
                    <div className="relative w-40 h-40">
                       <svg className="w-full h-full" viewBox="0 0 100 100">
                         <circle cx="50" cy="50" r="45" fill="none" stroke="#1a1a1a" strokeWidth="8" />
                         <circle 
                           cx="50" cy="50" r="45" fill="none" 
                           stroke={result.riskScore > 60 ? "#ff0000" : result.riskScore > 30 ? "#ffaa00" : "#00ff00"} 
                           strokeWidth="8" 
                           strokeDasharray={2 * Math.PI * 45}
                           strokeDashoffset={(1 - (result.riskScore || 0) / 100) * 2 * Math.PI * 45}
                           strokeLinecap="round"
                           transform="rotate(-90 50 50)"
                           className="transition-all duration-1000"
                         />
                       </svg>
                       <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <span className="text-4xl font-black">{result.riskScore || 0}</span>
                         <span className="text-[8px] text-gray-500 font-bold uppercase">of 100</span>
                       </div>
                    </div>
                     <p className="mt-8 text-[10px] text-gray-500 font-mono leading-relaxed uppercase">
                      Confidence Score: {result.confidence?.score || '100'}%<br/>
                      Heuristic depth: Level 4
                    </p>
                  </div>

                  <div className="space-y-4">
                    <button 
                      onClick={() => exportToPDF(result)}
                      className="w-full flex items-center justify-center gap-3 bg-cyber-red/10 border border-cyber-red/30 py-4 rounded-2xl text-cyber-red hover:bg-cyber-red/20 transition-all font-bold uppercase text-xs tracking-widest"
                    >
                      <FaFilePdf /> Export Detailed PDF
                    </button>
                    <button 
                      onClick={() => { setInput(''); setResult(null); }}
                      className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 py-4 rounded-2xl text-gray-500 hover:text-white transition-all font-bold uppercase text-xs tracking-widest"
                    >
                      Reset System ↺
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Feature Highlight */}
          {!result && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <FaLink className="text-3xl text-cyber-blue mx-auto mb-4" />
                <h4 className="font-bold text-xs uppercase mb-2">Real-time URL Scan</h4>
                <p className="text-[10px] text-gray-500 italic">Multi-source intelligence verification.</p>
              </div>
              <div className="p-6">
                <FaRobot className="text-3xl text-cyber-purple mx-auto mb-4" />
                <h4 className="font-bold text-xs uppercase mb-2">AI Explanation</h4>
                <p className="text-[10px] text-gray-500 italic">Deep insights into detected threats.</p>
              </div>
              <div className="p-6">
                <FaShieldAlt className="text-3xl text-cyber-green mx-auto mb-4" />
                <h4 className="font-bold text-xs uppercase mb-2">Unified Analysis</h4>
                <p className="text-[10px] text-gray-500 italic">One input for all security needs.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;