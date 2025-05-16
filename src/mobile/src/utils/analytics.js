/**
 * Analytics and Crash Reporting Configuration
 * 
 * This file sets up Firebase Analytics and Crashlytics for the Ethical Hacking LMS mobile app.
 * It provides utility functions for tracking events, user properties, and handling crashes.
 */

import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import { Platform } from 'react-native';
import Config from 'react-native-config';

// Environment-specific configuration
const isProduction = Config.ENVIRONMENT === 'production';
const isDevelopment = __DEV__;

/**
 * Initialize analytics and crash reporting
 * @param {Object} user - User object containing id and optional properties
 */
export const initializeAnalytics = async (user = null) => {
  try {
    // Enable analytics collection based on environment
    await analytics().setAnalyticsCollectionEnabled(isProduction);
    
    // Enable crashlytics collection based on environment
    await crashlytics().setCrashlyticsCollectionEnabled(isProduction);
    
    // Set user properties if user is provided
    if (user && user.id) {
      await identifyUser(user);
    }
    
    // Log initialization
    console.log('Analytics and crash reporting initialized successfully');
    
    // Track app open event
    trackEvent('app_open', {
      app_version: Config.VERSION_NAME,
      build_number: Config.VERSION_CODE,
      platform: Platform.OS,
      device_model: Platform.OS === 'ios' ? Platform.constants.model : Platform.constants.Brand
    });
  } catch (error) {
    console.error('Failed to initialize analytics:', error);
    
    // Don't crash in production due to analytics failure
    if (isDevelopment) {
      throw error;
    }
  }
};

/**
 * Identify user for analytics and crash reporting
 * @param {Object} user - User object containing id and optional properties
 */
export const identifyUser = async (user) => {
  if (!user || !user.id) {
    console.warn('Cannot identify user: Invalid user object');
    return;
  }
  
  try {
    // Set user ID for analytics
    await analytics().setUserId(user.id.toString());
    
    // Set user ID for crashlytics
    await crashlytics().setUserId(user.id.toString());
    
    // Set user properties for analytics
    if (user.role) {
      await analytics().setUserProperty('user_role', user.role);
      await crashlytics().setAttribute('user_role', user.role);
    }
    
    if (user.subscription_type) {
      await analytics().setUserProperty('subscription_type', user.subscription_type);
      await crashlytics().setAttribute('subscription_type', user.subscription_type);
    }
    
    // Set additional user properties
    const userProperties = {
      account_created_at: user.created_at,
      is_instructor: user.is_instructor ? 'true' : 'false',
      courses_enrolled: user.courses_enrolled?.length?.toString() || '0'
    };
    
    // Set each property individually
    for (const [key, value] of Object.entries(userProperties)) {
      if (value) {
        await analytics().setUserProperty(key, value);
        await crashlytics().setAttribute(key, value);
      }
    }
    
    console.log('User identified for analytics:', user.id);
  } catch (error) {
    console.error('Failed to identify user for analytics:', error);
  }
};

/**
 * Track an analytics event
 * @param {string} eventName - Name of the event to track
 * @param {Object} params - Optional parameters for the event
 */
export const trackEvent = async (eventName, params = {}) => {
  if (!eventName) {
    console.warn('Cannot track event: Event name is required');
    return;
  }
  
  try {
    // Add timestamp to all events
    const eventParams = {
      ...params,
      timestamp: new Date().toISOString()
    };
    
    // Log event to Firebase Analytics
    await analytics().logEvent(eventName, eventParams);
    
    // Debug logging in development
    if (isDevelopment) {
      console.log('Event tracked:', eventName, eventParams);
    }
  } catch (error) {
    console.error(`Failed to track event ${eventName}:`, error);
  }
};

/**
 * Track screen view
 * @param {string} screenName - Name of the screen
 * @param {string} screenClass - Class/component name of the screen
 */
export const trackScreenView = async (screenName, screenClass) => {
  if (!screenName) {
    console.warn('Cannot track screen view: Screen name is required');
    return;
  }
  
  try {
    // Log screen view to Firebase Analytics
    await analytics().logScreenView({
      screen_name: screenName,
      screen_class: screenClass || screenName
    });
    
    // Debug logging in development
    if (isDevelopment) {
      console.log('Screen view tracked:', screenName);
    }
  } catch (error) {
    console.error(`Failed to track screen view ${screenName}:`, error);
  }
};

/**
 * Log a non-fatal error to crashlytics
 * @param {Error} error - Error object
 * @param {string} context - Context where the error occurred
 */
