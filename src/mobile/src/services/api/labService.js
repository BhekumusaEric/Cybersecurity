import apiClient from './apiClient';
import { ENDPOINTS } from '../../config/api';

/**
 * Fetch all labs
 * @returns {Promise} - Promise with labs data
 */
export const fetchLabs = async () => {
  try {
    const response = await apiClient.get(ENDPOINTS.LABS);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch lab details by ID
 * @param {string|number} labId - Lab ID
 * @returns {Promise} - Promise with lab details
 */
export const fetchLabDetails = async (labId) => {
  try {
    const response = await apiClient.get(ENDPOINTS.LAB_DETAIL(labId));
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Start a lab
 * @param {string|number} labId - Lab ID
 * @returns {Promise} - Promise with lab session data
 */
export const startLab = async (labId) => {
  try {
    const response = await apiClient.post(`/api/labs/${labId}/start`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Stop a lab
 * @param {string|number} labId - Lab ID
 * @returns {Promise} - Promise with stop status
 */
export const stopLab = async (labId) => {
  try {
    const response = await apiClient.post(`/api/labs/${labId}/stop`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Reset a lab
 * @param {string|number} labId - Lab ID
 * @returns {Promise} - Promise with reset status
 */
export const resetLab = async (labId) => {
  try {
    const response = await apiClient.post(`/api/labs/${labId}/reset`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Execute a command in a lab
 * @param {string|number} labId - Lab ID
 * @param {string} command - Command to execute
 * @returns {Promise} - Promise with command result
 */
export const executeLabCommand = async (labId, command) => {
  try {
    const response = await apiClient.post(`/api/labs/${labId}/execute`, { command });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get lab status
 * @param {string|number} labId - Lab ID
 * @returns {Promise} - Promise with lab status
 */
export const getLabStatus = async (labId) => {
  try {
    const response = await apiClient.get(`/api/labs/${labId}/status`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Mark lab as completed
 * @param {string|number} labId - Lab ID
 * @returns {Promise} - Promise with completion status
 */
export const markLabCompleted = async (labId) => {
  try {
    const response = await apiClient.post(`/api/labs/${labId}/complete`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Submit lab solution
 * @param {string|number} labId - Lab ID
 * @param {Object} solution - Solution data
 * @returns {Promise} - Promise with submission status
 */
export const submitLabSolution = async (labId, solution) => {
  try {
    const response = await apiClient.post(`/api/labs/${labId}/submit`, solution);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get lab progress
 * @param {string|number} labId - Lab ID
 * @returns {Promise} - Promise with lab progress
 */
export const getLabProgress = async (labId) => {
  try {
    const response = await apiClient.get(`/api/labs/${labId}/progress`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
