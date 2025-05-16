/**
 * Lab Environment Service
 * 
 * Handles lab environment provisioning, connection, and management
 * with improved error handling and retry mechanisms for network issues.
 */

import axios from 'axios';
import Config from 'react-native-config';
import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import analytics from '../utils/analytics';

// Configuration
const API_URL = Config.API_URL;
const LAB_PROVISION_ENDPOINT = `${API_URL}/labs/provision`;
const LAB_STATUS_ENDPOINT = `${API_URL}/labs/status`;
const LAB_TERMINATE_ENDPOINT = `${API_URL}/labs/terminate`;

// Constants
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 2000; // 2 seconds
const MAX_RETRY_DELAY = 30000; // 30 seconds
const CONNECTION_TIMEOUT = 15000; // 15 seconds
const POLLING_INTERVAL = 5000; // 5 seconds
const SLOW_NETWORK_THRESHOLD = 300; // 300ms latency is considered slow

// Lab environment status
export const LAB_STATUS = {
  PROVISIONING: 'provisioning',
  RUNNING: 'running',
  STOPPING: 'stopping',
  STOPPED: 'stopped',
  ERROR: 'error'
};

/**
 * Check network quality
 * @returns {Promise<Object>} Network quality information
 */
const checkNetworkQuality = async () => {
  try {
    const netInfo = await NetInfo.fetch();
    
    // For testing network latency
    const startTime = Date.now();
    await fetch(`${API_URL}/ping`);
    const latency = Date.now() - startTime;
    
    return {
      isConnected: netInfo.isConnected,
      type: netInfo.type,
      isSlowConnection: latency > SLOW_NETWORK_THRESHOLD,
      latency
    };
  } catch (error) {
    console.error('Error checking network quality:', error);
    return {
      isConnected: false,
      type: 'unknown',
      isSlowConnection: true,
      latency: 999
    };
  }
};

/**
 * Exponential backoff for retries
 * @param {number} attempt - Current attempt number
 * @returns {number} Delay in milliseconds
 */
const getRetryDelay = (attempt) => {
  const delay = Math.min(
    INITIAL_RETRY_DELAY * Math.pow(2, attempt),
    MAX_RETRY_DELAY
  );
  
  // Add jitter to prevent synchronized retries
  return delay + (Math.random() * 1000);
};

/**
 * Create axios instance with timeout and retry logic
 * @param {number} timeout - Request timeout in milliseconds
 * @returns {Object} Axios instance
 */
