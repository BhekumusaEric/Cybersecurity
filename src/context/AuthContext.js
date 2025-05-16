/**
 * Auth Context
 *
 * This context provides authentication functionality for the app.
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [biometricsAvailable, setBiometricsAvailable] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if user is logged in
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      // In a real app, you would make an API call to authenticate the user
      // For now, we'll simulate a successful login

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check credentials (in a real app, this would be done on the server)
      if (email === 'user@example.com' && password === 'password') {
        const userData = {
          id: '1',
          name: 'John Doe',
          email: 'user@example.com',
          // Add other user data as needed
        };

        // Save user data
        await AsyncStorage.setItem('user', JSON.stringify(userData));

        // Update state
        setUser(userData);
        return true;
      } else {
        setError('Invalid email or password');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);

      // In a real app, you would make an API call to register the user
      // For now, we'll simulate a successful registration

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create user (in a real app, this would be done on the server)
      const userData = {
        id: '1',
        name,
        email,
        // Add other user data as needed
      };

      // Save user data
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      // Update state
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setError('An error occurred during registration');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setLoading(true);

      // In a real app, you would make an API call to invalidate the session

      // Clear user data
      await AsyncStorage.removeItem('user');

      // Update state
      setUser(null);
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);

      // In a real app, you would make an API call to send a password reset email
      // For now, we'll simulate a successful password reset request

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if email exists (in a real app, this would be done on the server)
      if (email === 'user@example.com') {
        return true;
      } else {
        setError('Email not found');
        return false;
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError('An error occurred while sending the reset email');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Login with biometrics
  const loginWithBiometrics = async () => {
    try {
      setLoading(true);
      setError(null);

      // In a real app, you would use a biometric authentication library
      // For now, we'll simulate a successful biometric login

      // Simulate biometric authentication delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Get stored credentials (in a real app, these would be securely stored)
      const userData = {
        id: '1',
        name: 'John Doe',
        email: 'user@example.com',
        // Add other user data as needed
      };

      // Save user data
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      // Update state
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Biometric login error:', error);
      setError('Biometric authentication failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Enable biometric login
  const enableBiometricLogin = async (email, password) => {
    try {
      // In a real app, you would verify credentials and store them securely
      // For now, we'll simulate enabling biometric login

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return true;
    } catch (error) {
      console.error('Enable biometric login error:', error);
      throw error;
    }
  };

  // Disable biometric login
  const disableBiometricLogin = async () => {
    try {
      // In a real app, you would remove stored credentials
      // For now, we'll simulate disabling biometric login

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return true;
    } catch (error) {
      console.error('Disable biometric login error:', error);
      throw error;
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      // In a real app, you would make an API call to update the user profile
      // For now, we'll simulate a successful profile update

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update user data
      const updatedUser = { ...user, ...userData };

      // Save updated user data
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

      // Update state
      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      setError('An error occurred while updating your profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      setError(null);

      // In a real app, you would make an API call to change the password
      // For now, we'll simulate a successful password change

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check current password (in a real app, this would be done on the server)
      if (currentPassword === 'password') {
        return true;
      } else {
        setError('Current password is incorrect');
        return false;
      }
    } catch (error) {
      console.error('Change password error:', error);
      setError('An error occurred while changing your password');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Create a safe context value
  const contextValue = {
    user: user || null,
    loading: loading || false,
    error: error || null,
    biometricsAvailable: biometricsAvailable || false,
    login: login || (() => Promise.resolve(false)),
    register: register || (() => Promise.resolve(false)),
    logout: logout || (() => Promise.resolve(false)),
    resetPassword: resetPassword || (() => Promise.resolve(false)),
    loginWithBiometrics: loginWithBiometrics || (() => Promise.resolve(false)),
    enableBiometricLogin: enableBiometricLogin || (() => Promise.resolve(false)),
    disableBiometricLogin: disableBiometricLogin || (() => Promise.resolve(false)),
    updateProfile: updateProfile || (() => Promise.resolve(false)),
    changePassword: changePassword || (() => Promise.resolve(false)),
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
