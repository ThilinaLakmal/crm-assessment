/**
 * ============================================
 * Authentication Routes
 * ============================================
 * POST /api/auth/login  —  Authenticate a user and return JWT
 */

const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

router.post('/login', login);

module.exports = router;
