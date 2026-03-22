require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn('⚠️  MONGODB_URI not set in environment variables. Database features will be unavailable.');
      return;
    }

    console.log('📡 Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      tls: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    if (error.message.includes('ReplicaSetNoPrimary')) {
      console.error('💡 TIP: Check if your IP address is whitelisted in MongoDB Atlas Network Access.');
    }
    console.log('⚠️ Running in degraded mode (no database integration)');
  }
};

connectDB();

const PORT = 5000;
app.listen(PORT, '::', () => {
  console.log(`🚀 CyberNet AI Backend running on port ${PORT} (Dual-Stack)`);
  console.log(`📡 API available at http://localhost:${PORT}`);
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/scan', require('./routes/scan'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/history', require('./routes/history'));
app.use('/api/helpdesk', require('./routes/helpdesk'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'CyberNet AI Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'CyberNet AI API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      scan: '/api/scan',
      ai: '/api/ai',
      history: '/api/history',
      helpdesk: '/api/helpdesk'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

