import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { historyAPI } from '../services/api';
import { FaBug, FaGlobe, FaEnvelope, FaRobot, FaChartLine, FaShieldAlt, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, historyRes] = await Promise.all([
          historyAPI.getStats(),
          historyAPI.getHistory()
        ]);
        setStats(statsRes.data.stats);
        setHistory(historyRes.data.history);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);



  const chartData = stats ? Object.entries(stats.distribution).map(([name, value]) => ({
    name: name.toUpperCase(),
    value
  })) : [];

  const riskData = stats ? [
    { name: 'High', value: stats.highRisk, color: '#ff0000' },
    { name: 'Medium', value: stats.mediumRisk, color: '#ffaa00' },
    { name: 'Safe', value: stats.safeScans, color: '#00ff00' }
  ] : [];

  const tools = [
    { icon: FaBug, title: 'Phishing Scanner', path: '/phishing-scanner', color: 'cyber-red' },
    { icon: FaGlobe, title: 'Website Scanner', path: '/website-scanner', color: 'cyber-blue' },
    { icon: FaEnvelope, title: 'Leak Checker', path: '/leak-checker', color: 'cyber-purple' },
    { icon: FaRobot, title: 'AI Assistant', path: '/ai-assistant', color: 'cyber-green' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-black flex items-center justify-center">
        <div className="text-cyber-blue font-mono animate-pulse">INITIALIZING_SOC_DASHBOARD...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-black text-white pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-2 glass border border-cyber-blue/30 rounded-xl p-8 relative overflow-hidden group">
            <div className="relative z-10">
              <h1 className="text-3xl font-bold text-cyber-blue mb-2 uppercase tracking-widest">
                System <span className="text-white">Active</span>
              </h1>
              <p className="text-gray-400 font-mono text-xs mb-4">Operator: {user?.email}</p>
              <div className="flex gap-4">
                <Link to="/" className="px-6 py-2 bg-cyber-blue text-black font-bold text-xs uppercase rounded hover:bg-white transition-all">Launch Unified Scan</Link>
              </div>
            </div>
            <FaShieldAlt className="absolute right-[-20px] bottom-[-20px] text-9xl text-cyber-blue/10 rotate-12" />
          </div>

          <div className="glass border border-cyber-red/30 rounded-xl p-6 flex flex-col justify-center items-center text-center">
             <FaExclamationTriangle className="text-cyber-red text-3xl mb-2" />
             <div className="text-3xl font-bold text-cyber-red">{stats?.highRisk || 0}</div>
             <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">High Risk Detections</div>
          </div>

          <div className="glass border border-cyber-green/30 rounded-xl p-6 flex flex-col justify-center items-center text-center">
             <FaCheckCircle className="text-cyber-green text-3xl mb-2" />
             <div className="text-3xl font-bold text-cyber-green">{stats?.safeScans || 0}</div>
             <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Safe Scans Verified</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Analytics Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Chart: Threat Distribution */}
            <div className="glass border border-cyber-blue/20 rounded-xl p-6">
              <h3 className="text-xs font-bold text-cyber-blue uppercase tracking-widest mb-6 flex items-center">
                 <FaChartLine className="mr-2" /> Intelligence Hub Distribution
              </h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                    <XAxis dataKey="name" stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #00ffff', fontSize: '12px', borderRadius: '8px' }}
                      itemStyle={{ color: '#00ffff' }}
                      cursor={{ fill: 'rgba(0, 255, 255, 0.05)' }}
                    />
                    <Bar dataKey="value" fill="#00ffff" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Live Threat Feed */}
            <div className="glass border border-cyber-blue/10 rounded-xl overflow-hidden">
              <div className="bg-cyber-blue/5 px-6 py-4 border-b border-cyber-blue/20 flex justify-between items-center">
                <h3 className="text-xs font-bold text-cyber-blue uppercase tracking-widest flex items-center">
                  <span className="w-2 h-2 bg-cyber-red rounded-full mr-2 animate-ping"></span>
                  Live Threat Feed
                </h3>
                <Link to="/history" className="text-[10px] text-gray-500 hover:text-cyber-blue uppercase font-bold transition-colors">View All Logs</Link>
              </div>
              <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto cyber-scrollbar">
                {history.length > 0 ? history.map((scan, idx) => (
                  <div key={idx} className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        scan.riskLevel === 'malicious' || scan.riskLevel === 'high' ? 'bg-cyber-red/10 text-cyber-red' :
                        scan.riskLevel === 'suspicious' || scan.riskLevel === 'medium' ? 'bg-yellow-400/10 text-yellow-400' :
                        'bg-cyber-green/10 text-cyber-green'
                      }`}>
                        {scan.scanType === 'url' || scan.scanType === 'website' ? <FaGlobe /> : 
                         scan.scanType === 'phishing' ? <FaBug /> : <FaEnvelope />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-cyber-blue transition-colors truncate max-w-[200px] md:max-w-md">
                          {scan.target}
                        </div>
                        <div className="text-[10px] text-gray-500 uppercase font-mono">
                          {new Date(scan.timestamp).toLocaleString()} • {scan.scanType}
                        </div>
                      </div>
                    </div>
                    <div className={`text-[10px] font-black uppercase px-3 py-1 rounded border ${
                       scan.riskLevel === 'malicious' || scan.riskLevel === 'high' ? 'border-cyber-red/30 text-cyber-red bg-cyber-red/5' :
                       scan.riskLevel === 'suspicious' || scan.riskLevel === 'medium' ? 'border-yellow-400/30 text-yellow-400 bg-yellow-400/5' :
                       'border-cyber-green/30 text-cyber-green bg-cyber-green/5'
                    }`}>
                      {scan.riskLevel}
                    </div>
                  </div>
                )) : (
                  <div className="px-6 py-12 text-center text-gray-600 text-xs italic font-mono">
                    NO_THREAT_DATA_AVAILABLE_IN_CURRENT_BUFFER
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Side Column: Risk Profile & Tools */}
          <div className="space-y-8">
            {/* Risk Profile Overview */}
            <div className="glass border border-cyber-blue/20 rounded-xl p-6">
              <h3 className="text-xs font-bold text-cyber-blue uppercase tracking-widest mb-6 flex items-center">
                 <FaShieldAlt className="mr-2" /> Risk Profile Overview
              </h3>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {riskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #00ffff', fontSize: '12px', borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                 {riskData.map(d => (
                   <div key={d.name} className="flex flex-col items-center p-2 bg-white/5 rounded-lg border border-white/5">
                     <span className="text-lg font-bold" style={{ color: d.color }}>{d.value}</span>
                     <span className="text-[8px] uppercase font-bold text-gray-500">{d.name}</span>
                   </div>
                 ))}
              </div>
            </div>

            {/* Quick Access Tools */}
            <div className="space-y-4">
               <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] px-2 mb-4">Command Modules</h3>
               {tools.map((tool, index) => (
                <Link
                  key={index}
                  to={tool.path}
                  className="flex items-center p-4 glass border border-white/5 rounded-xl hover:border-cyber-blue/50 transition-all group"
                >
                  <div className={`p-3 rounded-lg bg-cyber-blue/10 text-cyber-blue group-hover:bg-cyber-blue group-hover:text-black transition-all`}>
                    <tool.icon className="text-xl" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider">{tool.title}</h4>
                    <p className="text-[9px] text-gray-500 italic">Probe active</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;