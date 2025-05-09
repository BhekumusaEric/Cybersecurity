import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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
        const response = await axios.get('/auth/verify');

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

      // In a real app, this would be an API call
      // For now, we'll simulate with a mock response

      // Check if email is already in use (mock check)
      if (userData.email === 'admin@example.com' ||
          userData.email === 'instructor@example.com' ||
          userData.email === 'student@example.com') {
        console.log('Registration failed: Email already in use');
        return { success: false, error: 'Email is already in use' };
      }

      // Generate a mock UUID for the new user
      const mockUserId = 'user_' + Date.now();

      // Create a mock user object
      const newUser = {
        id: mockUserId,
        name: userData.name,
        email: userData.email,
        role: 'student' // Default role for new users
      };

      console.log('New user registered:', newUser);

      // Simulate login after successful registration
      setUser(newUser);
      setIsAuthenticated(true);

      // Mock successful registration
      return {
        success: true,
        message: 'Registration successful',
        user: newUser
      };
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Registration failed');
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setError(null);

      // In a real app, this would be an API call
      // For now, we'll simulate with a mock response

      // Mock credentials check
      if (
        (email === 'admin@example.com' && password === 'admin123') ||
        (email === 'instructor@example.com' && password === 'instructor123') ||
        (email === 'student@example.com' && password === 'student123')
      ) {
        // Mock user data based on email
        let mockUser;

        if (email === 'admin@example.com') {
          mockUser = {
            id: '1',
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'admin'
          };
        } else if (email === 'instructor@example.com') {
          mockUser = {
            id: '2',
            name: 'Instructor User',
            email: 'instructor@example.com',
            role: 'instructor'
          };
        } else {
          mockUser = {
            id: '3',
            name: 'Student User',
            email: 'student@example.com',
            role: 'student'
          };
        }

        // Mock token
        const token = 'mock_jwt_token_' + Date.now();

        // Store token in localStorage
        localStorage.setItem('token', token);

        // Update state
        setUser(mockUser);
        setIsAuthenticated(true);

        return { success: true, user: mockUser };
      } else {
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  // Logout user
  const logout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');

    // Reset state
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user profile
  const updateProfile = (profileData) => {
    // In a real app, this would be an API call
    // For now, we'll just update the local state
    setUser({
      ...user,
      ...profileData
    });

    return { success: true };
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      setError(null);

      // In a real app, this would be an API call
      // For now, we'll simulate with a mock response

      return {
        success: true,
        message: 'Password reset email sent'
      };
    } catch (error) {
      setError(error.response?.data?.message || 'Password reset request failed');
      return { success: false, error: error.response?.data?.message || 'Password reset request failed' };
    }
  };

  // Reset password
  const resetPassword = async (token, password) => {
    try {
      setError(null);

      // In a real app, this would be an API call
      // For now, we'll simulate with a mock response

      return {
        success: true,
        message: 'Password reset successful'
      };
    } catch (error) {
      setError(error.response?.data?.message || 'Password reset failed');
      return { success: false, error: error.response?.data?.message || 'Password reset failed' };
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
