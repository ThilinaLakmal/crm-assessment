import { useState } from 'react';
import { Container, Row, Col, Tab, Nav, Form, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  HiOutlineUser, 
  HiOutlineAdjustments, 
  HiOutlineBell, 
  HiOutlinePuzzle,
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineMail,
  HiOutlineCalendar,
  HiOutlineChat
} from 'react-icons/hi';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Settings = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user } = useAuth();
  
  // Dummy state for UI feedback
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Admin User',
    email: user?.email || 'admin@example.com',
    company: 'Acme Corp'
  });
  const [notifs, setNotifs] = useState({
    newLeads: true,
    taskReminders: true,
    weeklyReports: false
  });

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 800);
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
      className="p-4 p-md-5"
    >
      <div className="page-header mb-4">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account and preferences.</p>
      </div>

      <Tab.Container id="settings-tabs" defaultActiveKey="account">
        <Row>
          {/* Navigation Sidebar */}
          <Col md={3} className="mb-4 mb-md-0">
            <Nav className="flex-column settings-nav" style={{ borderBottom: 'none' }}>
              <Nav.Item>
                <Nav.Link eventKey="account" className="d-flex align-items-center gap-2">
                  <HiOutlineUser size={18} /> Account Details
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="preferences" className="d-flex align-items-center gap-2">
                  <HiOutlineAdjustments size={18} /> Preferences
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="notifications" className="d-flex align-items-center gap-2">
                  <HiOutlineBell size={18} /> Notifications
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="integrations" className="d-flex align-items-center gap-2">
                  <HiOutlinePuzzle size={18} /> Integrations
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>

          {/* Tab Content */}
          <Col md={9}>
            <Tab.Content>
              
              {/* --- Account Details Tab --- */}
              <Tab.Pane eventKey="account">
                <div className="settings-card">
                  <h4 className="settings-section-title">Personal Information</h4>
                  <Form onSubmit={handleSave}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label className="form-label-custom">Full Name</Form.Label>
                          <Form.Control 
                            type="text" 
                            className="form-input-custom" 
                            value={profileData.name}
                            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label className="form-label-custom">Email Address</Form.Label>
                          <Form.Control 
                            type="email" 
                            className="form-input-custom" 
                            value={profileData.email}
                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Form.Group className="mb-4">
                          <Form.Label className="form-label-custom">Company</Form.Label>
                          <Form.Control 
                            type="text" 
                            className="form-input-custom" 
                            value={profileData.company}
                            onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <h4 className="settings-section-title mt-4 border-top pt-4" style={{ borderColor: 'var(--border-color)' }}>Password</h4>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label className="form-label-custom">Current Password</Form.Label>
                          <Form.Control type="password" placeholder="••••••••" className="form-input-custom" />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label className="form-label-custom">New Password</Form.Label>
                          <Form.Control type="password" placeholder="••••••••" className="form-input-custom" />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <div className="d-flex justify-content-end mt-2">
                      <Button type="submit" variant="primary" className="btn-action px-4" style={{ background: 'var(--primary-500)', border: 'none' }} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </Form>
                </div>
              </Tab.Pane>

              {/* --- Preferences Tab --- */}
              <Tab.Pane eventKey="preferences">
                <div className="settings-card">
                  <h4 className="settings-section-title">Appearance</h4>
                  <div className="d-flex align-items-center justify-content-between mb-5 p-3 rounded" style={{ background: 'var(--surface-glass)', border: '1px solid var(--border-color)' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-heading)' }}>Theme Mode</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--gray-400)' }}>Toggle between light and dark themes.</div>
                    </div>
                    <Button 
                      variant="outline-secondary" 
                      onClick={toggleTheme}
                      className="d-flex align-items-center gap-2 btn-action"
                    >
                      {isDarkMode ? <HiOutlineSun size={18} /> : <HiOutlineMoon size={18} />}
                      {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </Button>
                  </div>

                  <h4 className="settings-section-title border-top pt-4" style={{ borderColor: 'var(--border-color)' }}>Localization</h4>
                  <Form onSubmit={handleSave}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label className="form-label-custom">Language</Form.Label>
                          <Form.Select className="form-input-custom">
                            <option>English (US)</option>
                            <option>Spanish</option>
                            <option>French</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label className="form-label-custom">Timezone</Form.Label>
                          <Form.Select className="form-input-custom">
                            <option>UTC-08:00 (Pacific Time)</option>
                            <option>UTC-05:00 (Eastern Time)</option>
                            <option>UTC+00:00 (GMT)</option>
                            <option>UTC+05:30 (India Standard Time)</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label className="form-label-custom">Date Format</Form.Label>
                          <Form.Select className="form-input-custom">
                            <option>MM/DD/YYYY</option>
                            <option>DD/MM/YYYY</option>
                            <option>YYYY-MM-DD</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="d-flex justify-content-end mt-2">
                      <Button type="submit" variant="primary" className="btn-action px-4" style={{ background: 'var(--primary-500)', border: 'none' }} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Preferences'}
                      </Button>
                    </div>
                  </Form>
                </div>
              </Tab.Pane>

              {/* --- Notifications Tab --- */}
              <Tab.Pane eventKey="notifications">
                <div className="settings-card">
                  <h4 className="settings-section-title">Email Notifications</h4>
                  
                  <div className="mb-4 pb-3 border-bottom" style={{ borderColor: 'var(--border-color) !important' }}>
                    <Form.Check 
                      type="switch"
                      id="notif-leads"
                      label={
                        <div>
                          <div style={{ fontWeight: 500, color: 'var(--text-heading)' }}>New Lead Alerts</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--gray-400)' }}>Receive an email when a new lead is assigned to you.</div>
                        </div>
                      }
                      checked={notifs.newLeads}
                      onChange={(e) => setNotifs({...notifs, newLeads: e.target.checked})}
                      className="d-flex align-items-center gap-3"
                    />
                  </div>

                  <div className="mb-4 pb-3 border-bottom" style={{ borderColor: 'var(--border-color) !important' }}>
                    <Form.Check 
                      type="switch"
                      id="notif-tasks"
                      label={
                        <div>
                          <div style={{ fontWeight: 500, color: 'var(--text-heading)' }}>Task Reminders</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--gray-400)' }}>Daily digest of upcoming calls and tasks.</div>
                        </div>
                      }
                      checked={notifs.taskReminders}
                      onChange={(e) => setNotifs({...notifs, taskReminders: e.target.checked})}
                      className="d-flex align-items-center gap-3"
                    />
                  </div>

                  <div className="mb-4">
                    <Form.Check 
                      type="switch"
                      id="notif-reports"
                      label={
                        <div>
                          <div style={{ fontWeight: 500, color: 'var(--text-heading)' }}>Weekly Summary Report</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--gray-400)' }}>A weekly breakdown of your pipeline performance.</div>
                        </div>
                      }
                      checked={notifs.weeklyReports}
                      onChange={(e) => setNotifs({...notifs, weeklyReports: e.target.checked})}
                      className="d-flex align-items-center gap-3"
                    />
                  </div>

                </div>
              </Tab.Pane>

              {/* --- Integrations Tab --- */}
              <Tab.Pane eventKey="integrations">
                <div className="settings-card">
                  <h4 className="settings-section-title mb-4">Connected Apps</h4>
                  <Row>
                    <Col xl={6} className="mb-4">
                      <div className="integration-card">
                        <div className="integration-icon" style={{ color: '#E4405F' }}>
                          <HiOutlineMail />
                        </div>
                        <div className="integration-content">
                          <div className="integration-title">Gmail Sync</div>
                          <div className="integration-desc">Automatically log incoming emails to contact records.</div>
                          <Button variant="outline-danger" size="sm" className="btn-action">Disconnect</Button>
                        </div>
                      </div>
                    </Col>
                    <Col xl={6} className="mb-4">
                      <div className="integration-card">
                        <div className="integration-icon" style={{ color: '#4285F4' }}>
                          <HiOutlineCalendar />
                        </div>
                        <div className="integration-content">
                          <div className="integration-title">Google Calendar</div>
                          <div className="integration-desc">Sync meetings and calls with your CRM calendar.</div>
                          <Button variant="outline-primary" size="sm" className="btn-action">Connect</Button>
                        </div>
                      </div>
                    </Col>
                    <Col xl={6} className="mb-4">
                      <div className="integration-card">
                        <div className="integration-icon" style={{ color: '#4A154B' }}>
                          <HiOutlineChat />
                        </div>
                        <div className="integration-content">
                          <div className="integration-title">Slack Notifications</div>
                          <div className="integration-desc">Push alerts for deal stages to a Slack channel.</div>
                          <Button variant="outline-primary" size="sm" className="btn-action">Connect</Button>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Tab.Pane>

            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </motion.div>
  );
};

export default Settings;
