import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';
import { API_URL, API_CERT_PINS } from '../../config/api';
import DeviceInfo from 'react-native-device-info';
import analytics from '../../utils/analytics';

// Certificate pinning setup for Android
let axiosConfig = {
  baseURL: API_URL,
  timeout: 15000, // Increased timeout for slower connections
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': `EthicalHackingLMS/${DeviceInfo.getVersion()} (${Platform.OS}; ${Platform.Version})`,
    'Accept': 'application/json',
  },
};

// Add certificate pinning for production
if (__DEV__ === false && API_CERT_PINS) {
  axiosConfig.httpsAgent = new (require('axios-https-pinning').HttpsAgent)({
    publicKeys: API_CERT_PINS,
  });
}

// Create axios instance
const apiClient = axios.create(axiosConfig);

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    // Check network connectivity
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      return Promise.reject(new Error('No internet connection'));
    }

    // Add auth token to headers if available
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add device information
    config.headers['X-Device-Id'] = await DeviceInfo.getUniqueId();
    config.headers['X-Device-Model'] = DeviceInfo.getModel();
    config.headers['X-App-Version'] = DeviceInfo.getVersion();

    // Log API request for analytics
    analytics.trackEvent('api_request', {
      endpoint: config.url,
      method: config.method
    });

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log successful API response for analytics
    analytics.trackEvent('api_response', {
      endpoint: response.config.url,
      status: response.status
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = await AsyncStorage.getItem('refreshToken');

        if (refreshToken) {
          const response = await axios.post(`${API_URL}/api/auth/refresh-token`, {
            refreshToken,
          });

          const { token, newRefreshToken } = response.data;

          // Save new tokens
          await AsyncStorage.setItem('token', token);
          if (newRefreshToken) {
            await AsyncStorage.setItem('refreshToken', newRefreshToken);
          }

          // Update auth header
          originalRequest.headers.Authorization = `Bearer ${token}`;

          // Retry the original request
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token fails, log out the user
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('refreshToken');
        await AsyncStorage.removeItem('user');

        // Dispatch logout event for auth context to handle
        const event = new CustomEvent('auth:logout', { detail: { reason: 'token_expired' } });
        document.dispatchEvent(event);

        return Promise.reject(new Error('Session expired. Please log in again.'));
      }
    }

    // Format error message
    let errorMessage = 'Something went wrong';
    let errorCode = 'unknown_error';

    if (error.response) {
      // Server responded with an error
      errorMessage = error.response.data?.message || `Error: ${error.response.status}`;
      errorCode = error.response.data?.code || `http_${error.response.status}`;

      // Handle specific error codes
      if (error.response.status === 429) {
        errorMessage = 'Too many requests. Please try again later.';
        errorCode = 'rate_limited';
      }
    } else if (error.request) {
      // Request was made but no response received
      if (!navigator.onLine) {
        errorMessage = 'No internet connection';
        errorCode = 'offline';
      } else {
        errorMessage = 'No response from server';
        errorCode = 'server_timeout';
      }
    } else {
      // Error in setting up the request
      errorMessage = error.message;
      errorCode = 'request_setup_failed';
    }

    // Log API error for analytics
    analytics.trackEvent('api_error', {
      endpoint: originalRequest?.url || 'unknown',
      error_code: errorCode,
      error_message: errorMessage.substring(0, 100) // Limit message length
    });

    // Log to crashlytics for serious errors
    if (error.response?.status >= 500 || !error.response) {
      analytics.logError(new Error(`API Error: ${errorMessage}`), 'API Request');
    }

    // Create a custom error object
    const customError = new Error(errorMessage);
    customError.status = error.response?.status;
    customError.code = errorCode;
    customError.data = error.response?.data;
    customError.request = originalRequest;

    return Promise.reject(customError);
  }
);

export default apiClient;
