/**
 * ============================================
 * App Component — Root Router
 * ============================================
 * Defines all application routes:
 *  - /login (public)
 *  - / (Dashboard, protected)
 *  - /leads (Leads list, protected)
 *  - /leads/:id (Lead details + notes, protected)
 */

import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import LeadDetails from './pages/LeadDetails';

/**
 * Layout wrapper — renders Navbar + child routes via Outlet.
 * Keeps the Navbar out of the login page.
 */
const AppLayout = () => (
  <>
    <Navbar />
    <main className="app-main">
      <Outlet />
    </main>
  </>
);

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes — require authentication */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/leads/:id" element={<LeadDetails />} />
        </Route>
      </Route>

      {/* Catch-all — redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
