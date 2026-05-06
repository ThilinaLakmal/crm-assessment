import { Container } from 'react-bootstrap';
import { HiOutlineCode, HiOutlineExternalLink, HiOutlineSparkles } from 'react-icons/hi';

const Footer = () => {
  return (
    <footer className="app-footer">
      <Container fluid className="px-2 py-2">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-4">
          
          {/* Brand & Version Info */}
          <div className="footer-brand d-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <HiOutlineSparkles size={18} color="var(--primary-500)" />
              <span className="fw-bold" style={{ color: 'var(--text-heading)', letterSpacing: '0.5px' }}>CRM LEAD MANAGER</span>
            </div>
            <div className="d-none d-sm-block vr" style={{ opacity: 0.2, height: '16px' }}></div>
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>Version 2.4.0</span>
          </div>

          {/* Middle Links */}
          <div className="footer-links d-flex gap-4 align-items-center">
            <a href="#help" className="text-muted-custom text-decoration-none fw-medium hover-primary" style={{ fontSize: '0.9rem' }}>
              Help Center
            </a>
            <a href="#api" className="text-muted-custom text-decoration-none fw-medium hover-primary d-flex align-items-center gap-1" style={{ fontSize: '0.9rem' }}>
              <HiOutlineCode size={16} /> API Docs
            </a>
            <a href="#changelog" className="text-muted-custom text-decoration-none fw-medium hover-primary d-flex align-items-center gap-1" style={{ fontSize: '0.9rem' }}>
              Changelog <HiOutlineExternalLink size={14} />
            </a>
          </div>

          {/* System Status & Copyright */}
          <div className="footer-status d-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill" style={{ background: 'var(--surface-glass)', border: '1px solid var(--border-color)' }}>
              <div className="bg-success rounded-circle" style={{ width: '8px', height: '8px', boxShadow: '0 0 8px var(--success)' }}></div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: '500' }}>All Systems Operational</span>
            </div>
          </div>

        </div>
        
        <div className="text-center mt-4">
          <span className="text-muted" style={{ fontSize: '0.8rem' }}>
            &copy; {new Date().getFullYear()} CRM Lead Manager Inc. Designed with React & Bootstrap.
          </span>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
