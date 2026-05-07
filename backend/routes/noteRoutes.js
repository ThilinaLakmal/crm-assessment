/**
 * ============================================
 * Note Routes
 * ============================================
 * Nested under /api/leads/:leadId/notes.
 * All routes are protected by JWT authentication.
 * Uses { mergeParams: true } so we can access :leadId
 * from the parent router mount.
 *
 * GET   /api/leads/:leadId/notes   — List all notes for a lead
 * POST  /api/leads/:leadId/notes   — Add a note to a lead
 */

const express = require('express');
const router = express.Router({ mergeParams: true });
const authenticateToken = require('../middleware/auth');
const {
  getNotesByLeadId,
  createNote,
  deleteNote,
  updateNote,
} = require('../controllers/noteController');

// Apply auth middleware to ALL note routes
router.use(authenticateToken);

router.get('/', getNotesByLeadId);
router.post('/', createNote);
router.put('/:noteId', updateNote);
router.delete('/:noteId', deleteNote);

module.exports = router;
