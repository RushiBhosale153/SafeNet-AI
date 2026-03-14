import React, { useState, useRef } from 'react';
import { scanAPI } from '../services/api';
import { FaBug, FaExclamationTriangle, FaCheckCircle, FaFileUpload, FaTimes, FaFilePdf, FaFileCsv, FaFileCode } from 'react-icons/fa';
import { exportToPDF, exportToJSON, exportToCSV, normalizeReportData } from '../utils/exportUtils';

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
        response = await scanAPI.phishing(message);
      }
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Scan failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setMessage('');
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

  return (
    <div className="min-h-screen bg-cyber-black" data-testid="phishing-scanner-page">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="relative inline-block mb-4">
              <FaBug className="text-7xl text-cyber-blue animate-pulse-slow relative z-10" />
              <div className="absolute inset-0 bg-cyber-blue/20 blur-2xl rounded-full"></div>
            </div>
            <h1 className="text-5xl font-bold text-white tracking-widest uppercase mb-4">
              Phishing <span className="text-cyber-blue">Probe</span>
            </h1>
            <p className="text-gray-500 font-mono text-sm tracking-wider">
              [SYSTEM_LEVEL_SCAN] - v2.0.4 - HEURISTIC_PATTERNS_LOADED
            </p>
          </div>

          {/* Scan Form */}
          <div className="glass border border-cyber-blue/30 rounded-2xl p-8 mb-8 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyber-blue to-transparent opacity-50"></div>
            <form onSubmit={handleScan}>
              <div className="flex justify-between items-end mb-4">
                <label className="block text-cyber-blue text-xs font-bold uppercase tracking-widest">
                  Target Data Input
                </label>
                {!file && (
                  <span className="text-[10px] text-gray-500 font-mono italic animate-pulse">
                    READY_FOR_INPUT...
                  </span>
                )}
              </div>
              
              <div className="relative mb-6 group/field">
                <textarea
                  data-testid="message-input"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`w-full bg-black/60 border-2 border-cyber-blue/20 rounded-xl p-6 text-white min-h-[180px] focus:outline-none focus:border-cyber-blue transition-all duration-500 font-mono text-sm leading-relaxed ${file ? 'opacity-30 pointer-events-none' : ''}`}
                  placeholder="Paste message or email content here for deep analysis..."
                />
                <div className="absolute bottom-4 right-4 text-[10px] text-gray-500 font-mono uppercase">
                  buffer_size: {message.length}b
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full relative">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".txt,.pdf,image/*"
                  />
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 transition-all duration-500 font-bold uppercase tracking-widest text-sm ${
                        file 
                          ? 'border-cyber-green bg-cyber-green/10 text-cyber-green' 
                          : 'border-cyber-blue/30 text-cyber-blue hover:bg-cyber-blue/10'
                      }`}
                    >
                      <FaFileUpload className={file ? 'animate-bounce' : ''} />
                      {file ? `Linked: ${file.name}` : 'Link Source File'}
                    </button>
                    {file && (
                      <button
                        type="button"
                        onClick={clearFile}
                        className="p-4 bg-cyber-red/10 border-2 border-cyber-red/50 text-cyber-red rounded-xl hover:bg-cyber-red hover:text-white transition-all duration-300"
                        title="Deselect File"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  data-testid="scan-button"
                  disabled={loading || (!message.trim() && !file)}
                  className="w-full md:w-auto px-12 py-4 bg-cyber-blue text-cyber-black font-bold rounded-xl hover:bg-white transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-widest text-sm shadow-[0_0_20px_#00ffff]"
                >
                  {loading ? 'Initializing...' : file ? 'Execute File Scan' : 'Execute Text Scan'}
                </button>
              </div>

              <p className="mt-6 text-[10px] text-gray-500 text-center font-mono">
                SUPPORTS: .TXT / .PDF / .JPG / .PNG // MAX_SIZE: 5MB
              </p>
            </form>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-cyber-red/10 border border-cyber-red/50 text-cyber-red px-6 py-4 rounded-xl mb-8 flex items-center animate-shake" data-testid="error-message">
              <FaExclamationTriangle className="mr-3 text-xl" />
              <div className="font-mono text-xs uppercase tracking-tight">ERR_FATAL: {error}</div>
            </div>
          )}

          {/* Results Section - Terminal UI */}
          {(loading || result) && (
            <div className="glass border border-cyber-blue/40 rounded-xl overflow-hidden cyber-glow-blue shadow-2xl" data-testid="scan-results">
              {/* Terminal Header */}
              <div className="bg-cyber-blue/20 px-6 py-3 border-b border-cyber-blue/30 flex justify-between items-center">
                <div className="flex space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyber-red"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-cyber-green"></div>
                </div>
                <div className="text-[10px] font-mono text-cyber-blue uppercase font-bold tracking-widest">
                  Scan_Console output_{file ? 'file' : 'text'}
                </div>
                <div className="w-10"></div>
              </div>

              {/* Terminal Body */}
              <div className="p-8 bg-black/80 font-mono min-h-[300px] relative">
                {loading ? (
                  <div className="space-y-3">
                    <p className="text-cyber-blue text-xs">
                      <span className="text-gray-500">[0.000]</span> [INFO] Initializing scan engine...
                    </p>
                    <p className="text-cyber-blue text-xs">
                      <span className="text-gray-500">[0.412]</span> [INFO] Loading heuristic patterns...
                    </p>
                    <p className="text-cyber-blue text-xs">
                      <span className="text-gray-500">[1.115]</span> [INFO] Analyzing {file ? 'file_metadata' : 'text_structure'}...
                    </p>
                    <p className="text-cyber-green text-xs animate-pulse">
                      <span className="text-gray-500">[2.348]</span> [SCAN] Running depth analysis...
                    </p>
                    <div className="flex items-center space-x-2 mt-8">
                       <span className="w-2 h-2 bg-cyber-blue animate-ping"></span>
                       <span className="text-cyber-blue text-xs uppercase tracking-widest font-bold">Intercepting Data...</span>
                    </div>
                  </div>
                ) : result && (
                  <div className="animate-in fade-in transition-all duration-700">
                    {/* Normalized Data Access */}
                    {(() => {
                      const data = normalizeReportData({ ...result, scanType: file ? 'phishing-file' : 'phishing', target: message || file?.name });
                      return (
                        <>
                          <div className="flex flex-col md:flex-row items-center justify-between mb-8 border-b border-cyber-blue/20 pb-6 gap-6">
                            <div>
                              <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Risk Assessment Score</div>
                              <div className={`text-6xl font-bold tracking-tighter ${getRiskColor(result.riskLevel)}`}>
                                {data.metrics.score}<span className="text-2xl opacity-50">/100</span>
                              </div>
                            </div>
                            <div className="text-center md:text-right">
                              <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Status Level</div>
                              <div className={`text-2xl font-bold uppercase tracking-widest ${getRiskColor(result.riskLevel)}`}>
                                 {data.riskLevel}
                              </div>
                              {file && (
                                <div className="mt-2 text-[10px] bg-cyber-blue/20 text-cyber-blue px-2 py-1 rounded-md inline-block">
                                   FILE_ANALYSIS_MOD_v1.2
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                              <div>
                                <h4 className="text-xs font-bold text-cyber-blue uppercase tracking-widest mb-3 flex items-center">
                                  <span className="w-1.5 h-1.5 bg-cyber-blue rounded-full mr-2"></span>
                                  Threat Analysis
                                </h4>
                                <div className="bg-black/60 border border-cyber-blue/10 rounded-lg p-4 text-xs text-gray-400 border-l-2 border-l-cyber-blue leading-relaxed">
                                  {result.analysis}
                                </div>
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-cyber-blue uppercase tracking-widest mb-3 flex items-center">
                                   <span className="w-1.5 h-1.5 bg-cyber-blue rounded-full mr-2"></span>
                                   Security Findings
                                </h4>
                                <div className="space-y-2">
                                   {data.metrics.totalHits > 0 ? (
                                     <p className="text-xs text-cyber-red flex items-center">
                                        <FaExclamationTriangle className="mr-2" />
                                        DETECTION: {data.metrics.totalHits} CRITICAL_KEYWORD_MATCHES
                                     </p>
                                   ) : (
                                     <p className="text-xs text-cyber-green flex items-center">
                                        <FaCheckCircle className="mr-2" />
                                        CLEAN: NO_KNOWN_PATTERNS_DETECTED
                                     </p>
                                   )}
                                </div>
                              </div>
                            </div>

                            <div className="space-y-6">
                              <div>
                                <h4 className="text-xs font-bold text-cyber-blue uppercase tracking-widest mb-3 flex items-center">
                                  <span className="w-1.5 h-1.5 bg-cyber-blue rounded-full mr-2"></span>
                                  Protocol Advice
                                </h4>
                                <div className={`p-4 rounded-lg text-xs font-bold border ${
                                  result.riskLevel === 'safe' 
                                    ? 'bg-cyber-green/10 border-cyber-green/30 text-cyber-green'
                                    : 'bg-cyber-red/10 border-cyber-red/30 text-cyber-red'
                                }`}>
                                  {data.advice}
                                </div>
                              </div>
                              
                              <div className="pt-6 border-t border-cyber-blue/20 flex flex-wrap items-center justify-between gap-4">
                                 <div className="flex items-center gap-3">
                                    <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest mr-1">Export:</span>
                                    <button onClick={() => exportToPDF({ ...result, scanType: file ? 'phishing-file' : 'phishing', target: message || file?.name })} className="p-2 bg-cyber-red/10 border border-cyber-red/30 rounded text-cyber-red hover:bg-cyber-red/20 transition-all" title="Export PDF"><FaFilePdf /></button>
                                    <button onClick={() => exportToCSV({ ...result, scanType: file ? 'phishing-file' : 'phishing', target: message || file?.name })} className="p-2 bg-cyber-green/10 border border-cyber-green/30 rounded text-cyber-green hover:bg-cyber-green/20 transition-all" title="Export CSV"><FaFileCsv /></button>
                                    <button onClick={() => exportToJSON({ ...result, scanType: file ? 'phishing-file' : 'phishing', target: message || file?.name })} className="p-2 bg-cyber-blue/10 border border-cyber-blue/30 rounded text-cyber-blue hover:bg-cyber-blue/20 transition-all" title="Export JSON"><FaFileCode /></button>
                                 </div>
                                 <button 
                                   onClick={() => { setResult(null); setMessage(''); setFile(null); }}
                                   className="flex-1 md:flex-none py-2 px-6 bg-cyber-blue/10 border border-cyber-blue/50 text-cyber-blue text-[9px] uppercase font-bold tracking-widest hover:bg-cyber-blue/20 transition-all font-mono"
                                 >
                                   Reset_System ↺
                                 </button>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhishingScanner;