/**
 * ============================================
 * CRM Lead Management System — Server Entry Point
 * ============================================
 * Sets up Express with:
 *  - CORS for cross-origin requests (frontend on a different port)
 *  - JSON body parsing
 *  - MySQL connection pool health check on startup
 *  - Route mounting
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('./config/db');

// ---- Import Routes ----
const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');
const noteRoutes = require('./routes/noteRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// Middleware
// ============================================
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173', // Vite default
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// API Routes
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/leads/:leadId/notes', noteRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ---- Health Check Endpoint ----
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CRM Backend is running.',
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// 404 Handler
// ============================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found.`,
  });
});

// ============================================
// Global Error Handler
// ============================================
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error.',
  });
});

// ============================================
// Start Server & Verify DB Connection
// ============================================
const startServer = async () => {
  try {
    // Verify database connectivity before accepting requests
    const connection = await pool.getConnection();
    console.log('✅ MySQL database connected successfully.');
    connection.release();

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to database:', error.message);
    console.error('   Please ensure MySQL is running and .env is configured correctly.');
    process.exit(1);
  }
};

startServer();
