import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaShieldAlt } from 'react-icons/fa';
import { MdVerifiedUser } from 'react-icons/md';

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { userId, email, developmentOTP } = location.state || {};

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);

  React.useEffect(() => {
    if (!userId) {
      navigate('/register');
    }
  }, [userId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.verifyOTP(userId, otp);
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);
    setError('');

    try {
      await authAPI.resendOTP(userId);
      alert('New OTP sent to your email!');
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black flex items-center justify-center px-4 py-12" data-testid="verify-otp-page">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <MdVerifiedUser className="text-6xl text-cyber-green mx-auto mb-4 animate-pulse-slow" />
          <h2 className="text-3xl font-bold text-cyber-blue font-mono" data-testid="verify-title">Verify Your Email</h2>
          <p className="text-gray-400 mt-2">Enter the 6-digit code sent to</p>
          <p className="text-cyber-green font-bold mt-1" data-testid="email-display">{email}</p>
          {developmentOTP && (
            <div className="mt-4 bg-cyber-blue/20 border border-cyber-blue rounded-lg p-3">
              <p className="text-cyber-blue text-sm font-bold">Development Mode</p>
              <p className="text-cyber-green text-xl font-mono" data-testid="dev-otp">OTP: {developmentOTP}</p>
            </div>
          )}
        </div>

        <div className="bg-cyber-darker border-2 border-cyber-blue rounded-lg p-8 shadow-cyber">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-cyber-red/20 border border-cyber-red text-cyber-red px-4 py-3 rounded-lg" data-testid="error-message">
                {error}
              </div>
            )}

            <div>
              <label className="block text-cyber-blue font-bold mb-2 text-center" htmlFor="otp">
                Verification Code
              </label>
              <input
                type="text"
                id="otp"
                data-testid="otp-input"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full bg-cyber-black border-2 border-cyber-blue rounded-lg px-4 py-3 text-white text-center text-2xl font-mono tracking-widest focus:outline-none focus:border-cyber-green transition-colors"
                placeholder="000000"
                maxLength="6"
                required
              />
            </div>

            <button
              type="submit"
              data-testid="verify-submit-button"
              disabled={loading}
              className="w-full bg-cyber-blue text-cyber-black font-bold py-3 rounded-lg hover:bg-cyber-green transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-cyber"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 mb-2">Didn't receive the code?</p>
            <button
              onClick={handleResendOTP}
              data-testid="resend-otp-button"
              disabled={resending}
              className="text-cyber-blue hover:text-cyber-green font-bold disabled:opacity-50"
            >
              {resending ? 'Resending...' : 'Resend Code'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;