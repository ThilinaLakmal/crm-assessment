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

import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import PageTransition from './components/PageTransition';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import LeadDetails from './pages/LeadDetails';
import Settings from './pages/Settings';



function App() {
  return (
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />

        {/* Protected Routes — require authentication */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/leads/:id" element={<LeadDetails />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Catch-all — redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
}

export default App;