const createAxiosInstance = (timeout = CONNECTION_TIMEOUT) => {
  const instance = axios.create({
    timeout,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  
  // Add request interceptor for authentication
  instance.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  
  return instance;
};

/**
 * Provision a lab environment with retry mechanism
 * @param {string} labId - ID of the lab to provision
 * @param {Object} options - Provisioning options
 * @returns {Promise<Object>} Provisioned lab information
 */
export const provisionLab = async (labId, options = {}) => {
  let attempt = 0;
  let lastError = null;
  
  // Track lab provisioning attempt
  analytics.trackEvent('lab_provision_attempt', {
    lab_id: labId,
    options: JSON.stringify(options)
  });
  
  // Check network quality before attempting provisioning
  const networkQuality = await checkNetworkQuality();
  
  // Adjust timeout based on network quality
  const timeout = networkQuality.isSlowConnection 
    ? CONNECTION_TIMEOUT * 2 
    : CONNECTION_TIMEOUT;
  
  // Create axios instance with appropriate timeout
  const api = createAxiosInstance(timeout);
  
  // Log network quality for debugging
  console.log('Network quality before lab provision:', networkQuality);
  
  while (attempt < MAX_RETRIES) {
    try {
      // If on slow connection, show warning to user
      if (networkQuality.isSlowConnection && attempt === 0) {
        // This would trigger a UI notification in the component
        global.EventEmitter.emit('SLOW_NETWORK_WARNING', {
          labId,
          latency: networkQuality.latency
        });
      }
      
      // Attempt to provision the lab
      const response = await api.post(LAB_PROVISION_ENDPOINT, {
        labId,
        ...options,
        deviceInfo: {
          platform: Platform.OS,
          version: Platform.Version,
          model: Platform.OS === 'ios' ? Platform.constants.model : Platform.constants.Brand,
          networkType: networkQuality.type
        }
      });
      
      // Track successful provisioning
      analytics.trackEvent('lab_provision_success', {
        lab_id: labId,
        attempt: attempt + 1,
        lab_session_id: response.data.sessionId
      });
      
      return response.data;
    } catch (error) {
      lastError = error;
      
      // Log the error
      console.error(`Lab provision attempt ${attempt + 1} failed:`, error);
      
      // Track failed attempt
      analytics.trackEvent('lab_provision_failure', {
        lab_id: labId,
        attempt: attempt + 1,
        error: error.message,
        status: error.response?.status
      });
      
      // Check if we should retry based on error type
      const shouldRetry = error.code === 'ECONNABORTED' || 
                          error.response?.status >= 500 ||
                          error.message.includes('timeout') ||
                          !error.response; // Network error
      
      if (!shouldRetry) {
        break; // Don't retry client errors or other non-retryable errors
      }
      
      // Increment attempt counter
      attempt++;
      
      // If we have more retries, wait before trying again
      if (attempt < MAX_RETRIES) {
        const delay = getRetryDelay(attempt);
        
        // Notify UI about retry
        global.EventEmitter.emit('LAB_PROVISION_RETRY', {
          labId,
          attempt,
          delay,
          maxRetries: MAX_RETRIES
        });
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // If we get here, all retries failed
  const errorData = {
    message: 'Failed to provision lab environment after multiple attempts',
    originalError: lastError,
    labId,
    networkQuality
  };
  
  // Track final failure
  analytics.trackEvent('lab_provision_all_retries_failed', {
    lab_id: labId,
    attempts: MAX_RETRIES,
    network_type: networkQuality.type,
    latency: networkQuality.latency
  });
  
  // Throw error with detailed information
  throw errorData;
};

/**
 * Check lab environment status with retry mechanism
 * @param {string} sessionId - Lab session ID
 * @returns {Promise<Object>} Lab status information
 */
export const checkLabStatus = async (sessionId) => {
  let attempt = 0;
  
  while (attempt < MAX_RETRIES) {
    try {
      const api = createAxiosInstance();
      const response = await api.get(`${LAB_STATUS_ENDPOINT}/${sessionId}`);
      return response.data;
    } catch (error) {
      // Log the error
      console.error(`Lab status check attempt ${attempt + 1} failed:`, error);
      
      // Check if we should retry based on error type
      const shouldRetry = error.code === 'ECONNABORTED' || 
                          error.response?.status >= 500 ||
                          error.message.includes('timeout') ||
                          !error.response; // Network error
      
      if (!shouldRetry) {
        break; // Don't retry client errors
      }
      
      // Increment attempt counter
      attempt++;
      
      // If we have more retries, wait before trying again
      if (attempt < MAX_RETRIES) {
        const delay = getRetryDelay(attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // If we get here, all retries failed
  throw new Error('Failed to check lab status after multiple attempts');
};

/**
 * Poll lab status until it's running or an error occurs
 * @param {string} sessionId - Lab session ID
 * @param {Function} statusCallback - Callback for status updates
 * @param {number} maxPolls - Maximum number of polling attempts
 * @returns {Promise<Object>} Final lab status
 */
export const pollLabStatus = async (sessionId, statusCallback, maxPolls = 60) => {
  let polls = 0;
  
  while (polls < maxPolls) {
    try {
      const status = await checkLabStatus(sessionId);
      
      // Call the status callback
      if (statusCallback) {
        statusCallback(status);
      }
      
      // If the lab is running or in error state, stop polling
      if (status.status === LAB_STATUS.RUNNING || status.status === LAB_STATUS.ERROR) {
        return status;
      }
      
      // Wait before polling again
      await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL));
      polls++;
    } catch (error) {
      // If there's an error checking status, wait and try again
      console.error('Error polling lab status:', error);
      await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL * 2));
      polls++;
    }
  }
  
  // If we reach max polls, throw an error
  throw new Error('Lab provisioning timed out');
};

/**
 * Connect to a running lab environment
 * @param {Object} labSession - Lab session information
 * @returns {Promise<Object>} Connection information
 */
export const connectToLab = async (labSession) => {
  try {
    // Track connection attempt
    analytics.trackEvent('lab_connect_attempt', {
      lab_id: labSession.labId,
      session_id: labSession.sessionId
    });
    
    // Check network quality
    const networkQuality = await checkNetworkQuality();
    
    // Create connection configuration based on lab type and network quality
    const connectionConfig = {
      sessionId: labSession.sessionId,
      connectionType: networkQuality.isSlowConnection ? 'low-bandwidth' : 'standard',
      protocol: labSession.protocol,
      endpoint: labSession.endpoint,
      credentials: labSession.credentials,
      networkQuality
    };
    
    // Track successful connection
    analytics.trackEvent('lab_connect_success', {
      lab_id: labSession.labId,
      session_id: labSession.sessionId,
      connection_type: connectionConfig.connectionType
    });
    
    return connectionConfig;
  } catch (error) {
    // Track connection failure
    analytics.trackEvent('lab_connect_failure', {
      lab_id: labSession.labId,
      session_id: labSession.sessionId,
      error: error.message
    });
    
    throw error;
  }
};

/**
 * Terminate a lab environment
 * @param {string} sessionId - Lab session ID
 * @returns {Promise<Object>} Termination result
 */
export const terminateLab = async (sessionId) => {
  let attempt = 0;
  
  while (attempt < MAX_RETRIES) {
    try {
      const api = createAxiosInstance();
      const response = await api.post(LAB_TERMINATE_ENDPOINT, { sessionId });
      
      // Track successful termination
      analytics.trackEvent('lab_terminate_success', {
        session_id: sessionId
      });
      
      return response.data;
    } catch (error) {
      // Log the error
      console.error(`Lab termination attempt ${attempt + 1} failed:`, error);
      
      // Track failed attempt
      analytics.trackEvent('lab_terminate_failure', {
        session_id: sessionId,
        attempt: attempt + 1,
        error: error.message
      });
      
      // Check if we should retry based on error type
      const shouldRetry = error.code === 'ECONNABORTED' || 
                          error.response?.status >= 500 ||
                          error.message.includes('timeout') ||
                          !error.response; // Network error
      
      if (!shouldRetry) {
        break; // Don't retry client errors
      }
      
      // Increment attempt counter
      attempt++;
      
      // If we have more retries, wait before trying again
      if (attempt < MAX_RETRIES) {
        const delay = getRetryDelay(attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // If we get here, all retries failed
  throw new Error('Failed to terminate lab after multiple attempts');
};

export default {
  provisionLab,
  checkLabStatus,
  pollLabStatus,
  connectToLab,
  terminateLab,
  LAB_STATUS
};
