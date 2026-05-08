/**
 * ============================================
 * Lead Details Page
 * ============================================
 * Two-column layout showing:
 *  - Left: Lead info card with all fields
 *  - Right: Notes timeline + add-note form
 *
 * Fetches lead data and notes on mount using
 * the :id param from the URL.
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container, Row, Col, Card, Badge, Button,
  Form, Spinner, Alert,
} from 'react-bootstrap';
import {
  HiOutlineArrowLeft,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineOfficeBuilding,
  HiOutlineUser,
  HiOutlineCurrencyDollar,
  HiOutlineGlobe,
  HiOutlineClock,
  HiOutlinePencil,
  HiOutlineChatAlt2,
  HiOutlineTrash,
} from 'react-icons/hi';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';
import { useAuth } from '../contexts/AuthContext';

// ---- Status badge color map ----
const STATUS_BADGE = {
  New:             { bg: 'primary',   label: 'New' },
  Contacted:       { bg: 'info',      label: 'Contacted' },
  Qualified:       { bg: 'warning',   label: 'Qualified' },
  'Proposal Sent': { bg: 'secondary', label: 'Proposal Sent' },
  Won:             { bg: 'success',   label: 'Won' },
  Lost:            { bg: 'danger',    label: 'Lost' },
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(value || 0);

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // ---- State ----
  const [lead, setLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Notes form
  const [noteContent, setNoteContent] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);
  const [noteError, setNoteError] = useState('');

  // Delete note state
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [deletingNote, setDeletingNote] = useState(false);

  // Edit note state
  const [editingNoteId, setEditingNoteId] = useState(null);

  // ---- Fetch lead details ----
  const fetchLead = useCallback(async () => {
    try {
      const { data } = await api.get(`/leads/${id}`);
      setLead(data.data);
    } catch (err) {
      setError('Failed to load lead details.');
    }
  }, [id]);

  // ---- Fetch notes ----
  const fetchNotes = useCallback(async () => {
    try {
      const { data } = await api.get(`/leads/${id}/notes`);
      setNotes(data.data);
    } catch (err) {
      console.error('fetchNotes error:', err);
    }
  }, [id]);

  // ---- Initial load ----
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchLead(), fetchNotes()]);
      setLoading(false);
    };
    loadAll();
  }, [fetchLead, fetchNotes]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    setNoteError('');

    if (!noteContent.trim()) {
      setNoteError('Note content cannot be empty.');
      return;
    }

    setSubmittingNote(true);

    try {
      if (editingNoteId) {
        await api.put(`/leads/${id}/notes/${editingNoteId}`, { content: noteContent.trim() });
        toast.success('Note updated successfully!');
        setEditingNoteId(null);
      } else {
        await api.post(`/leads/${id}/notes`, { content: noteContent.trim() });
        toast.success('Note added successfully!');
      }
      setNoteContent('');
      await fetchNotes(); // Refresh notes list
    } catch (err) {
      const msg = err.response?.data?.message || (editingNoteId ? 'Failed to update note.' : 'Failed to add note.');
      setNoteError(msg);
      toast.error(msg);
    } finally {
      setSubmittingNote(false);
    }
  };

  const handleEditNoteClick = (note) => {
    setEditingNoteId(note.id);
    setNoteContent(note.content);
    // Optional: scroll to top to bring input into view
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ---- Delete note handler ----
  const handleDeleteNoteClick = (note) => {
    setNoteToDelete(note);
  };

  const confirmDeleteNote = async () => {
    if (!noteToDelete) return;

    try {
      setDeletingNote(true);
      await api.delete(`/leads/${id}/notes/${noteToDelete.id}`);
      toast.success('Note deleted successfully!');
      await fetchNotes(); // Refresh notes list
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete note.');
    } finally {
      setDeletingNote(false);
      setNoteToDelete(null);
    }
  };

  // ---- Loading State ----
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted-custom">Loading lead details...</p>
      </Container>
    );
  }

  // ---- Error State ----
  if (error || !lead) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error || 'Lead not found.'}</Alert>
        <Button variant="outline-light" onClick={() => navigate('/leads')}>
          <HiOutlineArrowLeft className="me-2" />
          Back to Leads
        </Button>
      </Container>
    );
  }

  const badge = STATUS_BADGE[lead.status] || { bg: 'secondary', label: lead.status };

  return (
    <Container fluid className="px-4 py-4">
      {/* ---- Back Button + Page Header ---- */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <Button
          variant="outline-light"
          size="sm"
          className="btn-back"
          onClick={() => navigate('/leads')}
        >
          <HiOutlineArrowLeft />
        </Button>
        <div>
          <h1 className="page-title mb-0">{lead.lead_name}</h1>
          <p className="page-subtitle mb-0">
            {lead.company_name || 'No company'} · Added {formatDate(lead.created_at)}
          </p>
        </div>
        <Badge bg={badge.bg} className="status-badge ms-auto fs-6">
          {badge.label}
        </Badge>
      </div>

      <Row className="g-4">
        {/* ============================================
         * LEFT COLUMN — Lead Information
         * ============================================ */}
        <Col lg={5} xl={4}>
          <Card className="detail-card">
            <Card.Header className="detail-card-header">
              <HiOutlineUser className="me-2" />
              Lead Information
            </Card.Header>
            <Card.Body className="p-0">
              <div className="detail-list">

                <div className="detail-item">
                  <div className="detail-icon">
                    <HiOutlineUser />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Full Name</span>
                    <span className="detail-value">{lead.lead_name}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <HiOutlineOfficeBuilding />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Company</span>
                    <span className="detail-value">{lead.company_name || '—'}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <HiOutlineMail />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">
                      {lead.email ? (
                        <a href={`mailto:${lead.email}`} className="detail-link">{lead.email}</a>
                      ) : '—'}
                    </span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <HiOutlinePhone />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Phone</span>
                    <span className="detail-value">{lead.phone_number || '—'}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <HiOutlineGlobe />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Lead Source</span>
                    <span className="detail-value">{lead.lead_source || '—'}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <HiOutlinePencil />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Assigned Salesperson</span>
                    <span className="detail-value">{lead.assigned_salesperson || '—'}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <HiOutlineCurrencyDollar />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Estimated Deal Value</span>
                    <span className="detail-value detail-value-highlight">
                      {formatCurrency(lead.estimated_deal_value)}
                    </span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <HiOutlineClock />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Last Updated</span>
                    <span className="detail-value">{formatDate(lead.updated_at)}</span>
                  </div>
                </div>

              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* ============================================
         * RIGHT COLUMN — Notes
         * ============================================ */}
        <Col lg={7} xl={8}>
          {/* ---- Add Note Form ---- */}
          <Card className="detail-card mb-4">
            <Card.Header className="detail-card-header">
              <HiOutlineChatAlt2 className="me-2" />
              {editingNoteId ? 'Edit Note' : 'Add a Note'}
            </Card.Header>
            <Card.Body>
              {noteError && (
                <Alert variant="danger" dismissible onClose={() => setNoteError('')} className="mb-3">
                  {noteError}
                </Alert>
              )}
              <Form onSubmit={handleAddNote}>
                <Form.Group className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    className="form-input-custom"
                    placeholder="Write a note about this lead..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    disabled={submittingNote}
                  />
                </Form.Group>
                <div className="d-flex justify-content-end">
                  <Button
                    type="submit"
                    className="btn-modal-save"
                    disabled={submittingNote || !noteContent.trim()}
                  >
                    {submittingNote ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                        Saving...
                      </>
                    ) : editingNoteId ? (
                      'Update Note'
                    ) : (
                      'Add Note'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* ---- Notes Timeline ---- */}
          <Card className="detail-card">
            <Card.Header className="detail-card-header">
              <HiOutlineClock className="me-2" />
              Notes History
              <Badge bg="secondary" className="ms-2">{notes.length}</Badge>
            </Card.Header>
            <Card.Body className="notes-timeline-body">
              {notes.length === 0 ? (
                <div className="empty-state py-4">
                  <div className="empty-state-icon">📝</div>
                  <h5>No notes yet</h5>
                  <p className="text-muted-custom">Add the first note above.</p>
                </div>
              ) : (
                <div className="notes-timeline">
                  {notes.map((note) => (
                    <div key={note.id} className="note-item">
                      <div className="note-dot" />
                      <div className="note-card">
                        <div className="note-meta d-flex align-items-start justify-content-between">
                          <div>
                            <span className="note-author d-block">
                              {note.created_by || 'Unknown'}
                            </span>
                            <span className="note-date">
                              {formatDate(note.created_at)}
                            </span>
                          </div>
                          {user?.email === 'admin@example.com' && (
                            <div className="d-flex gap-2">
                              <Button 
                                variant="link" 
                                className="p-0 text-primary"
                                title="Edit Note"
                                onClick={() => handleEditNoteClick(note)}
                                style={{ opacity: 0.8 }}
                              >
                                <HiOutlinePencil size={18} />
                              </Button>
                              <Button 
                                variant="link" 
                                className="p-0 text-danger"
                                title="Delete Note"
                                onClick={() => handleDeleteNoteClick(note)}
                                style={{ opacity: 0.7 }}
                              >
                                <HiOutlineTrash size={18} />
                              </Button>
                            </div>
                          )}
                        </div>
                        <p className="note-content mt-2 mb-0">{note.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ConfirmModal 
        show={!!noteToDelete}
        onHide={() => setNoteToDelete(null)}
        onConfirm={confirmDeleteNote}
        title="Delete Note"
        message="Are you sure you want to delete this note?\nThis action cannot be undone."
        isProcessing={deletingNote}
      />
    </Container>
  );
};

export default LeadDetails;
