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
        <div className="mb-8">
          <div className="bg-gradient-to-r from-cyber-blue/20 to-cyber-green/20 border-2 border-cyber-blue rounded-lg p-6">
            <div className="flex items-center space-x-4">
              <FaShieldAlt className="text-5xl text-cyber-blue" />
              <div>
                <h1 className="text-3xl font-bold text-cyber-blue font-mono" data-testid="dashboard-title">
                  Welcome to SafeNet AI
                </h1>
                <p className="text-gray-300 mt-1" data-testid="user-email-display">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Tools Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-cyber-blue mb-4 font-mono">Security Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={index}
                  to={tool.path}
                  data-testid={tool.testId}
                  className="bg-cyber-darker border-2 border-cyber-blue rounded-lg p-6 hover:shadow-cyber transition-all hover:scale-105 group"
                >
                  <Icon className={`text-5xl text-${tool.color} mb-4 group-hover:animate-pulse`} />
                  <h3 className="text-xl font-bold text-cyber-blue mb-2">
                    {tool.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {tool.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-2xl font-bold text-cyber-blue mb-4 font-mono">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <Link
                  key={index}
                  to={link.path}
                  data-testid={link.testId}
                  className="bg-cyber-darker border-2 border-cyber-green rounded-lg p-6 hover:shadow-cyber-green transition-all hover:scale-105 flex items-center space-x-4"
                >
                  <Icon className="text-4xl text-cyber-green" />
                  <span className="text-xl font-bold text-cyber-green">{link.title}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Security Tip */}
        <div className="mt-8">
          <div className="bg-cyber-darker border-2 border-cyber-green rounded-lg p-6">
            <h3 className="text-lg font-bold text-cyber-green mb-2 flex items-center">
              <FaShieldAlt className="mr-2" />
              Security Tip
            </h3>
            <p className="text-gray-300">
              Always verify suspicious emails and links before clicking. Use our scanning tools to stay protected!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;