/**
 * ============================================
 * Dashboard Controller
 * ============================================
 * Aggregates lead statistics for the dashboard UI.
 * Uses a single SQL query with conditional aggregation
 * (SUM + CASE) for maximum efficiency — one DB round-trip
 * instead of seven separate queries.
 */

const pool = require('../config/db');

/**
 * GET /api/dashboard
 * Returns all key metrics in a single response.
 */
const getDashboardStats = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT
        COUNT(*)                                                    AS totalLeads,
        SUM(CASE WHEN status = 'New'       THEN 1 ELSE 0 END)      AS newLeads,
        SUM(CASE WHEN status = 'Qualified'  THEN 1 ELSE 0 END)     AS qualifiedLeads,
        SUM(CASE WHEN status = 'Won'        THEN 1 ELSE 0 END)     AS wonLeads,
        SUM(CASE WHEN status = 'Lost'       THEN 1 ELSE 0 END)     AS lostLeads,
        COALESCE(SUM(estimated_deal_value), 0)                      AS totalEstimatedValue,
        COALESCE(SUM(CASE WHEN status = 'Won'
                      THEN estimated_deal_value ELSE 0 END), 0)     AS wonDealsValue
      FROM leads
    `);

    // rows[0] always exists (aggregate returns one row even on empty table)
    const stats = rows[0];

    return res.status(200).json({
      success: true,
      data: {
        totalLeads:          Number(stats.totalLeads),
        newLeads:            Number(stats.newLeads),
        qualifiedLeads:      Number(stats.qualifiedLeads),
        wonLeads:            Number(stats.wonLeads),
        lostLeads:           Number(stats.lostLeads),
        totalEstimatedValue: Number(stats.totalEstimatedValue),
        wonDealsValue:       Number(stats.wonDealsValue),
      },
    });
  } catch (error) {
    console.error('getDashboardStats error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics.',
    });
  }
};

module.exports = { getDashboardStats };
