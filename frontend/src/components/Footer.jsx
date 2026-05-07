import { Container, Row, Col } from 'react-bootstrap';
import { 
  HiOutlineCode, 
  HiOutlineExternalLink, 
  HiOutlineSparkles, 
  HiOutlineShieldCheck, 
  HiOutlineDocumentText, 
  HiOutlineSupport, 
  HiOutlineGlobeAlt 
} from 'react-icons/hi';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="app-footer">
      <Container fluid className="px-4 py-3">
        <Row className="gy-3 mb-1">
          {/* Brand & Mission */}
          <Col md={12} lg={5}>
            <div className="d-flex align-items-center gap-2 mb-2">
              <HiOutlineSparkles size={24} color="var(--primary-500)" />
              <span className="fw-bold fs-5" style={{ color: 'var(--text-heading)', letterSpacing: '0.5px' }}>CRM LEAD MANAGER</span>
            </div>
            <p className="text-muted mb-0" style={{ fontSize: '0.9rem', maxWidth: '450px', lineHeight: '1.6' }}>
              The all-in-one platform for sales teams to track, manage, and close leads with intelligence. 
              Designed for high-growth enterprises seeking clarity in their sales pipeline.
            </p>
          </Col>

          {/* Resources Links */}
          <Col xs={6} md={4} lg={2}>
            <h6 className="fw-bold mb-2" style={{ color: 'var(--text-heading)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Resources</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              <li><a href="#help" className="footer-link-item">Help Center</a></li>
              <li><a href="#api" className="footer-link-item"><HiOutlineCode size={14} className="me-1" /> API Reference</a></li>
              <li><a href="#changelog" className="footer-link-item">Changelog <HiOutlineExternalLink size={12} className="ms-1" /></a></li>
            </ul>
          </Col>

          {/* Legal Links */}
          <Col xs={6} md={4} lg={2}>
            <h6 className="fw-bold mb-2" style={{ color: 'var(--text-heading)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Legal</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              <li><a href="#privacy" className="footer-link-item"><HiOutlineShieldCheck size={14} className="me-1" /> Privacy Policy</a></li>
              <li><a href="#terms" className="footer-link-item"><HiOutlineDocumentText size={14} className="me-1" /> Terms of Service</a></li>
              <li><a href="#security" className="footer-link-item">Security</a></li>
            </ul>
          </Col>

          {/* Connect Links */}
          <Col xs={12} md={4} lg={3}>
            <h6 className="fw-bold mb-2" style={{ color: 'var(--text-heading)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Connect</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              <li><a href="#support" className="footer-link-item"><HiOutlineSupport size={14} className="me-1" /> Contact Support</a></li>
              <li><a href="#website" className="footer-link-item"><HiOutlineGlobeAlt size={14} className="me-1" /> Official Website</a></li>
            </ul>
          </Col>
        </Row>

        <hr style={{ borderColor: 'var(--border-color)', opacity: 0.1, margin: '1rem 0' }} />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <div className="d-flex align-items-center gap-3 order-2 order-md-1">
             <span className="text-muted" style={{ fontSize: '0.85rem' }}>&copy; {currentYear} CRM Lead Manager Inc.</span>
             <div className="vr d-none d-sm-block" style={{ opacity: 0.2, height: '16px' }}></div>
             <span className="text-muted" style={{ fontSize: '0.85rem' }}>Version 2.4.0</span>
          </div>

          <div className="footer-status d-flex align-items-center gap-2 px-3 py-1 rounded-pill order-1 order-md-2" style={{ background: 'var(--surface-glass)', border: '1px solid var(--border-color)' }}>
            <div className="bg-success rounded-circle" style={{ width: '8px', height: '8px', boxShadow: '0 0 8px var(--success)' }}></div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: '500' }}>All Systems Operational</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
