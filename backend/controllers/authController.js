/**
 * ============================================
 * Authentication Controller
 * ============================================
 * Handles user login by validating credentials against the
 * database and issuing a signed JWT on success.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

/**
 * POST /api/auth/login
 * @body { email: string, password: string }
 * @returns { success, message, token, user }
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ---- Input Validation ----
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    // ---- Find User by Email ----
    const [rows] = await pool.execute(
      'SELECT id, email, password FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const user = rows[0];

    // ---- Compare Password Hash ----
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // ---- Generate JWT ----
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // ---- Success Response ----
    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

module.exports = { login };
