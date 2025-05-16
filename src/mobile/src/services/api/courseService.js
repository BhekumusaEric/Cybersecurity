import apiClient from './apiClient';
import { ENDPOINTS } from '../../config/api';

/**
 * Fetch all courses
 * @returns {Promise} - Promise with courses data
 */
export const fetchCourses = async () => {
  try {
    const response = await apiClient.get(ENDPOINTS.COURSES);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch course details by ID
 * @param {string|number} courseId - Course ID
 * @returns {Promise} - Promise with course details
 */
export const fetchCourseDetails = async (courseId) => {
  try {
    const response = await apiClient.get(ENDPOINTS.COURSE_DETAIL(courseId));
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch course lessons
 * @param {string|number} courseId - Course ID
 * @returns {Promise} - Promise with course lessons
 */
export const fetchCourseLessons = async (courseId) => {
  try {
    const response = await apiClient.get(ENDPOINTS.COURSE_LESSONS(courseId));
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch lesson details
 * @param {string|number} lessonId - Lesson ID
 * @returns {Promise} - Promise with lesson details
 */
export const fetchLessonDetails = async (lessonId) => {
  try {
    const response = await apiClient.get(ENDPOINTS.LESSON_DETAIL(lessonId));
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Mark lesson as completed
 * @param {string|number} lessonId - Lesson ID
 * @returns {Promise} - Promise with completion status
 */
export const markLessonCompleted = async (lessonId) => {
  try {
    const response = await apiClient.post(`/api/lessons/${lessonId}/complete`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Enroll in a course
 * @param {string|number} courseId - Course ID
 * @returns {Promise} - Promise with enrollment status
 */
export const enrollInCourse = async (courseId) => {
  try {
    const response = await apiClient.post(`/api/courses/${courseId}/enroll`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Unenroll from a course
 * @param {string|number} courseId - Course ID
 * @returns {Promise} - Promise with unenrollment status
 */
export const unenrollFromCourse = async (courseId) => {
  try {
    const response = await apiClient.post(`/api/courses/${courseId}/unenroll`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Rate a course
 * @param {string|number} courseId - Course ID
 * @param {number} rating - Rating (1-5)
 * @param {string} review - Review text
 * @returns {Promise} - Promise with rating status
 */
export const rateCourse = async (courseId, rating, review = '') => {
  try {
    const response = await apiClient.post(`/api/courses/${courseId}/rate`, {
      rating,
      review,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get course progress
 * @param {string|number} courseId - Course ID
 * @returns {Promise} - Promise with course progress
 */
export const getCourseProgress = async (courseId) => {
  try {
    const response = await apiClient.get(`/api/courses/${courseId}/progress`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get course certificate
 * @param {string|number} courseId - Course ID
 * @returns {Promise} - Promise with certificate data
 */
export const getCourseCertificate = async (courseId) => {
  try {
    const response = await apiClient.get(`/api/courses/${courseId}/certificate`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
