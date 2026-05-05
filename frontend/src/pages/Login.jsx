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
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';

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

    // ---- Client-side validation ----
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

  return (
    <div className="login-page">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col xs={11} sm={8} md={6} lg={5} xl={4}>

            {/* ---- Branding ---- */}
            <div className="text-center mb-4">
              <div className="login-logo mb-3">
                <span className="logo-icon">📊</span>
              </div>
              <h1 className="login-title">CRM Lead Manager</h1>
              <p className="login-subtitle">Sign in to manage your leads</p>
            </div>

            {/* ---- Login Card ---- */}
            <Card className="login-card">
              <Card.Body className="p-4">

                {/* Error Alert */}
                {error && (
                  <Alert
                    variant="danger"
                    dismissible
                    onClose={() => setError('')}
                    className="mb-3"
                  >
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <Form.Group className="mb-3" controlId="loginEmail">
                    <Form.Label className="form-label-custom">
                      <HiOutlineMail className="me-2" />
                      Email Address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input-custom"
                      autoComplete="email"
                      disabled={submitting}
                      autoFocus
                    />
                  </Form.Group>

                  {/* Password Field */}
                  <Form.Group className="mb-4" controlId="loginPassword">
                    <Form.Label className="form-label-custom">
                      <HiOutlineLockClosed className="me-2" />
                      Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-input-custom"
                      autoComplete="current-password"
                      disabled={submitting}
                    />
                  </Form.Group>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="btn-login w-100"
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
                <div className="text-center mt-3">
                  <small className="text-muted-custom">
                    Test: admin@example.com / password123
                  </small>
                </div>

              </Card.Body>
            </Card>

          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
