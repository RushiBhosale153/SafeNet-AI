import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaShieldAlt, FaBars, FaTimes } from 'react-icons/fa';
import { MdDashboard, MdSecurity, MdBugReport, MdEmail, MdSmartToy, MdHelp, MdPerson } from 'react-icons/md';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = isAuthenticated ? [
    { path: '/dashboard', label: 'Dashboard', icon: MdDashboard },
    { path: '/phishing-scanner', label: 'Phishing', icon: MdBugReport },
    { path: '/website-scanner', label: 'Website', icon: MdSecurity },
    { path: '/leak-checker', label: 'Leak Check', icon: MdEmail },
    { path: '/ai-assistant', label: 'AI Assistant', icon: MdSmartToy },
    { path: '/help-desk', label: 'Help', icon: MdHelp },
    { path: '/profile', label: 'Profile', icon: MdPerson }
  ] : [];

  return (
    <nav className="bg-cyber-darker border-b-2 border-cyber-blue shadow-cyber sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group" data-testid="logo-link">
            <FaShieldAlt className="text-3xl text-cyber-blue group-hover:text-cyber-green transition-colors" />
            <span className="text-2xl font-bold text-cyber-blue group-hover:text-cyber-green transition-colors font-mono">
              SafeNet AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    data-testid={`nav-${link.label.toLowerCase().replace(' ', '-')}`}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-cyber-blue text-cyber-black font-bold'
                        : 'text-cyber-blue hover:bg-cyber-blue hover:bg-opacity-20'
                    }`}
                  >
                    <Icon className="text-lg" />
                    <span className="text-sm">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-cyber-green text-sm" data-testid="user-email">{user?.email}</span>
                <button
                  onClick={handleLogout}
                  data-testid="logout-button"
                  className="px-4 py-2 bg-cyber-red text-white rounded-lg hover:bg-opacity-80 transition-all font-bold"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  data-testid="login-link"
                  className="px-4 py-2 text-cyber-blue hover:text-cyber-green transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  data-testid="register-link"
                  className="px-4 py-2 bg-cyber-blue text-cyber-black rounded-lg hover:bg-cyber-green transition-all font-bold"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-cyber-blue text-2xl"
            data-testid="mobile-menu-button"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-cyber-blue">
            {isAuthenticated && (
              <div className="space-y-2 mb-4">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                        isActive
                          ? 'bg-cyber-blue text-cyber-black font-bold'
                          : 'text-cyber-blue hover:bg-cyber-blue hover:bg-opacity-20'
                      }`}
                    >
                      <Icon className="text-xl" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
            
            <div className="space-y-2 border-t border-cyber-blue pt-4">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 text-cyber-green text-sm">{user?.email}</div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 bg-cyber-red text-white rounded-lg hover:bg-opacity-80 transition-all font-bold"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-cyber-blue hover:text-cyber-green transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 bg-cyber-blue text-cyber-black rounded-lg hover:bg-cyber-green transition-all font-bold text-center"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;