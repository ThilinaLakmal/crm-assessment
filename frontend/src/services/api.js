/**
 * ============================================
 * Axios API Instance
 * ============================================
 * Pre-configured Axios instance that:
 *  - Points to the backend base URL
 *  - Automatically attaches the JWT token from localStorage
 *  - Provides consistent error handling
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Attaches the JWT token to every outgoing request if available.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('crm_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 * Handles 401/403 globally — if the token is expired or invalid,
 * clear storage and redirect to the login page.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('crm_token');
      localStorage.removeItem('crm_user');

      // Only redirect if not already on the login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
