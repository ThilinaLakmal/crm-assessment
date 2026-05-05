/**
 * ============================================
 * Database Configuration
 * ============================================
 * Creates and exports a MySQL connection pool using mysql2/promise.
 * A pool is used instead of a single connection for better
 * concurrency handling and automatic reconnection.
 */

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,       // Max simultaneous connections
  queueLimit: 0,             // Unlimited queued requests
  enableKeepAlive: true,     // Prevent idle disconnections
  keepAliveInitialDelay: 0,
});

module.exports = pool;
