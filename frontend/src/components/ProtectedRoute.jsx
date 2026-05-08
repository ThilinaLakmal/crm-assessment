/**
 * ============================================
 * Protected Route Component
 * ============================================
 * Wraps private routes to enforce authentication.
 * - Shows a loading spinner while the auth state is initializing
 * - Redirects unauthenticated users to /login
 * - Renders the child route if authenticated
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Spinner, Container } from 'react-bootstrap';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // Still checking localStorage — show spinner to prevent flash
  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '100vh' }}
      >
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  // Not authenticated — redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated — render child routes
  return <Outlet />;
};

export default ProtectedRoute;
