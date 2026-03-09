import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaShieldAlt, FaBug, FaGlobe, FaEnvelope, FaRobot } from 'react-icons/fa';
import { MdSecurity } from 'react-icons/md';

const Home = () => {
  const { isAuthenticated } = useAuth();

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
      <section className="relative overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0 bg-gradient-to-b from-cyber-blue/10 to-transparent"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <FaShieldAlt className="text-8xl text-cyber-blue animate-pulse-slow" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-cyber-blue mb-6 animate-glow font-mono" data-testid="hero-title">
              SafeNet AI
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Your Advanced Cybersecurity Platform
            </p>
            <p className="text-lg text-gray-400 mb-10">
              Protect yourself from phishing, malware, and data breaches with AI-powered security tools.
            </p>
            
            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  data-testid="hero-register-button"
                  className="px-8 py-4 bg-cyber-blue text-cyber-black rounded-lg hover:bg-cyber-green transition-all font-bold text-lg shadow-cyber-lg"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  data-testid="hero-login-button"
                  className="px-8 py-4 border-2 border-cyber-blue text-cyber-blue rounded-lg hover:bg-cyber-blue hover:text-cyber-black transition-all font-bold text-lg"
                >
                  Login
                </Link>
              </div>
            ) : (
              <Link
                to="/dashboard"
                data-testid="hero-dashboard-button"
                className="inline-block px-8 py-4 bg-cyber-blue text-cyber-black rounded-lg hover:bg-cyber-green transition-all font-bold text-lg shadow-cyber-lg"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-cyber-darker" data-testid="features-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-cyber-blue mb-4 font-mono">
              Security Tools
            </h2>
            <p className="text-gray-400 text-lg">
              Comprehensive cybersecurity solutions at your fingertips
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  data-testid={`feature-card-${index}`}
                  className="bg-cyber-black border-2 border-cyber-blue rounded-lg p-6 hover:shadow-cyber transition-all hover:scale-105"
                >
                  <div className="flex justify-center mb-4">
                    <Icon className="text-5xl text-cyber-green" />
                  </div>
                  <h3 className="text-xl font-bold text-cyber-blue mb-3 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-center text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" data-testid="cta-section">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-cyber-blue/20 to-cyber-green/20 border-2 border-cyber-blue rounded-lg p-12 text-center">
            <MdSecurity className="text-6xl text-cyber-blue mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-cyber-blue mb-4 font-mono">
              Stay Protected Online
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join SafeNet AI today and get access to powerful security tools powered by artificial intelligence.
            </p>
            {!isAuthenticated && (
              <Link
                to="/register"
                data-testid="cta-register-button"
                className="inline-block px-8 py-4 bg-cyber-green text-cyber-black rounded-lg hover:bg-cyber-blue transition-all font-bold text-lg shadow-cyber-green"
              >
                Sign Up Now
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;