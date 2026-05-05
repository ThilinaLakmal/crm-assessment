/**
 * ============================================
 * Authentication Context
 * ============================================
 * Provides global auth state (user, token) and actions
 * (login, logout) to the entire component tree.
 *
 * On mount, it checks localStorage for an existing session
 * so the user stays logged in across page refreshes.
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

/**
 * Custom hook — shorthand for consuming the auth context.
 * Throws if used outside <AuthProvider>.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while checking localStorage

  // ---- Restore session from localStorage on mount ----
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('crm_user');
      const storedToken = localStorage.getItem('crm_token');

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      // Corrupted data — clean up
      localStorage.removeItem('crm_user');
      localStorage.removeItem('crm_token');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Login — calls the backend, persists the session.
   * @param {string} email
   * @param {string} password
   * @returns {{ success: boolean, message?: string }}
   */
  const login = useCallback(async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;

      // Persist to localStorage
      localStorage.setItem('crm_token', token);
      localStorage.setItem('crm_user', JSON.stringify(userData));

      setUser(userData);
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, message };
    }
  }, []);

  /**
   * Logout — clears all session data.
   */
  const logout = useCallback(() => {
    localStorage.removeItem('crm_token');
    localStorage.removeItem('crm_user');
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
