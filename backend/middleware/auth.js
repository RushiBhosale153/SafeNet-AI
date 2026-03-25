const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  // Always permit OPTIONS requests for CORS preflight
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;