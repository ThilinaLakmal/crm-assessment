/**
 * ============================================
 * Login Page
 * ============================================
 * A modern, glassmorphism-styled login form using
 * React-Bootstrap components. Handles form submission,
 * validation, and error display.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineSparkles } from 'react-icons/hi';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    const result = await login(email, password);

    if (result.success) {
      navigate('/', { replace: true });
    } else {
      setError(result.message);
      setSubmitting(false);
    }
  };

  // Animation variants
  const leftPanelVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { staggerChildren: 0.2, delayChildren: 0.1, type: 'spring', stiffness: 100 }
    }
  };

  const rightPanelVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 100, delay: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  const logoVariants = {
    hidden: { scale: 0.5, opacity: 0, rotate: -20 },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: { type: 'spring', stiffness: 200, damping: 20 }
    }
  };

  return (
    <div className="login-page">
      <motion.div 
        className="login-glass-container"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      >
        {/* ---- Left Side: Branding & Animation ---- */}
        <div className="login-left-panel">
          <motion.div
            variants={leftPanelVariants}
            initial="hidden"
            animate="visible"
            className="position-relative z-1 w-100"
          >
            <motion.div variants={logoVariants} className="login-logo-wrapper mb-4">
              <div className="brand-icon-large" style={{ width: '96px', height: '96px', borderRadius: '28px', boxShadow: '0 0 40px rgba(99, 102, 241, 0.4)' }}>
                <HiOutlineSparkles size={48} />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <h1 className="brand-text-main text-white mb-2" style={{ fontSize: '3rem', letterSpacing: '-0.04em' }}>CRM Manager</h1>
              <div className="brand-text-sub" style={{ fontSize: '1rem', color: '#a5b4fc', letterSpacing: '0.1em' }}>PRO EDITION</div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="mt-4" style={{ maxWidth: '400px' }}>
              <p className="text-white" style={{ fontSize: '1.15rem', opacity: 0.85, lineHeight: 1.6 }}>
                Supercharge your sales pipeline. Track leads, manage contacts, and close deals faster than ever with our intelligent platform.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* ---- Right Side: Login Form ---- */}
        <div className="login-right-panel">
          <motion.div
            variants={rightPanelVariants}
            initial="hidden"
            animate="visible"
            style={{ width: '100%', maxWidth: '400px' }}
          >
            <div className="mb-4 d-lg-none text-center">
               <div className="brand-icon-large mx-auto mb-3" style={{ width: '64px', height: '64px', borderRadius: '20px' }}>
                <HiOutlineSparkles size={32} />
              </div>
              <h2 className="brand-text-main text-white" style={{ fontSize: '1.8rem' }}>Welcome Back</h2>
            </div>

            <div className="d-none d-lg-block mb-4">
               <h2 className="brand-text-main mb-1 text-white" style={{ fontSize: '2.2rem' }}>Welcome Back</h2>
               <p style={{ color: 'rgba(255,255,255,0.7)' }}>Please sign in to your account.</p>
            </div>

            <Card className="login-glass-card w-100" style={{ boxShadow: 'none' }}>
              <Card.Body className="p-4 p-md-4">

                {/* Error Alert */}
                {error && (
                  <Alert
                    variant="danger"
                    dismissible
                    onClose={() => setError('')}
                    className="mb-4"
                  >
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <Form.Group className="mb-4" controlId="loginEmail">
                    <Form.Label className="login-glass-label">
                      <HiOutlineMail className="me-2" size={18} />
                      Email Address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="login-glass-input"
                      autoComplete="email"
                      disabled={submitting}
                      autoFocus
                    />
                  </Form.Group>

                  {/* Password Field */}
                  <Form.Group className="mb-5" controlId="loginPassword">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Form.Label className="login-glass-label mb-0">
                        <HiOutlineLockClosed className="me-2" size={18} />
                        Password
                      </Form.Label>
                      <a href="#forgot" className="text-decoration-none" style={{ fontSize: '0.8rem', color: '#a5b4fc' }}>
                        Forgot password?
                      </a>
                    </div>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="login-glass-input"
                      autoComplete="current-password"
                      disabled={submitting}
                    />
                  </Form.Group>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="btn-login w-100 py-3"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          className="me-2"
                        />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </Form>

                {/* Test credentials hint */}
                <div className="text-center mt-4 pt-3 border-top" style={{ borderColor: 'rgba(255,255,255,0.1) !important' }}>
                  <small className="d-block mb-1 text-white opacity-75">
                    Don't have an account? <a href="#signup" className="text-decoration-none" style={{ color: '#a5b4fc' }}>Sign up</a>
                  </small>
                  <small className="text-white opacity-50">
                    Test: admin@example.com / password123
                  </small>
                </div>

              </Card.Body>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
