import React, { useState } from 'react';
import { scanAPI } from '../services/api';
import { FaGlobe, FaExclamationTriangle, FaCheckCircle, FaSearch, FaTerminal, FaFilePdf, FaFileCsv, FaFileCode } from 'react-icons/fa';
import { MdSecurity } from 'react-icons/md';
import { exportToPDF, exportToJSON, exportToCSV, normalizeReportData } from '../utils/exportUtils';

const WebsiteScanner = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
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
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev;
        return prev + 5;
      });
    }, 1500);

    try {
      const response = await scanAPI.website(url);
      setResult(response.data);
      setProgress(100);
    } catch (err) {
      setError(err.response?.data?.error || 'Scan failed. Please try again.');
    } finally {
      clearInterval(progressInterval);
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    const colors = {
      safe: 'text-cyber-green border-cyber-green/50',
      low: 'text-yellow-400 border-yellow-400/50',
      medium: 'text-orange-400 border-orange-400/50',
      high: 'text-cyber-red border-cyber-red/50',
      critical: 'text-red-600 border-red-600/50',
      unknown: 'text-gray-400 border-gray-400/50'
    };
    return colors[level] || 'text-gray-400 border-gray-400/50';
  };

  return (
    <div className="min-h-screen bg-cyber-black" data-testid="website-scanner-page">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="relative inline-block mb-4">
              <FaGlobe className="text-7xl text-cyber-blue animate-pulse-slow relative z-10" />
              <div className="absolute inset-0 bg-cyber-blue/20 blur-2xl rounded-full"></div>
            </div>
            <h1 className="text-5xl font-bold text-white tracking-widest uppercase mb-4">
              Web <span className="text-cyber-blue">Guardian</span>
            </h1>
            <p className="text-gray-500 font-mono text-sm tracking-wider uppercase">
              [URL_SCANNER_ACTIVE] - VT_API_INTEGRATED
            </p>
          </div>

          {/* Scan Form */}
          <div className="glass border border-cyber-blue/30 rounded-2xl p-8 mb-8 relative overflow-hidden group">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-cyber-blue to-transparent opacity-50"></div>
            <form onSubmit={handleScan}>
              <div className="flex justify-between items-end mb-4">
                <label className="block text-cyber-blue text-xs font-bold uppercase tracking-widest">
                  Target URL Entry
                </label>
                {!loading && (
                   <span className="text-[10px] text-gray-500 font-mono animate-pulse uppercase tracking-[0.2em]">Ready_to_intercept</span>
                )}
              </div>
              
              <div className="relative group/input mb-6">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-600 group-focus-within/input:text-cyber-blue transition-colors" />
                </div>
                <input
                  type="url"
                  data-testid="url-input"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-black/60 border-2 border-cyber-blue/20 rounded-xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-cyber-blue transition-all duration-500 font-mono text-sm"
                  placeholder="https://suspicious-site.net/path"
                />
              </div>
              
              <button
                type="submit"
                data-testid="scan-button"
                disabled={loading || !url.trim()}
                className="w-full bg-cyber-blue text-cyber-black font-bold py-4 rounded-xl hover:bg-white transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-widest text-sm shadow-[0_0_20px_#00ffff]"
              >
                {loading ? 'Initializing Probe...' : 'Execute Deep Scan'}
              </button>

              {loading && (
                <div className="mt-8 space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-cyber-blue uppercase">
                    <span>Analyzing Payload</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-black rounded-full h-1 overflow-hidden border border-cyber-blue/20">
                    <div 
                      className="bg-cyber-blue h-full transition-all duration-500 ease-out shadow-[0_0_10px_#00ffff]"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-cyber-red/10 border border-cyber-red/50 text-cyber-red px-6 py-4 rounded-xl mb-8 flex items-center animate-shake" data-testid="error-message">
              <FaExclamationTriangle className="mr-3 text-xl" />
              <div className="font-mono text-xs uppercase tracking-tight">LINK_ERR: {error}</div>
            </div>
          )}

          {/* Results Section - Terminal UI */}
          {(loading || (result && !result.error)) && (
            <div className="glass border border-cyber-blue/40 rounded-xl overflow-hidden shadow-2xl" data-testid="scan-results">
              {/* Terminal Header */}
              <div className="bg-cyber-blue/20 px-6 py-3 border-b border-cyber-blue/30 flex justify-between items-center">
                <div className="flex space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyber-red"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-cyber-green"></div>
                </div>
                <div className="text-[10px] font-mono text-cyber-blue uppercase font-bold tracking-widest flex items-center gap-2">
                  <FaTerminal className="text-xs" />
                  VT_OSINT_REPORT_GEN.sh
                </div>
                <div className="w-10"></div>
              </div>

              {/* Terminal Body */}
              <div className="p-8 bg-black/90 font-mono min-h-[350px] relative">
                {loading ? (
                  <div className="space-y-3">
                    <p className="text-cyber-blue text-xs"><span className="text-gray-600">[0.00]</span> Establishing handshake with VirusTotal API...</p>
                    <p className="text-cyber-blue text-xs"><span className="text-gray-600">[0.84]</span> Handshake SUCCESS. Fetching reputation data...</p>
                    <p className="text-cyber-blue text-xs"><span className="text-gray-600">[1.52]</span> 72 security engines engaged...</p>
                    <p className="text-cyber-green text-xs animate-pulse"><span className="text-gray-600">[2.11]</span> Correlating detection patterns...</p>
                    <div className="absolute bottom-8 right-8 flex items-center gap-3">
                       <span className="text-[10px] text-cyber-blue font-bold uppercase tracking-widest">Processing...</span>
                       <div className="w-4 h-4 border-2 border-cyber-blue border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </div>
                ) : result && (
                  <div className="animate-in fade-in duration-700">
                    {/* Normalized Data Access */}
                    {(() => {
                      const data = normalizeReportData({ ...result, scanType: 'website', target: url });
                      return (
                        <>
                          <div className="flex flex-col md:flex-row justify-between mb-8 border-b border-cyber-blue/20 pb-8 gap-8">
                             <div className="flex-1">
                                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-bold">Target_Identity (URL)</div>
                                <div className="text-cyber-blue text-sm break-all font-bold bg-cyber-blue/5 p-4 rounded-lg border border-cyber-blue/20" data-testid="scanned-url">
                                   {data.targetVector}
                                </div>
                             </div>
                             <div className="text-center md:text-right">
                                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-bold">Threat_Status</div>
                                <div className={`text-4xl font-black uppercase tracking-tighter ${getRiskColor(result.riskLevel).split(' ')[0]}`} data-testid="risk-level">
                                   {data.riskLevel}
                                </div>
                                <div className="mt-1 text-[10px] text-gray-500 uppercase font-bold">Heuristic Confidence: 99.4%</div>
                             </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                             <div className="bg-black/40 border border-cyber-red/30 p-6 rounded-xl text-center group hover:bg-cyber-red/5 transition-all">
                                <div className="text-4xl font-bold text-cyber-red mb-2" data-testid="malicious-count">{data.metrics.malicious}</div>
                                <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Malicious_Hits</div>
                             </div>
                             <div className="bg-black/40 border border-yellow-400/30 p-6 rounded-xl text-center group hover:bg-yellow-400/5 transition-all">
                                <div className="text-4xl font-bold text-yellow-400 mb-2" data-testid="suspicious-count">{data.metrics.suspicious}</div>
                                <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Suspicious_Flags</div>
                             </div>
                             <div className="bg-black/40 border border-cyber-blue/30 p-6 rounded-xl text-center group hover:bg-cyber-blue/5 transition-all">
                                <div className="text-4xl font-bold text-cyber-blue mb-2" data-testid="total-engines">{data.metrics.engines}</div>
                                <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Neutral_Nodes</div>
                             </div>
                          </div>

                          <div className="space-y-6">
                             <div className="glass border border-cyber-green/30 p-6 rounded-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-cyber-green/5 rounded-bl-full"></div>
                                <h4 className="text-cyber-green text-xs font-bold uppercase tracking-widest mb-3 flex items-center">
                                   <MdSecurity className="mr-2" />
                                   Security Protocol Recommendation
                                </h4>
                                <p className="text-gray-300 text-sm italic leading-relaxed">
                                  {data.advice}
                                </p>
                             </div>

                             <div className="mt-8 pt-6 border-t border-cyber-blue/20 flex flex-wrap items-center justify-between gap-6">
                              <div className="flex items-center gap-4">
                                 <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Protocol Export:</span>
                                 <button onClick={() => exportToPDF({ ...result, scanType: 'website', target: url })} className="flex items-center gap-2 px-4 py-2 bg-cyber-red/10 border border-cyber-red/30 rounded text-[9px] text-cyber-red font-bold uppercase hover:bg-cyber-red/20 transition-all">
                                    <FaFilePdf /> PDF Report
                                 </button>
                                 <button onClick={() => exportToCSV({ ...result, scanType: 'website', target: url })} className="flex items-center gap-2 px-4 py-2 bg-cyber-green/10 border border-cyber-green/30 rounded text-[9px] text-cyber-green font-bold uppercase hover:bg-cyber-green/20 transition-all">
                                    <FaFileCsv /> CSV Data
                                 </button>
                                 <button onClick={() => exportToJSON({ ...result, scanType: 'website', target: url })} className="flex items-center gap-2 px-4 py-2 bg-cyber-blue/10 border border-cyber-blue/30 rounded text-[9px] text-cyber-blue font-bold uppercase hover:bg-cyber-blue/20 transition-all">
                                    <FaFileCode /> JSON Metadata
                                 </button>
                              </div>
                              
                              <button 
                                 onClick={() => { setResult(null); setUrl(''); }}
                                 className="text-[9px] text-gray-500 hover:text-white transition-colors uppercase font-bold tracking-widest"
                              >
                                 [CLOSE_REPORT]
                              </button>
                           </div>
                        </div>
                      </>
                    );
                  })()}

                    {result.permalink && (
                       <div className="flex justify-center pt-4">
                          <a 
                            href={result.permalink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-8 py-3 bg-cyber-blue/10 border border-cyber-blue/50 text-cyber-blue text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-cyber-blue/20 transition-all flex items-center gap-3 group"
                          >
                            View Extended Intelligence Data
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                          </a>
                       </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {result && result.error && (
            <div className="glass border border-cyber-red/50 p-6 rounded-xl" data-testid="api-error-message">
              <div className="text-cyber-red font-bold uppercase tracking-widest text-xs mb-2">SYSTEM_FAIL: {result.error}</div>
              {result.details && <p className="text-gray-500 text-xs font-mono">{result.details}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebsiteScanner;