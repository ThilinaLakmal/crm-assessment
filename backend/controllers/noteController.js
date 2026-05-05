/**
 * ============================================
 * Note Controller
 * ============================================
 * Handles creating and retrieving notes that are
 * associated with a specific lead via lead_id (FK).
 */

const pool = require('../config/db');

/**
 * GET /api/leads/:leadId/notes
 * Fetch all notes for a given lead, newest first.
 */
const getNotesByLeadId = async (req, res) => {
  try {
    const { leadId } = req.params;

    // ---- Verify lead exists ----
    const [lead] = await pool.execute(
      'SELECT id FROM leads WHERE id = ?',
      [leadId]
    );

    if (lead.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Lead with ID ${leadId} not found.`,
      });
    }

    // ---- Fetch notes ----
    const [notes] = await pool.execute(
      'SELECT * FROM notes WHERE lead_id = ? ORDER BY created_at DESC',
      [leadId]
    );

    return res.status(200).json({
      success: true,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    console.error('getNotesByLeadId error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch notes.',
    });
  }
};

/**
 * POST /api/leads/:leadId/notes
 * Create a new note for a specific lead.
 * @body { content: string, created_by?: string }
 */
const createNote = async (req, res) => {
  try {
    const { leadId } = req.params;
    const { content, created_by } = req.body;

    // ---- Validation ----
    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Note content is required.',
      });
    }

    // ---- Verify lead exists ----
    const [lead] = await pool.execute(
      'SELECT id FROM leads WHERE id = ?',
      [leadId]
    );

    if (lead.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Lead with ID ${leadId} not found.`,
      });
    }

    // ---- Insert note ----
    const [result] = await pool.execute(
      'INSERT INTO notes (lead_id, content, created_by) VALUES (?, ?, ?)',
      [leadId, content.trim(), created_by || req.user.email]
    );

    // Return the newly created note
    const [newNote] = await pool.execute(
      'SELECT * FROM notes WHERE id = ?',
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: 'Note added successfully.',
      data: newNote[0],
    });
  } catch (error) {
    console.error('createNote error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to create note.',
    });
  }
};

module.exports = {
  getNotesByLeadId,
  createNote,
};
