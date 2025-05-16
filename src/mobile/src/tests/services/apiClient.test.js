/**
 * Tests for the API client
 * 
 * This file contains tests for the enhanced API client with certificate pinning,
 * error handling, and analytics integration.
 */

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import DeviceInfo from 'react-native-device-info';

// Mock dependencies
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(),
}));

jest.mock('react-native-device-info', () => ({
  getUniqueId: jest.fn(),
  getModel: jest.fn(),
  getVersion: jest.fn(),
}));

jest.mock('../../utils/analytics', () => ({
  trackEvent: jest.fn(),
  logError: jest.fn(),
}));

// Import after mocks
import apiClient from '../../services/api/apiClient';
import analytics from '../../utils/analytics';
import { API_URL } from '../../config/api';

describe('API Client', () => {
  let mock;
  
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Reset AsyncStorage
    AsyncStorage.clear();
    
    // Setup mock for axios
    mock = new MockAdapter(axios);
    
    // Mock NetInfo to return online
    NetInfo.fetch.mockResolvedValue({ isConnected: true, isInternetReachable: true });
    
    // Mock DeviceInfo
    DeviceInfo.getUniqueId.mockResolvedValue('test-device-id');
    DeviceInfo.getModel.mockReturnValue('Test Model');
    DeviceInfo.getVersion.mockReturnValue('1.0.0');
  });
  
  afterEach(() => {
    mock.reset();
  });
  
  it('should add auth token to requests if available', async () => {
    // Setup
    await AsyncStorage.setItem('token', 'test-token');
    mock.onGet(`${API_URL}/test`).reply(config => {
      expect(config.headers.Authorization).toBe('Bearer test-token');
      return [200, { success: true }];
    });
    
    // Execute
    await apiClient.get('/test');
    
    // Verify
    expect(mock.history.get.length).toBe(1);
  });
  
  it('should add device information to requests', async () => {
    // Setup
    mock.onGet(`${API_URL}/test`).reply(config => {
      expect(config.headers['X-Device-Id']).toBe('test-device-id');
      expect(config.headers['X-Device-Model']).toBe('Test Model');
      expect(config.headers['X-App-Version']).toBe('1.0.0');
      return [200, { success: true }];
    });
    
    // Execute
    await apiClient.get('/test');
    
    // Verify
    expect(mock.history.get.length).toBe(1);
  });
  
  it('should track API requests and responses', async () => {
    // Setup
    mock.onGet(`${API_URL}/test`).reply(200, { success: true });
    
    // Execute
    await apiClient.get('/test');
    
    // Verify
    expect(analytics.trackEvent).toHaveBeenCalledWith('api_request', expect.any(Object));
    expect(analytics.trackEvent).toHaveBeenCalledWith('api_response', expect.any(Object));
  });
  
  it('should handle network errors', async () => {
    // Setup
    NetInfo.fetch.mockResolvedValue({ isConnected: false, isInternetReachable: false });
    
    // Execute & Verify
    await expect(apiClient.get('/test')).rejects.toThrow('No internet connection');
  });
  
  it('should handle API errors and track them', async () => {
    // Setup
    mock.onGet(`${API_URL}/test`).reply(500, { message: 'Server error' });
    
    // Execute
    try {
      await apiClient.get('/test');
      fail('Should have thrown an error');
    } catch (error) {
      // Verify
      expect(error.message).toBe('Server error');
      expect(error.status).toBe(500);
      expect(analytics.trackEvent).toHaveBeenCalledWith('api_error', expect.any(Object));
      expect(analytics.logError).toHaveBeenCalled();
    }
  });
  
  it('should handle token refresh on 401 errors', async () => {
    // Setup
    await AsyncStorage.setItem('token', 'expired-token');
    await AsyncStorage.setItem('refreshToken', 'refresh-token');
    
    // First request returns 401
    mock.onGet(`${API_URL}/test`).replyOnce(config => {
      expect(config.headers.Authorization).toBe('Bearer expired-token');
      return [401, { message: 'Token expired' }];
    });
    
    // Token refresh request
    mock.onPost(`${API_URL}/api/auth/refresh-token`).reply(200, {
      token: 'new-token',
      newRefreshToken: 'new-refresh-token',
    });
    
    // Retry with new token
    mock.onGet(`${API_URL}/test`).reply(config => {
      expect(config.headers.Authorization).toBe('Bearer new-token');
      return [200, { success: true }];
    });
    
    // Execute
    await apiClient.get('/test');
    
    // Verify
    expect(mock.history.get.length).toBe(2);
    expect(mock.history.post.length).toBe(1);
    expect(await AsyncStorage.getItem('token')).toBe('new-token');
    expect(await AsyncStorage.getItem('refreshToken')).toBe('new-refresh-token');
  });
  
  it('should handle failed token refresh', async () => {
    // Setup
    await AsyncStorage.setItem('token', 'expired-token');
    await AsyncStorage.setItem('refreshToken', 'invalid-refresh-token');
    
    // First request returns 401
    mock.onGet(`${API_URL}/test`).replyOnce(401, { message: 'Token expired' });
    
    // Token refresh request fails
    mock.onPost(`${API_URL}/api/auth/refresh-token`).reply(401, { message: 'Invalid refresh token' });
    
    // Execute
    try {
      await apiClient.get('/test');
      fail('Should have thrown an error');
    } catch (error) {
      // Verify
      expect(error.message).toBe('Session expired. Please log in again.');
      expect(await AsyncStorage.getItem('token')).toBeNull();
      expect(await AsyncStorage.getItem('refreshToken')).toBeNull();
    }
  });
});
