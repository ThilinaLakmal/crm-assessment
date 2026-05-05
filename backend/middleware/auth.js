/**
 * ============================================
 * JWT Authentication Middleware
 * ============================================
 * Verifies the JWT token from the Authorization header.
 * Attaches the decoded user payload to `req.user` on success.
 * Returns 401/403 on missing/invalid tokens.
 */

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Extract token from "Bearer <token>" format
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, iat, exp }
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }
};

module.exports = authenticateToken;
