import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';
import jwtDecode from 'jwt-decode';
import DeviceInfo from 'react-native-device-info';

import apiClient from '../services/api/apiClient';
import security from '../utils/security';
import analytics from '../utils/analytics';
import { ENDPOINTS } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState(null);
  const [deviceSecure, setDeviceSecure] = useState(true);

  // Check device security and biometrics
  useEffect(() => {
    const checkDeviceSecurity = async () => {
      try {
        // Check if device is secure (not jailbroken/rooted)
        const securityCheck = await security.checkDeviceSecurity();
        setDeviceSecure(securityCheck.isSecure);

        // Log security status
        analytics.trackEvent('auth_security_check', {
          isSecure: securityCheck.isSecure,
          isJailBroken: securityCheck.isJailBroken,
          isEmulator: securityCheck.isEmulator,
        });

        // Check biometrics availability
        const biometricStatus = await security.biometricAuth.isAvailable();
        setBiometricsAvailable(biometricStatus.available);
        setBiometricType(biometricStatus.type);

        // Log biometric availability
        analytics.trackEvent('auth_biometrics_check', {
          available: biometricStatus.available,
          type: biometricStatus.type,
        });
      } catch (error) {
        console.error('Security check error:', error);
        analytics.logError(error, 'Auth Security Check');
      }
    };

    checkDeviceSecurity();
  }, []);

  // Check if user is logged in
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Try to get token from secure storage first, then fall back to AsyncStorage
        let token = await security.secureStorage.getItem('auth_token', false);

        // If not in secure storage, check AsyncStorage (for backward compatibility)
        if (!token) {
          token = await AsyncStorage.getItem('token');

          // If found in AsyncStorage, migrate to secure storage
          if (token) {
            await security.secureStorage.setItem('auth_token', token);
            await AsyncStorage.removeItem('token');
          }
        }

        if (token) {
          // Check if token is expired
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decoded.exp < currentTime) {
            // Token is expired
            await security.secureStorage.removeItem('auth_token');
            setUser(null);

            // Track expired token event
            analytics.trackEvent('auth_token_expired');
          } else {
            try {
              // Get user data
              const res = await apiClient.get(ENDPOINTS.USER_PROFILE);
              setUser(res.data);

              // Track successful auth
              analytics.identifyUser({
                id: res.data.id,
                role: res.data.role,
                created_at: res.data.createdAt,
              });
            } catch (error) {
              // Handle error fetching user data
              console.error('Error fetching user data:', error);
              await security.secureStorage.removeItem('auth_token');
              setUser(null);

              // Track error
              analytics.logError(error, 'Auth Load User');
            }
          }
        }
      } catch (error) {
        console.error('Load user error:', error);
        await security.secureStorage.removeItem('auth_token');
        setUser(null);

        // Track error
        analytics.logError(error, 'Auth Load User');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      // Track login attempt (without credentials)
      analytics.trackEvent('auth_login_attempt', {
        method: 'password',
        deviceModel: DeviceInfo.getModel(),
        deviceOS: Platform.OS,
        deviceOSVersion: Platform.Version,
      });

      // Call login API
      const res = await apiClient.post(ENDPOINTS.LOGIN, { email, password });
      const { token, refreshToken } = res.data;

      // Save tokens to secure storage
      await security.secureStorage.setItem('auth_token', token);
      if (refreshToken) {
        await security.secureStorage.setItem('auth_refresh_token', refreshToken);
      }

      // Get user data
      const userRes = await apiClient.get(ENDPOINTS.USER_PROFILE);
      setUser(userRes.data);

      // Track successful login
      analytics.trackEvent('auth_login_success', {
        method: 'password',
      });

      // Identify user for analytics
      analytics.identifyUser({
        id: userRes.data.id,
        role: userRes.data.role,
        created_at: userRes.data.createdAt,
      });

      return true;
    } catch (error) {
      // Format error message
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);

      // Track failed login
      analytics.trackEvent('auth_login_failure', {
        method: 'password',
        error: errorMessage,
        status: error.response?.status,
      });

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

      // Track biometric login attempt
      analytics.trackEvent('auth_login_attempt', {
        method: 'biometric',
        type: biometricType,
      });

      // Check if biometric credentials exist
      const credentials = await security.keychain.getCredentials();

      if (!credentials) {
        const errorMsg = 'No biometric credentials found';
        setError(errorMsg);
        analytics.trackEvent('auth_login_failure', {
          method: 'biometric',
          error: errorMsg,
        });
        return false;
      }

      // Authenticate with biometrics
      const success = await security.biometricAuth.authenticate('Authenticate to login to Ethical Hacking LMS');

      if (success) {
        // Login with stored credentials
        const result = await login(credentials.username, credentials.password);

        if (result) {
          // Track successful biometric login
          analytics.trackEvent('auth_login_success', {
            method: 'biometric',
            type: biometricType,
          });
        }

        return result;
      } else {
        const errorMsg = 'Biometric authentication failed';
        setError(errorMsg);

        // Track failed biometric login
        analytics.trackEvent('auth_login_failure', {
          method: 'biometric',
          error: errorMsg,
          type: biometricType,
        });

        return false;
      }
    } catch (error) {
      const errorMsg = 'Biometric authentication failed';
      setError(errorMsg);

      // Track error
      analytics.logError(error, 'Biometric Login');
      analytics.trackEvent('auth_login_failure', {
        method: 'biometric',
        error: errorMsg,
        errorDetails: error.message,
      });

      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);

      // Track registration attempt
      analytics.trackEvent('auth_register_attempt', {
        deviceModel: DeviceInfo.getModel(),
        deviceOS: Platform.OS,
      });

      // Call register API
      await apiClient.post(ENDPOINTS.REGISTER, {
        name,
        email,
        password,
        deviceInfo: {
          model: DeviceInfo.getModel(),
          os: Platform.OS,
          osVersion: Platform.Version,
          appVersion: DeviceInfo.getVersion(),
          deviceId: await DeviceInfo.getUniqueId(),
        }
      });

      // Track successful registration
      analytics.trackEvent('auth_register_success');

      // Login after registration
      return await login(email, password);
    } catch (error) {
      // Format error message
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setError(errorMessage);

      // Track failed registration
      analytics.trackEvent('auth_register_failure', {
        error: errorMessage,
        status: error.response?.status,
      });

      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      // Track logout event
      if (user) {
        analytics.trackEvent('auth_logout', {
          userId: user.id,
        });
      }

      // Try to notify the server about logout
      try {
        await apiClient.post(ENDPOINTS.LOGOUT);
      } catch (error) {
        // Ignore errors during logout API call
        console.warn('Logout API error:', error);
      }

      // Clear tokens from secure storage
      await security.secureStorage.removeItem('auth_token');
      await security.secureStorage.removeItem('auth_refresh_token');

      // Clear any legacy tokens from AsyncStorage
      await AsyncStorage.removeItem('token');

      // Reset user state
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      analytics.logError(error, 'Auth Logout');
    }
  };

  // Enable biometric login
  const enableBiometricLogin = async (email, password) => {
    try {
      // Check if biometrics are available
      if (!biometricsAvailable) {
        Alert.alert('Error', 'Biometric authentication is not available on this device');
        return false;
      }

      // Authenticate with biometrics first to ensure user has access
      const success = await security.biometricAuth.authenticate(
        'Authenticate to enable biometric login'
      );

      if (!success) {
        Alert.alert('Error', 'Biometric authentication failed');
        return false;
      }

      // Store credentials securely in keychain
      const result = await security.keychain.saveCredentials(email, password);

      if (result) {
        // Track successful biometric setup
        analytics.trackEvent('auth_biometric_setup_success', {
          type: biometricType,
        });
      }

      return result;
    } catch (error) {
      console.error('Enable biometric login error:', error);

      // Track error
      analytics.logError(error, 'Enable Biometric Login');
      analytics.trackEvent('auth_biometric_setup_failure', {
        error: error.message,
        type: biometricType,
      });

      return false;
    }
  };

  // Disable biometric login
  const disableBiometricLogin = async () => {
    try {
      // Remove credentials from keychain
      const result = await security.keychain.resetCredentials();

      if (result) {
        // Track biometric removal
        analytics.trackEvent('auth_biometric_disabled');
      }

      // Also remove any legacy storage
      await AsyncStorage.removeItem('biometricEmail');
      await AsyncStorage.removeItem('biometricPassword');

      return result;
    } catch (error) {
      console.error('Disable biometric login error:', error);

      // Track error
      analytics.logError(error, 'Disable Biometric Login');

      return false;
    }
  };

  // Check if device is secure
  const isDeviceSecure = () => {
    return deviceSecure;
  };

  // Get biometric type (for UI display)
  const getBiometricType = () => {
    return biometricType;
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);

      // Track password reset attempt
      analytics.trackEvent('auth_password_reset_request', {
        deviceOS: Platform.OS,
      });

      // Call reset password API
      await apiClient.post(ENDPOINTS.FORGOT_PASSWORD, { email });

      // Track successful request
      analytics.trackEvent('auth_password_reset_success');

      return true;
    } catch (error) {
      // Format error message
      const errorMessage = error.response?.data?.message || 'Password reset failed';
      setError(errorMessage);

      // Track failed request
      analytics.trackEvent('auth_password_reset_failure', {
        error: errorMessage,
      });

      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        loginWithBiometrics,
        register,
        logout,
        resetPassword,
        biometricsAvailable,
        biometricType: getBiometricType(),
        isDeviceSecure: isDeviceSecure(),
        enableBiometricLogin,
        disableBiometricLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
