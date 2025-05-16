import apiClient from './apiClient';

/**
 * Fetch dashboard data
 * @returns {Promise} - Promise with dashboard data
 */
export const fetchDashboardData = async () => {
  try {
    const response = await apiClient.get('/api/dashboard');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch user progress
 * @returns {Promise} - Promise with user progress data
 */
export const fetchUserProgress = async () => {
  try {
    const response = await apiClient.get('/api/progress');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch user statistics
 * @returns {Promise} - Promise with user statistics
 */
export const fetchUserStats = async () => {
  try {
    const response = await apiClient.get('/api/users/me/stats');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch recent activities
 * @param {number} limit - Number of activities to fetch
 * @returns {Promise} - Promise with recent activities
 */
export const fetchRecentActivities = async (limit = 10) => {
  try {
    const response = await apiClient.get(`/api/users/me/activities?limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch announcements
 * @param {number} limit - Number of announcements to fetch
 * @returns {Promise} - Promise with announcements
 */
export const fetchAnnouncements = async (limit = 5) => {
  try {
    const response = await apiClient.get(`/api/announcements?limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch recommended courses
 * @param {number} limit - Number of courses to fetch
 * @returns {Promise} - Promise with recommended courses
 */
export const fetchRecommendedCourses = async (limit = 3) => {
  try {
    const response = await apiClient.get(`/api/courses/recommended?limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch upcoming labs
 * @param {number} limit - Number of labs to fetch
 * @returns {Promise} - Promise with upcoming labs
 */
export const fetchUpcomingLabs = async (limit = 3) => {
  try {
    const response = await apiClient.get(`/api/labs/upcoming?limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch user certificates
 * @returns {Promise} - Promise with user certificates
 */
export const fetchUserCertificates = async () => {
  try {
    const response = await apiClient.get('/api/users/me/certificates');
    return response.data;
  } catch (error) {
    throw error;
  }
};
