import apiClient from './apiClient';
import { ENDPOINTS } from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - Promise with user data and tokens
 */
export const login = async (email, password) => {
  try {
    const response = await apiClient.post(ENDPOINTS.LOGIN, { email, password });
    
    // Save tokens to storage
    await AsyncStorage.setItem('token', response.data.token);
    if (response.data.refreshToken) {
      await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Register user
 * @param {string} name - User name
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - Promise with user data
 */
export const register = async (name, email, password) => {
  try {
    const response = await apiClient.post(ENDPOINTS.REGISTER, { name, email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Logout user
 * @returns {Promise} - Promise with logout status
 */
export const logout = async () => {
  try {
    // Call logout endpoint if available
    try {
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      // Ignore errors from logout endpoint
      console.log('Logout endpoint error:', error);
    }
    
    // Remove tokens from storage
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('refreshToken');
    
    return { success: true };
  } catch (error) {
    throw error;
  }
};

/**
 * Get current user profile
 * @returns {Promise} - Promise with user data
 */
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get(ENDPOINTS.USER_PROFILE);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update user profile
 * @param {Object} userData - User data to update
 * @returns {Promise} - Promise with updated user data
 */
export const updateProfile = async (userData) => {
  try {
    const response = await apiClient.put(ENDPOINTS.UPDATE_PROFILE, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise} - Promise with reset status
 */
export const forgotPassword = async (email) => {
  try {
    const response = await apiClient.post(ENDPOINTS.FORGOT_PASSWORD, { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Reset password
 * @param {string} token - Reset token
 * @param {string} password - New password
 * @returns {Promise} - Promise with reset status
 */
export const resetPassword = async (token, password) => {
  try {
    const response = await apiClient.post(ENDPOINTS.RESET_PASSWORD, { token, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Change password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise} - Promise with change status
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await apiClient.post('/api/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>} - Promise with authentication status
 */
export const isAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  } catch (error) {
    return false;
  }
};
