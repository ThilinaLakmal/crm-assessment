/**
 * ============================================
 * Application Entry Point
 * ============================================
 * Wraps the app with all required providers:
 *  - BrowserRouter for client-side routing
 *  - AuthProvider for global auth state
 *  - Bootstrap CSS for UI components
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Bootstrap CSS (must come before custom styles)
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
