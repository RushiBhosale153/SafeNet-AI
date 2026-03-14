import React, { useState } from 'react';
import { scanAPI } from '../services/api';
import { FaEnvelope, FaExclamationTriangle, FaSearch, FaHistory } from 'react-icons/fa';
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
      safe: 'text-cyber-green',
      low: 'text-yellow-400',
      medium: 'text-orange-400',
      high: 'text-cyber-red',
      critical: 'text-red-600',
      unknown: 'text-gray-400'
    };
    return colors[level] || 'text-gray-400';
  };

  return (
    <div className="min-h-screen bg-cyber-black" data-testid="leak-checker-page">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="relative inline-block mb-4">
              <FaEnvelope className="text-7xl text-cyber-purple animate-pulse-slow relative z-10" />
              <div className="absolute inset-0 bg-cyber-purple/20 blur-2xl rounded-full"></div>
            </div>
            <h1 className="text-5xl font-bold text-white tracking-widest uppercase mb-4">
              Leak <span className="text-cyber-purple">Sentry</span>
            </h1>
            <p className="text-gray-500 font-mono text-sm tracking-widest uppercase">
              [BREACH_DATABASE_SEARCH_ACTIVE]
            </p>
          </div>

          {/* Check Form */}
          <div className="glass border border-cyber-blue/30 rounded-2xl p-8 mb-8 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyber-purple to-transparent opacity-50"></div>
            <form onSubmit={handleCheck}>
              <div className="flex justify-between items-end mb-4">
                <label className="block text-cyber-blue text-xs font-bold uppercase tracking-widest">
                  Target Identity (Email)
                </label>
                <div className="flex items-center space-x-2 text-[10px] text-gray-600 font-mono uppercase">
                   <span className="w-1.5 h-1.5 bg-cyber-purple rounded-full animate-pulse"></span>
                   <span>Private_Channel</span>
                </div>
              </div>

              <div className="relative group/input mb-6">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-600 group-focus-within/input:text-cyber-purple transition-colors" />
                </div>
                <input
                  type="email"
                  data-testid="email-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/60 border-2 border-cyber-blue/20 rounded-xl py-4 pl-12 pr-6 text-white font-mono text-sm focus:outline-none focus:border-cyber-purple transition-all duration-500"
                  placeholder="agent@identity.sh"
                />
              </div>

              <div className="glass border border-cyber-blue/20 rounded-xl p-4 mb-6 bg-black/40">
                <p className="text-gray-500 text-[10px] font-mono leading-relaxed uppercase tracking-tight">
                  🔒 ACCESS_PROTOCOL: Your identity string is NOT stored on local nodes. 
                  Direct lookup performed against distributed breach repositories.
                </p>
              </div>

              <button
                type="submit"
                data-testid="check-button"
                disabled={loading || !email.trim()}
                className="w-full bg-cyber-purple text-white font-bold py-4 rounded-xl hover:bg-white hover:text-black transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-widest text-sm shadow-[0_0_20px_#a855f766]"
              >
                {loading ? 'Interrogating Databases...' : 'Execute Breach Lookup'}
              </button>
            </form>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-cyber-red/10 border border-cyber-red/30 text-cyber-red px-6 py-4 rounded-xl mb-8 flex items-center animate-shake" data-testid="error-message">
              <FaExclamationTriangle className="mr-3 text-xl" />
              <div className="font-mono text-xs uppercase tracking-tight">REP_ERR: {error}</div>
            </div>
          )}

          {/* Results Section - Terminal UI */}
          {(loading || (result && !result.error)) && (
            <div className="glass border border-cyber-purple/40 rounded-xl overflow-hidden shadow-2xl" data-testid="check-results">
              {/* Terminal Header */}
              <div className="bg-cyber-purple/20 px-6 py-3 border-b border-cyber-purple/30 flex justify-between items-center">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-cyber-red"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <div className="w-2 h-2 rounded-full bg-cyber-green"></div>
                </div>
                <div className="text-[10px] font-mono text-cyber-purple uppercase font-bold tracking-widest">
                  IDENTITY_INTELL_MODULE.rep
                </div>
                <div className="w-10"></div>
              </div>

              {/* Terminal Body */}
              <div className="p-8 bg-black/90 font-mono min-h-[350px]">
                {loading ? (
                  <div className="space-y-4">
                     <p className="text-cyber-purple text-xs"><span className="text-gray-600">[0.00]</span> Handshake established with LeakCheck mainframes...</p>
                     <p className="text-cyber-purple text-xs"><span className="text-gray-600">[0.42]</span> Indexing 14.2B records...</p>
                     <p className="text-cyber-purple text-xs"><span className="text-gray-600">[1.15]</span> Cross-referencing target identity...</p>
                     <p className="text-cyber-purple text-xs animate-pulse font-bold tracking-[0.2em] mt-8 flex items-center gap-3">
                        <span className="w-2 h-2 bg-cyber-purple rounded-full animate-ping"></span>
                        Searching_Darknet_Aggregators...
                     </p>
                  </div>
                ) : result && (
                  <div className="animate-in fade-in duration-700">
                     <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10 border-b border-cyber-purple/20 pb-10">
                        <div className="flex-1">
                           <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-bold">Identity_String</div>
                           <div className="text-cyber-purple text-xl font-black tracking-tight">{email}</div>
                        </div>
                        <div className="text-center md:text-right">
                           <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Threat_Level</div>
                           <div className={`text-3xl font-black uppercase tracking-widest ${getRiskColor(result.riskLevel)}`} data-testid="risk-level">
                              {result.riskLevel || 'UNKNOWN'}
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        <div className="glass border border-cyber-purple/20 p-8 rounded-2xl text-center relative overflow-hidden group">
                           <div className="absolute inset-0 bg-cyber-purple/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                           <div className={`text-6xl font-black mb-2 ${result.breachCount > 0 ? 'text-cyber-red' : 'text-cyber-green'}`} data-testid="breach-count">
                              {result.breachCount || 0}
                           </div>
                           <div className="text-[10px] text-gray-500 uppercase font-black tracking-[0.3em]">Known_Breach_Points</div>
                        </div>
                        
                        <div className="space-y-4">
                           <h4 className="text-xs font-bold text-cyber-purple uppercase tracking-[0.2em] mb-4 flex items-center">
                              <MdSecurity className="mr-2" />
                              Containment Advisory
                           </h4>
                           <div className="text-xs text-gray-300 leading-relaxed bg-black/40 p-5 rounded-xl border border-cyber-purple/10 border-l-2 border-l-cyber-purple italic">
                              {result.advice || 'Wait for full intelligence report.'}
                           </div>
                        </div>
                     </div>

                     {result.sources && result.sources.length > 0 && (
                       <div className="mb-10">
                          <h4 className="text-xs font-bold text-cyber-red uppercase tracking-[0.2em] mb-6 flex items-center">
                             <FaHistory className="mr-2" />
                             Breached Sub-Sectors Detected
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="breach-sources">
                             {result.sources.map((source, index) => (
                               <div key={index} className="glass border border-cyber-red/20 p-5 rounded-xl hover:border-cyber-red/50 transition-all group">
                                  <div className="flex items-start gap-4">
                                     <div className="text-cyber-red text-xl opacity-50 group-hover:opacity-100">🚨</div>
                                     <div>
                                        <div className="text-sm font-bold text-white uppercase tracking-tight">{typeof source === 'string' ? source : (source.name || 'Unknown')}</div>
                                        {source.date && <div className="text-[10px] text-gray-500 font-mono mt-1 uppercase">Date: {source.date}</div>}
                                     </div>
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>
                     )}

                     <div className="p-6 glass border border-cyber-green/20 rounded-xl">
                        <div className="text-[10px] text-cyber-green font-bold uppercase tracking-[0.2em] mb-4">Recommended Recovery Protocol</div>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                           {['Terminate compromised sessions', 'Execute 2FA deployment', 'Rotate all cryptographic keys', 'Enable audit logging'].map((step, i) => (
                             <li key={i} className="text-[11px] text-gray-400 flex items-center gap-2">
                                <span className="text-cyber-green">▶</span> {step}
                             </li>
                           ))}
                        </ul>
                     </div>
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

export default LeakChecker;