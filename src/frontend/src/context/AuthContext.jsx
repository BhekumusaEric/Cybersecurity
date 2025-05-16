import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/api/auth/verify');

        if (response.data.success) {
          setUser(response.data.user);
          setIsAuthenticated(true);
        } else {
          // Clear invalid token
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Auth verification error:', error);
        // Clear invalid token
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Register a new user
  const register = async (userData) => {
    try {
      setError(null);
      console.log('Registering user with data:', userData);

      const response = await api.post('/api/auth/register', userData);

      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);

        // Update state
        setUser(response.data.user);
        setIsAuthenticated(true);

        return {
          success: true,
          message: 'Registration successful',
          user: response.data.user
        };
      } else {
        setError(response.data.message || 'Registration failed');
        return {
          success: false,
          error: response.data.message
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setError(null);

      const response = await api.post('/api/auth/login', { email, password });

      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);

        // Update state
        setUser(response.data.user);
        setIsAuthenticated(true);

        return { success: true, user: response.data.user };
      } else {
        setError(response.data.message || 'Login failed');
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      // Call the logout API endpoint
      await api.get('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear token from localStorage
      localStorage.removeItem('token');

      // Reset state
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const response = await api.put(`/api/users/profile`, profileData);

      if (response.data.success) {
        setUser({
          ...user,
          ...response.data.user
        });
        return { success: true, user: response.data.user };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      return { success: false, error: errorMessage };
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      setError(null);

      const response = await api.post('/api/auth/forgot-password', { email });

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message || 'Password reset email sent'
        };
      } else {
        setError(response.data.message || 'Password reset request failed');
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password reset request failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Reset password
  const resetPassword = async (token, password) => {
    try {
      setError(null);

      const response = await api.post('/api/auth/reset-password', { token, password });

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message || 'Password reset successful'
        };
      } else {
        setError(response.data.message || 'Password reset failed');
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password reset failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    forgotPassword,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
