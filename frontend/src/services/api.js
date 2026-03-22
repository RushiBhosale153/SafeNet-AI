import axios from 'axios';

const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = process.env.REACT_APP_BACKEND_URL || (isDev ? 'http://127.0.0.1:5000' : '');

if (!API_URL && !isDev) {
  console.error('CRITICAL: REACT_APP_BACKEND_URL is not set in production environment.');
}

const api = axios.create({
  baseURL: API_URL
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (email, password) => api.post('/api/auth/register', { email, password }),
  verifyOTP: (userId, otp) => api.post('/api/auth/verify-otp', { userId, otp }),
  resendOTP: (userId) => api.post('/api/auth/resend-otp', { userId }),
  login: (email, password) => api.post('/api/auth/login', { email, password })
};

// Scan APIs
export const scanAPI = {
  phishing: (message) => api.post('/api/scan/phishing', { message }),
  phishingFile: (formData) => api.post('/api/scan/phishing/file', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  website: (url) => api.post('/api/scan/website', { url }),
  leakCheck: (email) => api.post('/api/scan/leak-check', { email }),
  unified: (input) => api.post('/api/scan/unified', { input })
};

// AI API
export const aiAPI = {
  chat: (message, conversationHistory) => api.post('/api/ai/chat', { message, conversationHistory })
};

// History API
export const historyAPI = {
  getHistory: () => api.get('/api/history'),
  getStats: () => api.get('/api/history/stats'),
  seedDemo: () => api.post('/api/history/seed-demo')
};

// Help Desk API
export const helpdeskAPI = {
  submit: (name, email, issue) => api.post('/api/helpdesk/submit', { name, email, issue })
};

export default api;