export const logError = async (error, context = '') => {
  if (!error) {
    console.warn('Cannot log error: Error object is required');
    return;
  }
  
  try {
    // Record error in Crashlytics
    await crashlytics().recordError(error);
    
    // Add context as a custom key
    if (context) {
      await crashlytics().setAttribute('error_context', context);
    }
    
    // Log error details in development
    if (isDevelopment) {
      console.error('Error logged to crashlytics:', error, context);
    }
  } catch (logError) {
    console.error('Failed to log error to crashlytics:', logError);
  }
};

/**
 * Set custom crash keys for the current session
 * @param {Object} keys - Key-value pairs to set as custom keys
 */
export const setCrashKeys = async (keys) => {
  if (!keys || typeof keys !== 'object') {
    console.warn('Cannot set crash keys: Keys must be an object');
    return;
  }
  
  try {
    // Set each key individually
    for (const [key, value] of Object.entries(keys)) {
      if (typeof value === 'string') {
        await crashlytics().setAttribute(key, value);
      } else if (typeof value === 'number') {
        await crashlytics().setAttribute(key, value.toString());
      } else if (typeof value === 'boolean') {
        await crashlytics().setAttribute(key, value ? 'true' : 'false');
      } else if (value === null || value === undefined) {
        // Skip null or undefined values
        continue;
      } else {
        // For objects or arrays, stringify them
        await crashlytics().setAttribute(key, JSON.stringify(value));
      }
    }
    
    // Debug logging in development
    if (isDevelopment) {
      console.log('Crash keys set:', keys);
    }
  } catch (error) {
    console.error('Failed to set crash keys:', error);
  }
};

/**
 * Track user engagement with course content
 * @param {string} courseId - ID of the course
 * @param {string} moduleId - ID of the module
 * @param {string} contentType - Type of content (video, text, quiz, lab)
 * @param {number} durationSeconds - Duration of engagement in seconds
 */
export const trackContentEngagement = async (courseId, moduleId, contentType, durationSeconds) => {
  if (!courseId || !moduleId || !contentType) {
    console.warn('Cannot track content engagement: Missing required parameters');
    return;
  }
  
  try {
    await trackEvent('content_engagement', {
      course_id: courseId,
      module_id: moduleId,
      content_type: contentType,
      duration_seconds: durationSeconds
    });
  } catch (error) {
    console.error('Failed to track content engagement:', error);
  }
};

/**
 * Track assessment completion
 * @param {string} assessmentId - ID of the assessment
 * @param {string} assessmentType - Type of assessment (quiz, practical)
 * @param {number} score - Score achieved (percentage)
 * @param {number} timeSpentSeconds - Time spent on assessment in seconds
 */
export const trackAssessmentCompletion = async (assessmentId, assessmentType, score, timeSpentSeconds) => {
  if (!assessmentId || !assessmentType) {
    console.warn('Cannot track assessment completion: Missing required parameters');
    return;
  }
  
  try {
    await trackEvent('assessment_completion', {
      assessment_id: assessmentId,
      assessment_type: assessmentType,
      score: score,
      time_spent_seconds: timeSpentSeconds,
      passed: score >= 70 // Assuming 70% is passing score
    });
  } catch (error) {
    console.error('Failed to track assessment completion:', error);
  }
};

/**
 * Track lab environment usage
 * @param {string} labId - ID of the lab
 * @param {string} labType - Type of lab environment
 * @param {number} durationMinutes - Duration of lab session in minutes
 * @param {boolean} completed - Whether the lab was completed successfully
 */
export const trackLabUsage = async (labId, labType, durationMinutes, completed) => {
  if (!labId || !labType) {
    console.warn('Cannot track lab usage: Missing required parameters');
    return;
  }
  
  try {
    await trackEvent('lab_usage', {
      lab_id: labId,
      lab_type: labType,
      duration_minutes: durationMinutes,
      completed: completed
    });
  } catch (error) {
    console.error('Failed to track lab usage:', error);
  }
};

/**
 * Track app performance metrics
 * @param {string} metricName - Name of the performance metric
 * @param {number} valueMs - Value in milliseconds
 */
export const trackPerformance = async (metricName, valueMs) => {
  if (!metricName || typeof valueMs !== 'number') {
    console.warn('Cannot track performance: Invalid parameters');
    return;
  }
  
  try {
    await trackEvent('performance_metric', {
      metric_name: metricName,
      value_ms: valueMs,
      network_type: 'unknown' // TODO: Implement network type detection
    });
  } catch (error) {
    console.error('Failed to track performance:', error);
  }
};

export default {
  initializeAnalytics,
  identifyUser,
  trackEvent,
  trackScreenView,
  logError,
  setCrashKeys,
  trackContentEngagement,
  trackAssessmentCompletion,
  trackLabUsage,
  trackPerformance
};
