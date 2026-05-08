/**
 * ============================================
 * Lead Routes
 * ============================================
 * All routes are protected by JWT authentication.
 *
 * GET    /api/leads          — List all leads (with optional filters)
 * GET    /api/leads/:id      — Get a single lead
 * POST   /api/leads          — Create a new lead
 * PUT    /api/leads/:id      — Update an existing lead
 * DELETE /api/leads/:id      — Delete a lead
 */

const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
} = require('../controllers/leadController');

// Apply auth middleware to ALL lead routes
router.use(authenticateToken);

router.get('/', getLeads);
router.get('/:id', getLeadById);
router.post('/', createLead);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

module.exports = router;
