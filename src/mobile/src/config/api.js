import { Platform } from 'react-native';
import Config from 'react-native-config';

// Environment-specific API configuration
const API_ENVIRONMENTS = {
  development: 'http://localhost:5000',
  staging: 'https://api-staging.ethicalhackinglms.com',
  production: 'https://api.ethicalhackinglms.com',
};

// Determine the current environment
const CURRENT_ENV = Config.ENVIRONMENT || (__DEV__ ? 'development' : 'production');

// API configuration
export const API_URL = Config.API_URL || API_ENVIRONMENTS[CURRENT_ENV];

// Certificate pinning for HTTPS requests
// These are SHA-256 hashes of the public keys for our API servers
export const API_CERT_PINS = CURRENT_ENV === 'production' ? [
  // Production certificates - Update these with your actual certificate hashes
  'sha256//YLh1dUR9y6Kja30RrAn7JKnbQG/uEtLMkBgFF2Fuihg=',
  'sha256//Vjs8r4z+80wjNcr1YKepWQboSIRi63WsWXhIMN+eWys='
] : CURRENT_ENV === 'staging' ? [
  // Staging certificates
  'sha256//PU4suW7QFp+68CS8gSyDqN+Q/rCF6BIpq3OhbVqtu48=',
  'sha256//Vjs8r4z+80wjNcr1YKepWQboSIRi63WsWXhIMN+eWys='
] : null; // No pinning for development

// API request timeout in milliseconds
export const API_TIMEOUT = 15000;

// API retry configuration
export const API_RETRY = {
  maxRetries: 3,
  retryDelay: 1000,
  retryStatusCodes: [408, 500, 502, 503, 504, 522, 524]
};

// API endpoints
export const ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  FORGOT_PASSWORD: '/api/auth/forgot-password',
  RESET_PASSWORD: '/api/auth/reset-password',

  // User
  USER_PROFILE: '/api/users/me',
  UPDATE_PROFILE: '/api/users/me',

  // Courses
  COURSES: '/api/courses',
  COURSE_DETAIL: (id) => `/api/courses/${id}`,
  COURSE_LESSONS: (id) => `/api/courses/${id}/lessons`,

  // Lessons
  LESSONS: '/api/lessons',
  LESSON_DETAIL: (id) => `/api/lessons/${id}`,

  // Labs
  LABS: '/api/labs',
  LAB_DETAIL: (id) => `/api/labs/${id}`,

  // Assessments
  ASSESSMENTS: '/api/assessments',
  ASSESSMENT_DETAIL: (id) => `/api/assessments/${id}`,
  QUIZ: (id) => `/api/assessments/${id}/quiz`,
  SUBMIT_QUIZ: (id) => `/api/assessments/${id}/submit`,

  // Progress
  PROGRESS: '/api/progress',
  SYNC_PROGRESS: '/api/progress/sync',

  // Notifications
  NOTIFICATIONS: '/api/notifications',
  NOTIFICATION_DETAIL: (id) => `/api/notifications/${id}`,
  MARK_NOTIFICATION_READ: (id) => `/api/notifications/${id}/read`,
  MARK_ALL_NOTIFICATIONS_READ: '/api/notifications/read-all',
  REGISTER_DEVICE: '/api/notifications/register-device',

  // Analytics
  ANALYTICS: '/api/analytics/events',

  // Security
  SECURITY_CHECK: '/api/security/device-check',

  // Offline
  SYNC_OFFLINE_DATA: '/api/offline/sync',
  OFFLINE_CONTENT_MANIFEST: '/api/offline/manifest',

  // Labs
  LAB_ENVIRONMENTS: '/api/labs/environments',
  LAB_ENVIRONMENT_DETAIL: (id) => `/api/labs/environments/${id}`,
  LAB_ENVIRONMENT_START: (id) => `/api/labs/environments/${id}/start`,
  LAB_ENVIRONMENT_STOP: (id) => `/api/labs/environments/${id}/stop`,
  LAB_ENVIRONMENT_STATUS: (id) => `/api/labs/environments/${id}/status`,
  LAB_ENVIRONMENT_CONNECT: (id) => `/api/labs/environments/${id}/connect`,

  // Certificates
  CERTIFICATES: '/api/certificates',
  CERTIFICATE_DETAIL: (id) => `/api/certificates/${id}`,
  CERTIFICATE_DOWNLOAD: (id) => `/api/certificates/${id}/download`,
  CERTIFICATE_VERIFY: '/api/certificates/verify',
};
