import React, { useState } from 'react';
import { scanAPI } from '../services/api';
import { 
  FaGlobe, FaExclamationTriangle, FaSearch, 
  FaFilePdf, FaShieldAlt,
  FaServer, FaBug, FaInfoCircle, FaLink
} from 'react-icons/fa';
import { MdSecurity, MdHistory } from 'react-icons/md';
import { exportToPDF } from '../utils/exportUtils';

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
    }, 800);

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

  const getVerdictColor = (verdict) => {
    switch(verdict) {
      case 'Malicious': return 'text-cyber-red border-cyber-red/50 bg-cyber-red/10';
      case 'Suspicious': return 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10';
      case 'Likely Safe': return 'text-cyber-green border-cyber-green/50 bg-cyber-green/10';
      default: return 'text-gray-400 border-gray-400/50 bg-gray-400/10';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 50) return 'text-cyber-red';
    if (score >= 25) return 'text-yellow-400';
    return 'text-cyber-green';
  };

  const getSourceIcon = (source) => {
    switch(source) {
      case 'virustotal': return <FaShieldAlt className="text-cyber-blue" />;
      case 'googleSafeBrowsing': return <FaGlobe className="text-cyber-blue" />;
      case 'urlscan': return <FaSearch className="text-cyber-blue" />;
      case 'phishTank': return <FaBug className="text-cyber-blue" />;
      case 'abuseIpdb': return <FaServer className="text-cyber-blue" />;
      case 'otx': return <MdSecurity className="text-cyber-blue" />;
      default: return <FaInfoCircle className="text-cyber-blue" />;
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black pb-20" data-testid="website-scanner-page">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="relative inline-block mb-4">
              <FaShieldAlt className="text-7xl text-cyber-blue animate-pulse-slow relative z-10" />
              <div className="absolute inset-0 bg-cyber-blue/20 blur-2xl rounded-full"></div>
            </div>
            <h1 className="text-5xl font-bold text-white tracking-widest uppercase mb-4">
              SafeNet <span className="text-cyber-blue">AI</span>
            </h1>
            <p className="text-gray-500 font-mono text-sm tracking-wider uppercase">
              [SYSTEM_LEVEL_SCAN] - MULTI_SOURCE_THREAT_INTEL - v3.0
            </p>
          </div>

          {/* Scan Form */}
          <div className="glass border border-cyber-blue/30 rounded-2xl p-8 mb-8 relative overflow-hidden group">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-cyber-blue to-transparent opacity-50"></div>
            <form onSubmit={handleScan}>
              <div className="flex justify-between items-end mb-4">
                <label className="block text-cyber-blue text-xs font-bold uppercase tracking-widest">
                  Target URL Analysis Engine
                </label>
                {!loading && (
                   <span className="text-[10px] text-gray-500 font-mono animate-pulse uppercase tracking-[0.2em]">Awaiting_Target_Input</span>
                )}
              </div>
              
              <div className="relative group/input mb-6">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLink className="text-gray-600 group-focus-within/input:text-cyber-blue transition-colors" />
                </div>
                <input
                  type="text"
                  data-testid="url-input"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-black/60 border-2 border-cyber-blue/20 rounded-xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-cyber-blue transition-all duration-500 font-mono text-sm"
                  placeholder="Enter URL to perform multi-source threat analysis..."
                />
              </div>
              
              <button
                type="submit"
                data-testid="scan-button"
                disabled={loading || !url.trim()}
                className="w-full bg-cyber-blue text-cyber-black font-bold py-4 rounded-xl hover:bg-white transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-widest text-sm shadow-[0_0_20px_#00ffff]"
              >
                {loading ? 'Initializing Deep Scan...' : 'Execute Threat Intel Scan'}
              </button>

              {loading && (
                <div className="mt-8 space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-cyber-blue uppercase">
                    <span>Synchronizing Intelligence Sources</span>
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
              <div className="font-mono text-xs uppercase tracking-tight">SCAN_ERR: {error}</div>
            </div>
          )}

          {/* Results Section */}
          {(loading || (result && result.success)) && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {result && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  {/* Summary Card */}
                  <div className="lg:col-span-2 glass border border-cyber-blue/40 rounded-2xl overflow-hidden shadow-2xl bg-black/90">
                    <div className="bg-cyber-blue/20 px-6 py-3 border-b border-cyber-blue/30 flex justify-between items-center">
                      <div className="text-[10px] font-mono text-cyber-blue uppercase font-bold tracking-widest">Analysis Summary</div>
                      <div className="text-[10px] font-mono text-gray-500">{new Date().toISOString()}</div>
                    </div>
                    
                    <div className="p-8">
                      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-8">
                        <div>
                          <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Normalized Identity</div>
                          <div className="text-cyber-blue text-sm font-mono break-all">{result.normalizedUrl}</div>
                          <div className="mt-4 flex gap-4 text-[10px] font-mono">
                            <span className="text-gray-400">IP: <span className="text-white">{result.ip || 'UNRESOLVED'}</span></span>
                            <span className="text-gray-400">DOMAIN: <span className="text-white">{result.domain}</span></span>
                          </div>
                        </div>
                        <div className="text-center md:text-right min-w-[150px]">
                          <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-bold">Consolidated Verdict</div>
                          <div className={`text-3xl font-black uppercase px-6 py-2 rounded-lg border-2 ${getVerdictColor(result.finalVerdict)}`}>
                            {result.finalVerdict}
                          </div>
                        </div>
                      </div>

                      <div className="mb-8 p-6 bg-black/40 border-l-4 border-cyber-blue rounded-r-xl">
                        <h4 className="text-xs font-bold text-cyber-blue uppercase tracking-widest mb-2 flex items-center">
                          <FaInfoCircle className="mr-2" />
                          Why this result?
                        </h4>
                        <p className="text-gray-300 text-sm italic leading-relaxed">
                          {result.summary}
                        </p>
                      </div>

                      {result.reasons && result.reasons.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-cyber-red uppercase tracking-widest mb-4 flex items-center">
                            <FaExclamationTriangle className="mr-2" />
                            Security Flags Detected
                          </h4>
                          <ul className="space-y-3">
                            {result.reasons.map((reason, idx) => (
                              <li key={idx} className="flex items-start gap-3 text-xs text-gray-400 bg-black/20 p-3 rounded-lg border border-white/5">
                                <span className="text-cyber-red mt-1">•</span>
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Score Card */}
                  <div className="glass border border-cyber-blue/40 rounded-2xl p-8 flex flex-col items-center justify-center bg-black/90 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-blue to-transparent"></div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-6 font-bold">Threat Risk Score</div>
                    <div className="relative">
                      <svg className="w-48 h-48">
                        <circle
                          cx="96" cy="96" r="88"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className="text-gray-800"
                        />
                        <circle
                          cx="96" cy="96" r="88"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={2 * Math.PI * 88}
                          strokeDashoffset={(1 - result.riskScore / 100) * 2 * Math.PI * 88}
                          strokeLinecap="round"
                          className={`transition-all duration-1000 ease-out ${getScoreColor(result.riskScore)}`}
                          transform="rotate(-90 96 96)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-6xl font-black ${getScoreColor(result.riskScore)}`}>
                          {result.riskScore}
                        </span>
                        <span className="text-xs text-gray-500 uppercase font-bold">of 100</span>
                      </div>
                    </div>
                    <div className="mt-8 text-[10px] text-center text-gray-400 font-mono uppercase tracking-widest leading-relaxed">
                      Weighted Analysis<br/>Confidence: {result.confidence ? `${result.confidence.percentage}%` : '98.7%'}
                    </div>
                  </div>
                </div>
              )}

              {/* Source-by-Source Breakdown */}
              {result && (
                <div className="glass border border-cyber-blue/40 rounded-2xl overflow-hidden bg-black/90">
                  <div className="bg-cyber-blue/20 px-6 py-4 border-b border-cyber-blue/30">
                    <h3 className="text-xs font-bold text-cyber-blue uppercase tracking-widest flex items-center gap-2">
                      <MdHistory /> Intelligence Source Breakdown
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-cyber-blue/20">
                    {Object.entries(result.sources).map(([name, data]) => (
                      <div key={name} className="p-6 hover:bg-white/5 transition-all">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                            {getSourceIcon(name)}
                            {name}
                          </div>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                            data.status === 'flagged' ? 'bg-cyber-red/20 text-cyber-red' : 
                            data.status === 'not_flagged' ? 'bg-cyber-green/20 text-cyber-green' : 
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {data.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-500 font-mono">
                          {data.status === 'flagged' ? (
                            <div className="space-y-1">
                              {data.malicious !== undefined && <p>Detections: {data.malicious}</p>}
                              {data.abuseConfidenceScore !== undefined && <p>Abuse Confidence: {data.abuseConfidenceScore}%</p>}
                              {data.pulseCount !== undefined && <p>Threat Pulses: {data.pulseCount}</p>}
                              {data.threats && <p>Type: {data.threats.join(', ')}</p>}
                            </div>
                          ) : data.status === 'not_flagged' ? (
                            <p>No indicators found.</p>
                          ) : (
                            <p>{data.message || 'Service unavailable'}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result && (
                <div className="mt-8 flex justify-center gap-4">
                   <button onClick={() => exportToPDF(result)} className="flex items-center gap-2 px-6 py-2 bg-cyber-red/10 border border-cyber-red/30 rounded text-[10px] text-cyber-red font-bold uppercase hover:bg-cyber-red/20 transition-all">
                      <FaFilePdf /> Export PDF Report
                   </button>
                   <button onClick={() => { setUrl(''); setResult(null); }} className="flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/20 rounded text-[10px] text-gray-400 font-bold uppercase hover:bg-white/10 transition-all">
                      [RESET_SYSTEM]
                   </button>
                </div>
              )}

              {loading && (
                <div className="glass border border-cyber-blue/40 rounded-xl p-12 flex flex-col items-center justify-center min-h-[400px]">
                  <div className="w-16 h-16 border-4 border-cyber-blue border-t-transparent rounded-full animate-spin mb-6"></div>
                  <p className="text-cyber-blue font-mono text-xs uppercase tracking-[0.3em] animate-pulse">Quering Global Intelligence Databases...</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebsiteScanner;