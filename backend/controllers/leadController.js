/**
 * ============================================
 * Lead Controller
 * ============================================
 * Handles all CRUD operations for the leads table.
 * Every handler expects `req.user` to be set by the auth middleware.
 */

const pool = require('../config/db');

// Valid status values (mirrors the ENUM in the schema)
const VALID_STATUSES = [
  'New',
  'Contacted',
  'Qualified',
  'Proposal Sent',
  'Won',
  'Lost',
];

/**
 * GET /api/leads
 * Fetch all leads, newest first.
 * Supports optional query-param filtering:
 *   ?status=Won
 *   ?lead_source=Website
 *   ?search=acme          (searches lead_name, company_name, email)
 */
const getLeads = async (req, res) => {
  try {
    const { status, lead_source, assigned_salesperson, search } = req.query;

    let query = 'SELECT * FROM leads WHERE 1=1';
    const params = [];

    // ---- Optional Filters ----
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (lead_source) {
      query += ' AND lead_source = ?';
      params.push(lead_source);
    }

    if (assigned_salesperson) {
      query += ' AND assigned_salesperson = ?';
      params.push(assigned_salesperson);
    }

    if (search) {
      query += ' AND (lead_name LIKE ? OR company_name LIKE ? OR email LIKE ?)';
      const wildcard = `%${search}%`;
      params.push(wildcard, wildcard, wildcard);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.execute(query, params);

    return res.status(200).json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error('getLeads error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch leads.',
    });
  }
};

/**
 * GET /api/leads/:id
 * Fetch a single lead by its primary key.
 */
const getLeadById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      'SELECT * FROM leads WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Lead with ID ${id} not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error('getLeadById error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch lead.',
    });
  }
};

/**
 * POST /api/leads
 * Create a new lead.
 * @body { lead_name, company_name?, email?, phone_number?,
 *         lead_source?, assigned_salesperson?, status?, estimated_deal_value? }
 */
const createLead = async (req, res) => {
  try {
    const {
      lead_name,
      company_name,
      email,
      phone_number,
      lead_source,
      assigned_salesperson,
      status,
      estimated_deal_value,
    } = req.body;

    // ---- Validation ----
    if (!lead_name || lead_name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Lead name is required.',
      });
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
      });
    }

    // ---- Insert ----
    const [result] = await pool.execute(
      `INSERT INTO leads
        (lead_name, company_name, email, phone_number, lead_source,
         assigned_salesperson, status, estimated_deal_value)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        lead_name.trim(),
        company_name || null,
        email || null,
        phone_number || null,
        lead_source || null,
        assigned_salesperson || null,
        status || 'New',
        estimated_deal_value || 0,
      ]
    );

    // Fetch the newly created lead to return it
    const [newLead] = await pool.execute(
      'SELECT * FROM leads WHERE id = ?',
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: 'Lead created successfully.',
      data: newLead[0],
    });
  } catch (error) {
    console.error('createLead error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to create lead.',
    });
  }
};

/**
 * PUT /api/leads/:id
 * Update an existing lead. Accepts partial updates —
 * only provided fields are overwritten.
 */
const updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      lead_name,
      company_name,
      email,
      phone_number,
      lead_source,
      assigned_salesperson,
      status,
      estimated_deal_value,
    } = req.body;

    // ---- Check lead exists ----
    const [existing] = await pool.execute(
      'SELECT * FROM leads WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Lead with ID ${id} not found.`,
      });
    }

    // ---- Validate status if provided ----
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
      });
    }

    // ---- Build update using current values as fallback ----
    const current = existing[0];

    const [result] = await pool.execute(
      `UPDATE leads SET
        lead_name = ?,
        company_name = ?,
        email = ?,
        phone_number = ?,
        lead_source = ?,
        assigned_salesperson = ?,
        status = ?,
        estimated_deal_value = ?
       WHERE id = ?`,
      [
        lead_name !== undefined ? lead_name : current.lead_name,
        company_name !== undefined ? company_name : current.company_name,
        email !== undefined ? email : current.email,
        phone_number !== undefined ? phone_number : current.phone_number,
        lead_source !== undefined ? lead_source : current.lead_source,
        assigned_salesperson !== undefined ? assigned_salesperson : current.assigned_salesperson,
        status !== undefined ? status : current.status,
        estimated_deal_value !== undefined ? estimated_deal_value : current.estimated_deal_value,
        id,
      ]
    );

    // Return the updated lead
    const [updated] = await pool.execute(
      'SELECT * FROM leads WHERE id = ?',
      [id]
    );

    return res.status(200).json({
      success: true,
      message: 'Lead updated successfully.',
      data: updated[0],
    });
  } catch (error) {
    console.error('updateLead error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to update lead.',
    });
  }
};

/**
 * DELETE /api/leads/:id
 * Permanently delete a lead (cascade deletes its notes via FK).
 */
const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    // ---- Check lead exists ----
    const [existing] = await pool.execute(
      'SELECT id FROM leads WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Lead with ID ${id} not found.`,
      });
    }

    await pool.execute('DELETE FROM leads WHERE id = ?', [id]);

    return res.status(200).json({
      success: true,
      message: 'Lead deleted successfully.',
    });
  } catch (error) {
    console.error('deleteLead error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete lead.',
    });
  }
};

module.exports = {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
};
