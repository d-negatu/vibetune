import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated (e.g., from localStorage or session)
    const checkAuthStatus = () => {
      const savedAuth = localStorage.getItem('spotify_auth');
      if (savedAuth) {
        try {
          const authData = JSON.parse(savedAuth);
          setIsAuthenticated(true);
          setUser(authData.user);
        } catch (error) {
          console.error('Error parsing saved auth data:', error);
          localStorage.removeItem('spotify_auth');
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('spotify_auth', JSON.stringify({ user: userData }));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('spotify_auth');
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
