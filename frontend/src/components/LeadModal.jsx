/**
 * ============================================
 * Lead Modal Component (Create / Edit)
 * ============================================
 * Reusable modal form for creating or editing a lead.
 * - If `lead` prop is provided → Edit mode (PUT)
 * - If `lead` is null → Create mode (POST)
 * Calls `onSuccess` after a successful save so the
 * parent can refresh its lead list.
 */

import { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import api from '../services/api';

// ---- Constants ----
const STATUS_OPTIONS = [
  'New',
  'Contacted',
  'Qualified',
  'Proposal Sent',
  'Won',
  'Lost',
];

const SOURCE_OPTIONS = [
  'Website',
  'Referral',
  'LinkedIn',
  'Cold Call',
  'Email Campaign',
  'Other',
];

const EMPTY_FORM = {
  lead_name: '',
  company_name: '',
  email: '',
  phone_number: '',
  lead_source: '',
  assigned_salesperson: '',
  status: 'New',
  estimated_deal_value: '',
};

const LeadModal = ({ show, onHide, lead, onSuccess }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const isEdit = !!lead;

  // ---- Populate form when editing ----
  useEffect(() => {
    if (lead) {
      setForm({
        lead_name: lead.lead_name || '',
        company_name: lead.company_name || '',
        email: lead.email || '',
        phone_number: lead.phone_number || '',
        lead_source: lead.lead_source || '',
        assigned_salesperson: lead.assigned_salesperson || '',
        status: lead.status || 'New',
        estimated_deal_value: lead.estimated_deal_value || '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setError('');
  }, [lead, show]);

  // ---- Handle input changes ----
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ---- Submit ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!form.lead_name.trim()) {
      setError('Lead name is required.');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...form,
        estimated_deal_value: form.estimated_deal_value
          ? parseFloat(form.estimated_deal_value)
          : 0,
      };

      if (isEdit) {
        await api.put(`/leads/${lead.id}`, payload);
      } else {
        await api.post('/leads', payload);
      }

      onSuccess(); // Refresh parent list
      onHide();    // Close modal
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save lead.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      className="lead-modal"
      backdrop="static"
    >
      <Modal.Header closeButton className="modal-header-custom">
        <Modal.Title className="modal-title-custom">
          {isEdit ? 'Edit Lead' : 'Add New Lead'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="modal-body-custom">
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit} id="leadForm">
          <Row className="g-3">
            {/* Lead Name */}
            <Col md={6}>
              <Form.Group controlId="leadName">
                <Form.Label className="form-label-custom">Lead Name *</Form.Label>
                <Form.Control
                  className="form-input-custom"
                  name="lead_name"
                  value={form.lead_name}
                  onChange={handleChange}
                  placeholder="John Smith"
                  required
                />
              </Form.Group>
            </Col>

            {/* Company */}
            <Col md={6}>
              <Form.Group controlId="companyName">
                <Form.Label className="form-label-custom">Company</Form.Label>
                <Form.Control
                  className="form-input-custom"
                  name="company_name"
                  value={form.company_name}
                  onChange={handleChange}
                  placeholder="Acme Corp"
                />
              </Form.Group>
            </Col>

            {/* Email */}
            <Col md={6}>
              <Form.Group controlId="leadEmail">
                <Form.Label className="form-label-custom">Email</Form.Label>
                <Form.Control
                  className="form-input-custom"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@acme.com"
                />
              </Form.Group>
            </Col>

            {/* Phone */}
            <Col md={6}>
              <Form.Group controlId="phoneNumber">
                <Form.Label className="form-label-custom">Phone</Form.Label>
                <Form.Control
                  className="form-input-custom"
                  name="phone_number"
                  value={form.phone_number}
                  onChange={handleChange}
                  placeholder="+1-555-0100"
                />
              </Form.Group>
            </Col>

            {/* Lead Source */}
            <Col md={6}>
              <Form.Group controlId="leadSource">
                <Form.Label className="form-label-custom">Lead Source</Form.Label>
                <Form.Select
                  className="form-input-custom"
                  name="lead_source"
                  value={form.lead_source}
                  onChange={handleChange}
                >
                  <option value="">Select source...</option>
                  {SOURCE_OPTIONS.map((src) => (
                    <option key={src} value={src}>{src}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Status */}
            <Col md={6}>
              <Form.Group controlId="leadStatus">
                <Form.Label className="form-label-custom">Status</Form.Label>
                <Form.Select
                  className="form-input-custom"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Assigned Salesperson */}
            <Col md={6}>
              <Form.Group controlId="salesperson">
                <Form.Label className="form-label-custom">Assigned Salesperson</Form.Label>
                <Form.Control
                  className="form-input-custom"
                  name="assigned_salesperson"
                  value={form.assigned_salesperson}
                  onChange={handleChange}
                  placeholder="Alice Johnson"
                />
              </Form.Group>
            </Col>

            {/* Deal Value */}
            <Col md={6}>
              <Form.Group controlId="dealValue">
                <Form.Label className="form-label-custom">Estimated Deal Value ($)</Form.Label>
                <Form.Control
                  className="form-input-custom"
                  type="number"
                  name="estimated_deal_value"
                  value={form.estimated_deal_value}
                  onChange={handleChange}
                  placeholder="50000"
                  min="0"
                  step="0.01"
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer className="modal-footer-custom">
        <Button
          variant="secondary"
          onClick={onHide}
          disabled={saving}
          className="btn-modal-cancel"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="leadForm"
          className="btn-modal-save"
          disabled={saving}
        >
          {saving ? (
            <>
              <Spinner as="span" animation="border" size="sm" className="me-2" />
              Saving...
            </>
          ) : isEdit ? (
            'Update Lead'
          ) : (
            'Create Lead'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LeadModal;
