import apiClient from './apiClient';
import { ENDPOINTS } from '../../config/api';

/**
 * Fetch all assessments
 * @returns {Promise} - Promise with assessments data
 */
export const fetchAssessments = async () => {
  try {
    const response = await apiClient.get(ENDPOINTS.ASSESSMENTS);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch assessment details by ID
 * @param {string|number} assessmentId - Assessment ID
 * @returns {Promise} - Promise with assessment details
 */
export const fetchAssessmentDetails = async (assessmentId) => {
  try {
    const response = await apiClient.get(ENDPOINTS.ASSESSMENT_DETAIL(assessmentId));
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch quiz by assessment ID
 * @param {string|number} assessmentId - Assessment ID
 * @returns {Promise} - Promise with quiz data
 */
export const fetchQuiz = async (assessmentId) => {
  try {
    const response = await apiClient.get(ENDPOINTS.QUIZ(assessmentId));
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Submit quiz answers
 * @param {string|number} assessmentId - Assessment ID
 * @param {Array} answers - Array of answers
 * @returns {Promise} - Promise with submission results
 */
export const submitQuiz = async (assessmentId, answers) => {
  try {
    const response = await apiClient.post(ENDPOINTS.SUBMIT_QUIZ(assessmentId), { answers });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get quiz results
 * @param {string|number} assessmentId - Assessment ID
 * @param {string|number} attemptId - Attempt ID
 * @returns {Promise} - Promise with quiz results
 */
export const getQuizResults = async (assessmentId, attemptId) => {
  try {
    const response = await apiClient.get(`/api/assessments/${assessmentId}/results/${attemptId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get quiz attempts
 * @param {string|number} assessmentId - Assessment ID
 * @returns {Promise} - Promise with quiz attempts
 */
export const getQuizAttempts = async (assessmentId) => {
  try {
    const response = await apiClient.get(`/api/assessments/${assessmentId}/attempts`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Start a new quiz attempt
 * @param {string|number} assessmentId - Assessment ID
 * @returns {Promise} - Promise with attempt data
 */
export const startQuizAttempt = async (assessmentId) => {
  try {
    const response = await apiClient.post(`/api/assessments/${assessmentId}/attempts`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Submit a practical assessment
 * @param {string|number} assessmentId - Assessment ID
 * @param {Object} submission - Submission data
 * @returns {Promise} - Promise with submission status
 */
export const submitPracticalAssessment = async (assessmentId, submission) => {
  try {
    const response = await apiClient.post(`/api/assessments/${assessmentId}/practical/submit`, submission);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get assessment certificate
 * @param {string|number} assessmentId - Assessment ID
 * @returns {Promise} - Promise with certificate data
 */
export const getAssessmentCertificate = async (assessmentId) => {
  try {
    const response = await apiClient.get(`/api/assessments/${assessmentId}/certificate`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
