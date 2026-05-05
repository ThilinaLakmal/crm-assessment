/**
 * ============================================
 * Theme Context
 * ============================================
 * Manages dark/light mode across the entire app.
 * Persists the user's preference in localStorage
 * and applies the data-theme attribute on <html>.
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

/**
 * Custom hook — shorthand for consuming the theme context.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Initialize from localStorage, default to dark (original theme)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('crm_theme');
    return saved ? saved === 'dark' : true; // default dark
  });

  // Apply theme to <html> element whenever it changes
  useEffect(() => {
    const theme = isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('crm_theme', theme);
  }, [isDarkMode]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  const value = {
    isDarkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
