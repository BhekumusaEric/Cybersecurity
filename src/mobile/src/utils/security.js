/**
 * Security utilities for the Ethical Hacking LMS mobile app
 * 
 * This file provides security-related functionality including:
 * - Jailbreak/root detection
 * - Secure storage
 * - Certificate pinning helpers
 * - Tamper detection
 */

import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import JailMonkey from 'react-native-jailmonkey';
import EncryptedStorage from 'react-native-encrypted-storage';
import * as Keychain from 'react-native-keychain';
import analytics from './analytics';
import { API_URL } from '../config/api';
import apiClient from '../services/api/apiClient';

/**
 * Check if the device is jailbroken/rooted
 * @returns {Promise<Object>} Object containing security check results
 */
export const checkDeviceSecurity = async () => {
  try {
    const isJailBroken = await JailMonkey.isJailBroken();
    const canMockLocation = await JailMonkey.canMockLocation();
    const isOnExternalStorage = await JailMonkey.isOnExternalStorage();
    const hasHookingLibraries = await JailMonkey.hookDetected();
    
    const securityCheckResults = {
      isJailBroken,
      canMockLocation,
      isOnExternalStorage,
      hasHookingLibraries,
      isEmulator: await DeviceInfo.isEmulator(),
      isSecure: !(isJailBroken || hasHookingLibraries),
    };
    
    // Log security check results
    analytics.trackEvent('security_check', securityCheckResults);
    
    // Report to backend for risk assessment
    try {
      await apiClient.post('/api/security/device-check', {
        deviceId: await DeviceInfo.getUniqueId(),
        securityCheckResults,
      });
    } catch (error) {
      // Silently fail - don't block the app if this fails
      console.warn('Failed to report security check results:', error);
    }
    
    return securityCheckResults;
  } catch (error) {
    console.error('Error checking device security:', error);
    analytics.logError(error, 'Security Check');
    
    // Default to secure if checks fail
    return {
      isJailBroken: false,
      canMockLocation: false,
      isOnExternalStorage: false,
      hasHookingLibraries: false,
      isEmulator: false,
      isSecure: true,
      checkFailed: true,
    };
  }
};

/**
 * Secure storage for sensitive data
 */
export const secureStorage = {
  /**
   * Save data to secure storage
   * @param {string} key - Storage key
   * @param {any} value - Value to store (will be JSON stringified)
   * @returns {Promise<void>}
   */
  setItem: async (key, value) => {
    try {
      await EncryptedStorage.setItem(
        key,
        typeof value === 'string' ? value : JSON.stringify(value)
      );
    } catch (error) {
      console.error(`Error storing ${key} in secure storage:`, error);
      analytics.logError(error, 'Secure Storage - Set');
      throw error;
    }
  },
  
  /**
   * Get data from secure storage
   * @param {string} key - Storage key
   * @param {boolean} parseJson - Whether to parse the result as JSON
   * @returns {Promise<any>} Retrieved value
   */
  getItem: async (key, parseJson = true) => {
    try {
      const value = await EncryptedStorage.getItem(key);
      
      if (value === null) {
        return null;
      }
      
      return parseJson ? JSON.parse(value) : value;
    } catch (error) {
      console.error(`Error retrieving ${key} from secure storage:`, error);
      analytics.logError(error, 'Secure Storage - Get');
      return null;
    }
  },
  
  /**
   * Remove data from secure storage
   * @param {string} key - Storage key
   * @returns {Promise<void>}
   */
  removeItem: async (key) => {
    try {
      await EncryptedStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from secure storage:`, error);
      analytics.logError(error, 'Secure Storage - Remove');
      throw error;
    }
  },
  
  /**
   * Clear all data from secure storage
   * @returns {Promise<void>}
   */
  clear: async () => {
    try {
      await EncryptedStorage.clear();
    } catch (error) {
      console.error('Error clearing secure storage:', error);
      analytics.logError(error, 'Secure Storage - Clear');
      throw error;
    }
  }
};

/**
 * Keychain access for storing credentials
 */
export const keychain = {
  /**
   * Save credentials to keychain
   * @param {string} username - Username
   * @param {string} password - Password
   * @param {string} service - Service name
   * @returns {Promise<boolean>} Success status
   */
  saveCredentials: async (username, password, service = 'com.ethicalhackinglms.app') => {
    try {
      await Keychain.setGenericPassword(username, password, { service });
      return true;
    } catch (error) {
      console.error('Error saving credentials to keychain:', error);
      analytics.logError(error, 'Keychain - Save');
      return false;
    }
  },
  
  /**
   * Get credentials from keychain
   * @param {string} service - Service name
   * @returns {Promise<Object|null>} Credentials object or null
   */
  getCredentials: async (service = 'com.ethicalhackinglms.app') => {
    try {
      const credentials = await Keychain.getGenericPassword({ service });
      return credentials;
    } catch (error) {
      console.error('Error getting credentials from keychain:', error);
      analytics.logError(error, 'Keychain - Get');
      return null;
    }
  },
  
  /**
   * Reset credentials in keychain
   * @param {string} service - Service name
   * @returns {Promise<boolean>} Success status
   */
  resetCredentials: async (service = 'com.ethicalhackinglms.app') => {
    try {
      await Keychain.resetGenericPassword({ service });
      return true;
    } catch (error) {
      console.error('Error resetting credentials in keychain:', error);
      analytics.logError(error, 'Keychain - Reset');
      return false;
    }
  }
};

/**
 * Biometric authentication utilities
 */
export const biometricAuth = {
  /**
   * Check if biometric authentication is available
   * @returns {Promise<Object>} Availability status and type
   */
  isAvailable: async () => {
    try {
      const biometryType = await Keychain.getSupportedBiometryType();
      
      return {
        available: !!biometryType,
        type: biometryType, // FINGERPRINT, FACE, IRIS or null
      };
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      analytics.logError(error, 'Biometric - Check');
      
      return {
        available: false,
        type: null,
      };
    }
  },
  
  /**
   * Authenticate using biometrics
   * @param {string} reason - Reason for authentication
   * @returns {Promise<boolean>} Success status
   */
  authenticate: async (reason = 'Authenticate to continue') => {
    try {
      const result = await Keychain.authenticate(
        reason,
        { accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY }
      );
      
      return !!result;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      
      // Don't log cancellation as an error
      if (error.message !== 'User canceled the operation') {
        analytics.logError(error, 'Biometric - Authenticate');
      }
      
      return false;
    }
  }
};

export default {
  checkDeviceSecurity,
  secureStorage,
  keychain,
  biometricAuth
};
