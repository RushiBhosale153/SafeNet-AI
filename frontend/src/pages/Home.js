import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaShieldAlt, FaBug, FaGlobe, FaEnvelope, FaRobot } from 'react-icons/fa';
import { MdSecurity } from 'react-icons/md';

const securityTips = [
  "✅ Use unique passwords for every account with a manager like Bitwarden or 1Password.",
  "🛡️ Enable Two-Factor Authentication (2FA) wherever possible—preferably with an app.",
  "🕵️ Hover over links in emails before clicking to verify the actual destination URL.",
  "📱 Keep your operating system and apps updated to patch critical security gaps.",
  "🏢 Be cautious about sharing personal information on public Wi-Fi networks.",
  "🔒 Regularlly check your credit reports for unauthorized activity or accounts.",
  "📧 Treat 'Urgent' or 'Immediate Action Required' emails with extreme suspicion."
];

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [currentTip, setCurrentTip] = useState('');

  useEffect(() => {
    // Pick a tip based on the day of the year for consistent 'Daily Tip' behavior
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    setCurrentTip(securityTips[day % securityTips.length]);
  }, []);

  const features = [
    {
      icon: FaBug,
      title: 'Phishing Scanner',
      description: 'Detect phishing attempts and suspicious messages with advanced pattern recognition.'
    },
    {
      icon: FaGlobe,
      title: 'Website Scanner',
      description: 'Scan URLs for malware and security threats using VirusTotal integration.'
    },
    {
      icon: FaEnvelope,
      title: 'Leak Checker',
      description: 'Check if your email has been compromised in data breaches.'
    },
    {
      icon: FaRobot,
      title: 'AI Assistant',
      description: 'Get cybersecurity advice from our intelligent AI assistant.'
    }
  ];

  return (
    <div className="min-h-screen bg-cyber-black">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden" data-testid="hero-section">
        {/* Animated Background Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[30%] h-[30%] bg-cyber-blue/5 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[30%] h-[30%] bg-cyber-green/5 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <div className="flex justify-center mb-8 relative">
              <div className="absolute inset-0 bg-cyber-blue/20 blur-2xl rounded-full"></div>
              <FaShieldAlt className="text-9xl text-cyber-blue relative z-10 drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]" />
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 uppercase tracking-extra-wide">
              SafeNet <span className="text-cyber-blue drop-shadow-[0_0_20px_#00ffff]">AI</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-8 font-mono tracking-widest uppercase italic">
              {"// Advanced Cybersecurity OS 2.0"}
            </p>
            <p className="text-lg md:text-xl text-gray-500 mb-12 max-w-3xl mx-auto leading-relaxed">
              Experience the next generation of threat detection. Powered by advanced artificial intelligence and distributed security engines.
            </p>
            
            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  to="/register"
                  data-testid="hero-register-button"
                  className="px-10 py-5 bg-cyber-blue text-cyber-black rounded-lg hover:bg-white transition-all duration-500 font-bold text-lg uppercase tracking-widest cyber-glow-blue"
                >
                  Initialize Setup
                </Link>
                <Link
                  to="/login"
                  data-testid="hero-login-button"
                  className="px-10 py-5 border-2 border-cyber-blue/50 text-cyber-blue rounded-lg hover:bg-cyber-blue/10 transition-all duration-500 font-bold text-lg uppercase tracking-widest"
                >
                  System Login
                </Link>
              </div>
            ) : (
              <Link
                to="/dashboard"
                data-testid="hero-dashboard-button"
                className="inline-block px-10 py-5 bg-cyber-green text-cyber-black rounded-lg hover:bg-white transition-all duration-500 font-bold text-lg uppercase tracking-widest cyber-glow-green"
              >
                Access Dashboard
              </Link>
            )}

            {/* Daily Tip Floating */}
            <div className="mt-16 inline-block glass border border-cyber-blue/20 rounded-full px-8 py-3 cyber-glow-blue translate-y-0 hover:-translate-y-1 transition-transform cursor-default">
              <p className="text-cyber-blue text-xs flex items-center font-bold tracking-[0.2em] uppercase">
                <span className="w-2 h-2 bg-cyber-green rounded-full mr-3 animate-ping"></span>
                Security Bulletin: <span className="text-white ml-2 normal-case tracking-normal">{currentTip}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative" data-testid="features-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 uppercase tracking-wider">
              Security <span className="text-cyber-blue">Toolbox</span>
            </h2>
            <div className="w-24 h-[2px] bg-cyber-blue mx-auto mb-6"></div>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto italic">
              "Deploying distributed AI models for real-time threat intelligence and vulnerability analysis."
            </p>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  data-testid={`feature-card-${index}`}
                  className="glass border border-cyber-blue/20 rounded-2xl p-8 hover:border-cyber-blue transition-all duration-500 hover:-translate-y-3 group relative overflow-hidden h-full"
                >
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-cyber-blue/5 rounded-full blur-xl group-hover:bg-cyber-blue/15 transition-all"></div>
                  <div className="flex justify-center mb-8">
                    <div className="relative">
                      <Icon className="text-6xl text-white group-hover:text-cyber-blue transition-all duration-500 group-hover:drop-shadow-[0_0_15px_#00ffff]" />
                      <div className="absolute inset-0 bg-cyber-blue/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 text-center group-hover:text-cyber-blue transition-colors uppercase tracking-widest">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 text-center text-sm leading-relaxed group-hover:text-gray-400 transition-colors">
                    {feature.description}
                  </p>
                  <div className="mt-8 pt-6 border-t border-cyber-blue/10 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-[10px] font-bold text-cyber-blue uppercase tracking-widest">Deploy Module</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24" data-testid="cta-section">
        <div className="container mx-auto px-4">
          <div className="glass border border-cyber-blue/30 rounded-3xl p-16 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/5 to-cyber-green/5 opacity-50"></div>
            <div className="relative z-10">
              <MdSecurity className="text-7xl text-cyber-blue mx-auto mb-8 animate-pulse-slow drop-shadow-[0_0_15px_#00ffff]" />
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 uppercase tracking-tight">
                Fortify Your Digital <span className="text-cyber-green">Perimeter</span>
              </h2>
              <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto leading-relaxed italic">
                Join thousands of users protecting their digital assets with SafeNet AI's advanced defense systems.
              </p>
              {!isAuthenticated && (
                <Link
                  to="/register"
                  data-testid="cta-register-button"
                  className="inline-block px-12 py-5 bg-cyber-green text-cyber-black rounded-lg hover:bg-white transition-all duration-500 font-bold text-lg uppercase tracking-widest cyber-glow-green"
                >
                  Initialize Secure Account
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;