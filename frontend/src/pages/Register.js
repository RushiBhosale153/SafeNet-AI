import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { FaEnvelope, FaLock, FaShieldAlt } from 'react-icons/fa';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register(email, password);
      // Navigate to OTP verification page
      navigate('/verify-otp', { 
        state: { 
          userId: response.data.userId,
          email: email,
          developmentOTP: response.data.developmentOTP 
        } 
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black flex items-center justify-center px-4 py-12" data-testid="register-page">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <FaShieldAlt className="text-6xl text-cyber-blue mx-auto mb-4 animate-pulse-slow" />
          <h2 className="text-3xl font-bold text-cyber-blue font-mono" data-testid="register-title">Create Account</h2>
          <p className="text-gray-400 mt-2">Join SafeNet AI for advanced security</p>
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
                  placeholder="Min 8 characters"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-cyber-blue font-bold mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-cyber-blue" />
                <input
                  type="password"
                  id="confirmPassword"
                  data-testid="confirm-password-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-cyber-black border-2 border-cyber-blue rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-cyber-green transition-colors"
                  placeholder="Repeat password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              data-testid="register-submit-button"
              disabled={loading}
              className="w-full bg-cyber-blue text-cyber-black font-bold py-3 rounded-lg hover:bg-cyber-green transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-cyber"
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" data-testid="login-link" className="text-cyber-blue hover:text-cyber-green font-bold">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;