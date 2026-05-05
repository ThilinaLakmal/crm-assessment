/**
 * ============================================
 * Leads Page
 * ============================================
 * Full lead management UI with:
 *  - Search bar + status filter dropdown
 *  - "Add New Lead" button → opens LeadModal
 *  - Responsive data table with actions
 *  - Delete with confirmation
 *  - Edit via LeadModal
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Row, Col, Table, Button, Form, InputGroup,
  Spinner, Alert, Badge, ButtonGroup,
} from 'react-bootstrap';
import {
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineEye,
} from 'react-icons/hi';
import api from '../services/api';
import LeadModal from '../components/LeadModal';

// ---- Status filter options ----
const STATUS_OPTIONS = [
  'All',
  'New',
  'Contacted',
  'Qualified',
  'Proposal Sent',
  'Won',
  'Lost',
];

/**
 * Map each status to a Bootstrap-compatible badge variant.
 */
const STATUS_BADGE = {
  New:            { bg: 'primary',   label: 'New' },
  Contacted:      { bg: 'info',      label: 'Contacted' },
  Qualified:      { bg: 'warning',   label: 'Qualified' },
  'Proposal Sent':{ bg: 'secondary', label: 'Proposal Sent' },
  Won:            { bg: 'success',   label: 'Won' },
  Lost:           { bg: 'danger',    label: 'Lost' },
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(value || 0);

const Leads = () => {
  const navigate = useNavigate();
  // ---- State ----
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  // Delete state
  const [deleting, setDeleting] = useState(null); // lead id being deleted

  // ---- Fetch leads ----
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      if (search.trim()) params.search = search.trim();

      const { data } = await api.get('/leads', { params });
      setLeads(data.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch leads.');
      console.error('fetchLeads error:', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // ---- Delete handler ----
  const handleDelete = async (lead) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${lead.lead_name}"?\nThis action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      setDeleting(lead.id);
      await api.delete(`/leads/${lead.id}`);
      await fetchLeads();
    } catch (err) {
      setError('Failed to delete lead.');
    } finally {
      setDeleting(null);
    }
  };

  // ---- Modal handlers ----
  const openCreateModal = () => {
    setEditingLead(null);
    setShowModal(true);
  };

  const openEditModal = (lead) => {
    setEditingLead(lead);
    setShowModal(true);
  };

  return (
    <Container fluid className="px-4 py-4">
      {/* ---- Page Header ---- */}
      <div className="page-header mb-4">
        <h1 className="page-title">Leads</h1>
        <p className="page-subtitle">Manage and track your sales leads</p>
      </div>

      {/* ---- Toolbar: Search + Filter + Add ---- */}
      <Row className="g-3 mb-4 align-items-end">
        <Col xs={12} md={5} lg={4}>
          <InputGroup className="search-input-group">
            <InputGroup.Text className="search-icon-wrapper">
              <HiOutlineSearch />
            </InputGroup.Text>
            <Form.Control
              className="form-input-custom"
              placeholder="Search by name, company, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </Col>

        <Col xs={12} sm={6} md={3} lg={2}>
          <Form.Select
            className="form-input-custom"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === 'All' ? 'All Statuses' : s}
              </option>
            ))}
          </Form.Select>
        </Col>

        <Col xs={12} sm={6} md={4} lg={6} className="d-flex justify-content-md-end">
          <Button className="btn-add-lead" onClick={openCreateModal}>
            <HiOutlinePlus className="me-2" />
            Add New Lead
          </Button>
        </Col>
      </Row>

      {/* ---- Error Alert ---- */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')} className="mb-3">
          {error}
        </Alert>
      )}

      {/* ---- Loading ---- */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted-custom">Loading leads...</p>
        </div>
      ) : leads.length === 0 ? (
        /* ---- Empty State ---- */
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h4>No leads found</h4>
          <p className="text-muted-custom">
            {search || statusFilter !== 'All'
              ? 'Try adjusting your search or filter criteria.'
              : 'Click "Add New Lead" to get started.'}
          </p>
        </div>
      ) : (
        /* ---- Leads Table ---- */
        <div className="table-wrapper">
          <Table responsive hover className="leads-table">
            <thead>
              <tr>
                <th>Lead Name</th>
                <th>Company</th>
                <th>Status</th>
                <th>Deal Value</th>
                <th>Salesperson</th>
                <th>Source</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => {
                const badge = STATUS_BADGE[lead.status] || { bg: 'secondary', label: lead.status };
                return (
                  <tr key={lead.id}>
                    <td className="fw-medium">{lead.lead_name}</td>
                    <td>{lead.company_name || '—'}</td>
                    <td>
                      <Badge bg={badge.bg} className="status-badge">
                        {badge.label}
                      </Badge>
                    </td>
                    <td className="text-nowrap">
                      {formatCurrency(lead.estimated_deal_value)}
                    </td>
                    <td>{lead.assigned_salesperson || '—'}</td>
                    <td>{lead.lead_source || '—'}</td>
                    <td className="text-center">
                      <ButtonGroup size="sm">
                        <Button
                          variant="outline-info"
                          className="btn-action"
                          title="View Details"
                          onClick={() => navigate(`/leads/${lead.id}`)}
                        >
                          <HiOutlineEye />
                        </Button>
                        <Button
                          variant="outline-primary"
                          className="btn-action"
                          title="Edit"
                          onClick={() => openEditModal(lead)}
                        >
                          <HiOutlinePencil />
                        </Button>
                        <Button
                          variant="outline-danger"
                          className="btn-action"
                          title="Delete"
                          onClick={() => handleDelete(lead)}
                          disabled={deleting === lead.id}
                        >
                          {deleting === lead.id ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            <HiOutlineTrash />
                          )}
                        </Button>
                      </ButtonGroup>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}

      {/* ---- Lead Modal (Create/Edit) ---- */}
      <LeadModal
        show={showModal}
        onHide={() => setShowModal(false)}
        lead={editingLead}
        onSuccess={fetchLeads}
      />
    </Container>
  );
};

export default Leads;
