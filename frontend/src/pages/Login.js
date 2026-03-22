import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaShieldAlt } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(email, password);
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.userId) {
        // Email not verified
        navigate('/verify-otp', { 
          state: { 
            userId: err.response.data.userId,
            email: email,
            developmentOTP: err.response.data.developmentOTP
          } 
        });
      } else {
        setError(err.response?.data?.error || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black flex items-center justify-center px-4 py-12" data-testid="login-page">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <FaShieldAlt className="text-6xl text-cyber-blue mx-auto mb-4 animate-pulse-slow" />
          <h2 className="text-3xl font-bold text-cyber-blue font-mono" data-testid="login-title">Welcome Back</h2>
          <p className="text-gray-400 mt-2">Login to CyberNet AI</p>
        </div>

        <div className="bg-cyber-darker border-2 border-cyber-blue rounded-lg p-8 shadow-cyber">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-cyber-red/20 border border-cyber-red text-cyber-red px-4 py-3 rounded-lg" data-testid="error-message">
                {error}
              </div>
            )}

            <div>
              <label className="block text-cyber-blue font-bold mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-cyber-blue" />
                <input
                  type="email"
                  id="email"
                  data-testid="email-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-cyber-black border-2 border-cyber-blue rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-cyber-green transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-cyber-blue font-bold mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-cyber-blue" />
                <input
                  type="password"
                  id="password"
                  data-testid="password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-cyber-black border-2 border-cyber-blue rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-cyber-green transition-colors"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              data-testid="login-submit-button"
              disabled={loading}
              className="w-full bg-cyber-blue text-cyber-black font-bold py-3 rounded-lg hover:bg-cyber-green transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-cyber"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" data-testid="register-link" className="text-cyber-blue hover:text-cyber-green font-bold">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;