import React, { useState } from 'react';
import { helpdeskAPI } from '../services/api';
import { MdHelp, MdCheckCircle } from 'react-icons/md';

const HelpDesk = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    issue: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (formData.issue.length < 10) {
      setError('Please provide more details about your issue (minimum 10 characters)');
      return;
    }

    setLoading(true);

    try {
      await helpdeskAPI.submit(formData.name, formData.email, formData.issue);
      setSuccess(true);
      setFormData({ name: '', email: '', issue: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black" data-testid="help-desk-page">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <MdHelp className="text-6xl text-cyber-blue mx-auto mb-4 animate-pulse-slow" />
            <h1 className="text-4xl font-bold text-cyber-blue font-mono" data-testid="page-title">
              Help Desk
            </h1>
            <p className="text-gray-400 mt-2">
              Need assistance? Submit a support ticket
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-cyber-green/20 border-2 border-cyber-green text-cyber-green px-6 py-4 rounded-lg mb-6 flex items-center" data-testid="success-message">
              <MdCheckCircle className="text-3xl mr-3" />
              <div>
                <p className="font-bold">Ticket Submitted Successfully!</p>
                <p className="text-sm">Our support team will get back to you soon.</p>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="bg-cyber-darker border-2 border-cyber-blue rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-cyber-red/20 border border-cyber-red text-cyber-red px-4 py-3 rounded-lg" data-testid="error-message">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-cyber-blue font-bold mb-2" htmlFor="name">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  data-testid="name-input"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-cyber-black border-2 border-cyber-blue rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyber-green transition-colors"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-cyber-blue font-bold mb-2" htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  data-testid="email-input"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-cyber-black border-2 border-cyber-blue rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyber-green transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-cyber-blue font-bold mb-2" htmlFor="issue">
                  Describe Your Issue
                </label>
                <textarea
                  id="issue"
                  name="issue"
                  data-testid="issue-input"
                  value={formData.issue}
                  onChange={handleChange}
                  className="w-full bg-cyber-black border-2 border-cyber-blue rounded-lg px-4 py-3 text-white min-h-[150px] focus:outline-none focus:border-cyber-green transition-colors"
                  placeholder="Please describe your issue in detail..."
                  required
                />
              </div>

              <button
                type="submit"
                data-testid="submit-button"
                disabled={loading}
                className="w-full bg-cyber-blue text-cyber-black font-bold py-3 rounded-lg hover:bg-cyber-green transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-cyber"
              >
                {loading ? 'Submitting...' : 'Submit Ticket'}
              </button>
            </form>
          </div>

          {/* FAQ Section */}
          <div className="mt-8 bg-cyber-darker border-2 border-cyber-green rounded-lg p-6">
            <h2 className="text-2xl font-bold text-cyber-green mb-4">Common Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-cyber-blue font-bold mb-1">How do I use the scanners?</h3>
                <p className="text-gray-400 text-sm">Navigate to the specific scanner from the dashboard and follow the on-screen instructions.</p>
              </div>
              <div>
                <h3 className="text-cyber-blue font-bold mb-1">Is my data stored?</h3>
                <p className="text-gray-400 text-sm">We only store scan metadata (type, risk level, timestamp). Your sensitive inputs are never saved.</p>
              </div>
              <div>
                <h3 className="text-cyber-blue font-bold mb-1">How accurate are the scans?</h3>
                <p className="text-gray-400 text-sm">Our tools use industry-leading APIs and AI patterns for maximum accuracy.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpDesk;