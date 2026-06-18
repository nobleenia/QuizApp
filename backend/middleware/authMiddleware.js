const jwt = require('jsonwebtoken');
const { isTokenBlacklisted } = require('../redisClient');

const verifyToken = async (req, res, next) => {
  const token = req.header('x-auth-token') || req.header('authorization')?.replace(/^Bearer\s+/i, '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const blacklisted = await isTokenBlacklisted(token);
    if (blacklisted) {
      return res.status(401).json({ message: 'Token has been logged out' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please log in again.' });
    }
    console.warn('Authentication failed:', err.message);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

const authorizeRole = (role) => (req, res, next) => {
  if (req.user?.role !== role) {
    return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
  }
  next();
};

module.exports = { verifyToken, authorizeRole };
