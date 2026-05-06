import { Navbar as BSNavbar, Container, Button, Form, InputGroup, Dropdown, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  HiOutlineLogout,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineMenu,
  HiOutlineSearch,
  HiOutlineBell,
  HiOutlineUser,
  HiOutlineCog,
  HiOutlineInbox
} from 'react-icons/hi';

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <BSNavbar className="app-navbar border-bottom" expand="md" variant={isDarkMode ? 'dark' : 'light'} sticky="top">
      <Container fluid className="px-4 d-flex justify-content-between align-items-center">

        {/* ---- Left Side: Hamburger & Global Search ---- */}
        <div className="d-flex align-items-center gap-3">
          <Button 
            variant="link" 
            onClick={toggleSidebar}
            className="p-0 text-decoration-none hamburger-btn"
            style={{ color: 'var(--text-heading)' }}
          >
            <HiOutlineMenu size={24} />
          </Button>

          {/* Decorative Global Search */}
          <div className="d-none d-lg-block ms-2" style={{ width: '320px' }}>
            <InputGroup className="global-search-group">
              <InputGroup.Text className="bg-transparent border-end-0 pe-0 text-muted" style={{ borderColor: 'var(--border-color)' }}>
                <HiOutlineSearch size={18} />
              </InputGroup.Text>
              <Form.Control 
                type="text" 
                placeholder="Search leads, contacts, or deals..." 
                className="border-start-0 bg-transparent shadow-none"
                style={{ 
                  fontSize: '0.9rem', 
                  color: 'var(--input-text)',
                  borderColor: 'var(--border-color)' 
                }}
              />
            </InputGroup>
          </div>
        </div>

        {/* ---- Right Side: Tools & Profile ---- */}
        <div className="d-flex align-items-center gap-3 ms-auto">
          
          {/* Theme Toggle */}
          <Button
            variant="outline-secondary"
            size="sm"
            className="btn-theme-toggle d-none d-sm-inline-flex"
            onClick={toggleTheme}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? (
              <><HiOutlineSun size={16} className="me-1" /> Light</>
            ) : (
              <><HiOutlineMoon size={16} className="me-1" /> Dark</>
            )}
          </Button>

          {/* Notifications Dropdown */}
          <Dropdown align="end">
            <Dropdown.Toggle 
              variant="link" 
              className="position-relative p-0 mx-2 text-decoration-none border-0 shadow-none user-dropdown-toggle" 
              style={{ color: 'var(--text-heading)' }}
              id="notification-dropdown"
            >
              <HiOutlineBell size={22} />
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger rounded-circle border border-2 border-white" style={{ width: '10px', height: '10px' }}>
                <span className="visually-hidden">New alerts</span>
              </span>
            </Dropdown.Toggle>

            <Dropdown.Menu 
              className="shadow-lg border mt-2 dropdown-animated" 
              style={{ 
                minWidth: '280px', 
                backgroundColor: 'var(--surface-secondary)',
                borderColor: 'var(--border-color)',
                borderRadius: '12px'
              }}
            >
              <div className="px-3 py-2 border-bottom d-flex justify-content-between align-items-center" style={{ borderColor: 'var(--border-color) !important' }}>
                <p className="mb-0 fw-bold" style={{ color: 'var(--text-heading)', fontSize: '0.95rem' }}>Notifications</p>
                <Badge bg="primary" pill>0 New</Badge>
              </div>
              <div className="p-4 text-center">
                <HiOutlineInbox size={48} color="var(--gray-500)" className="mb-2" style={{ opacity: 0.5 }} />
                <p className="mb-0 text-muted" style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>You're all caught up!</p>
                <p className="text-muted mt-1 mb-0" style={{ fontSize: '0.75rem' }}>Check back later for new alerts.</p>
              </div>
            </Dropdown.Menu>
          </Dropdown>

          {/* Vertical Divider */}
          <div className="vr d-none d-sm-block mx-1" style={{ opacity: 0.15, height: '24px', alignSelf: 'center', backgroundColor: 'var(--text-heading)' }}></div>

          {/* User Dropdown */}
          <Dropdown align="end">
            <Dropdown.Toggle 
              variant="link" 
              className="d-flex align-items-center gap-2 text-decoration-none text-reset p-0 border-0 shadow-none user-dropdown-toggle" 
              id="user-dropdown"
            >
              <div 
                className="user-avatar rounded-circle d-flex align-items-center justify-content-center" 
                style={{ 
                  width: '36px', 
                  height: '36px', 
                  background: 'var(--primary-500)',
                  color: '#fff',
                  fontWeight: '600', 
                  fontSize: '0.9rem',
                  boxShadow: '0 2px 4px rgba(99, 102, 241, 0.3)'
                }}
              >
                {user?.email?.[0].toUpperCase()}
              </div>
              <div className="d-none d-md-flex flex-column align-items-start ms-1" style={{ lineHeight: '1.2' }}>
                <span className="fw-semibold" style={{ fontSize: '0.85rem', color: 'var(--text-heading)' }}>
                  {user?.email.split('@')[0]}
                </span>
                <span className="text-muted" style={{ fontSize: '0.7rem' }}>Admin</span>
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu 
              className="shadow-lg border mt-2" 
              style={{ 
                minWidth: '220px', 
                backgroundColor: 'var(--surface-secondary)',
                borderColor: 'var(--border-color)',
                borderRadius: '12px'
              }}
            >
              <div className="px-3 py-2 mb-1 border-bottom" style={{ borderColor: 'var(--border-color) !important' }}>
                <p className="mb-0 fw-bold" style={{ color: 'var(--text-heading)', fontSize: '0.95rem' }}>{user?.email}</p>
                <small className="text-muted" style={{ fontSize: '0.8rem' }}>Workspace Owner</small>
              </div>
              <Dropdown.Item href="#profile" className="d-flex align-items-center gap-2 py-2" style={{ color: 'var(--text-primary)' }}>
                <HiOutlineUser size={18} /> My Profile
              </Dropdown.Item>
              <Dropdown.Item href="#settings" className="d-flex align-items-center gap-2 py-2" style={{ color: 'var(--text-primary)' }}>
                <HiOutlineCog size={18} /> Workspace Settings
              </Dropdown.Item>
              <Dropdown.Divider style={{ borderColor: 'var(--border-color)' }} />
              <Dropdown.Item onClick={handleLogout} className="text-danger d-flex align-items-center gap-2 py-2 fw-medium">
                <HiOutlineLogout size={18} /> Sign Out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

        </div>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;
