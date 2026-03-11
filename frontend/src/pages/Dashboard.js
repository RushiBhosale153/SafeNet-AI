import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBug, FaGlobe, FaEnvelope, FaRobot, FaChartLine, FaShieldAlt } from 'react-icons/fa';
import { MdHelp } from 'react-icons/md';

const Dashboard = () => {
  const { user } = useAuth();

  const tools = [
    {
      icon: FaBug,
      title: 'Phishing Scanner',
      description: 'Analyze messages for phishing attempts',
      path: '/phishing-scanner',
      color: 'cyber-red',
      testId: 'phishing-scanner-card'
    },
    {
      icon: FaGlobe,
      title: 'Website Scanner',
      description: 'Check websites for malware and threats',
      path: '/website-scanner',
      color: 'cyber-blue',
      testId: 'website-scanner-card'
    },
    {
      icon: FaEnvelope,
      title: 'Leak Checker',
      description: 'Check if your email has been breached',
      path: '/leak-checker',
      color: 'cyber-purple',
      testId: 'leak-checker-card'
    },
    {
      icon: FaRobot,
      title: 'AI Assistant',
      description: 'Get cybersecurity advice from AI',
      path: '/ai-assistant',
      color: 'cyber-green',
      testId: 'ai-assistant-card'
    }
  ];

  const quickLinks = [
    { icon: FaChartLine, title: 'Scan History', path: '/profile', testId: 'scan-history-link' },
    { icon: MdHelp, title: 'Help Desk', path: '/help-desk', testId: 'help-desk-link' }
  ];

  return (
    <div className="min-h-screen bg-cyber-black" data-testid="dashboard-page">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="glass border border-cyber-blue/30 rounded-xl p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/10 to-cyber-green/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center md:justify-between space-y-6 md:space-y-0">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <FaShieldAlt className="text-6xl text-cyber-blue animate-pulse-slow" />
                  <div className="absolute inset-0 bg-cyber-blue/20 blur-xl rounded-full"></div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-cyber-blue tracking-wider uppercase mb-2">
                    System <span className="text-white">Dashboard</span>
                  </h1>
                  <p className="text-gray-400 font-mono text-sm flex items-center">
                    <span className="w-2 h-2 bg-cyber-green rounded-full mr-2 animate-ping"></span>
                    SECURE_SESSION_ACTIVE // {user?.email}
                  </p>
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="text-center px-6 py-2 border-r border-cyber-blue/20">
                  <div className="text-2xl font-bold text-cyber-green">98%</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Safe Score</div>
                </div>
                <div className="text-center px-6 py-2">
                  <div className="text-2xl font-bold text-cyber-blue">24/7</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Monitoring</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Tools Grid */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-cyber-blue mb-6 tracking-widest uppercase flex items-center">
            <span className="w-8 h-[1px] bg-cyber-blue/50 mr-3"></span>
            Security Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={index}
                  to={tool.path}
                  data-testid={tool.testId}
                  className="glass border border-cyber-blue/20 rounded-xl p-8 hover:border-cyber-blue transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-cyber-blue/10 to-transparent rounded-bl-full transition-all group-hover:scale-150"></div>
                  <Icon className={`text-5xl text-white mb-6 transition-all duration-500 group-hover:text-cyber-blue group-hover:drop-shadow-[0_0_10px_#00ffff]`} />
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cyber-blue transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-300 transition-colors italic">
                    {tool.description}
                  </p>
                  <div className="mt-6 flex items-center text-[10px] font-bold text-cyber-blue uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">
                    Initialize Scan →
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Links & Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-cyber-blue mb-6 tracking-widest uppercase flex items-center">
              <span className="w-8 h-[1px] bg-cyber-blue/50 mr-3"></span>
              Fast Access
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={index}
                    to={link.path}
                    data-testid={link.testId}
                    className="glass border border-cyber-green/30 rounded-xl p-6 hover:border-cyber-green transition-all duration-500 hover:scale-[1.02] flex items-center space-x-6 group"
                  >
                    <div className="w-14 h-14 bg-cyber-green/10 rounded-lg flex items-center justify-center group-hover:bg-cyber-green/20 transition-all">
                      <Icon className="text-3xl text-cyber-green" />
                    </div>
                    <span className="text-xl font-bold text-white group-hover:text-cyber-green transition-colors">{link.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-cyber-blue mb-6 tracking-widest uppercase flex items-center">
              <span className="w-8 h-[1px] bg-cyber-blue/50 mr-3"></span>
              Live Intell
            </h2>
            <div className="glass border border-cyber-green/30 rounded-xl p-6 relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyber-green/5 rounded-full blur-2xl"></div>
              <h3 className="text-cyber-green font-bold mb-4 flex items-center uppercase tracking-widest text-xs">
                <FaShieldAlt className="mr-2 animate-pulse" />
                Security Advisory
              </h3>
              <p className="text-gray-400 text-sm italic leading-relaxed">
                "System status nominal. Ensure all API signatures are rotated every 90 days. High volume of phishing detected in APAC region."
              </p>
              <div className="mt-6 pt-6 border-t border-cyber-green/10">
                <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  <span>Trust Level: High</span>
                  <span className="text-cyber-green">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;