/**
 * ============================================
 * Navigation Bar Component
 * ============================================
 * Top-level navbar with:
 *  - App branding
 *  - Navigation links (Dashboard, Leads)
 *  - User info + Logout button
 */

import { Navbar as BSNavbar, Nav, Container, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  HiOutlineChartBar,
  HiOutlineUsers,
  HiOutlineLogout,
} from 'react-icons/hi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <BSNavbar className="app-navbar" expand="md" variant="dark" sticky="top">
      <Container fluid className="px-4">

        {/* ---- Brand ---- */}
        <BSNavbar.Brand className="navbar-brand-custom">
          <span className="brand-icon">📊</span>
          <span className="brand-text">CRM Lead Manager</span>
        </BSNavbar.Brand>

        <BSNavbar.Toggle aria-controls="main-nav" />

        <BSNavbar.Collapse id="main-nav">
          {/* ---- Nav Links ---- */}
          <Nav className="me-auto">
            <Nav.Link
              as={NavLink}
              to="/"
              end
              className="nav-link-custom"
            >
              <HiOutlineChartBar className="me-1" />
              Dashboard
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/leads"
              className="nav-link-custom"
            >
              <HiOutlineUsers className="me-1" />
              Leads
            </Nav.Link>
          </Nav>

          {/* ---- User & Logout ---- */}
          <div className="d-flex align-items-center gap-3">
            <span className="user-email">{user?.email}</span>
            <Button
              variant="outline-light"
              size="sm"
              className="btn-logout"
              onClick={handleLogout}
            >
              <HiOutlineLogout className="me-1" />
              Logout
            </Button>
          </div>
        </BSNavbar.Collapse>

      </Container>
    </BSNavbar>
  );
};

export default Navbar;
