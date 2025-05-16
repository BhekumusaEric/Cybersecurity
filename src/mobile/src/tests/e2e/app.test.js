/**
 * End-to-End Tests for Ethical Hacking LMS Mobile App
 * 
 * This file contains comprehensive E2E tests for the mobile application
 * using Detox for React Native.
 */

import { device, element, by, waitFor } from 'detox';

describe('Ethical Hacking LMS App', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  afterAll(async () => {
    await device.terminateApp();
  });

  /**
   * Authentication Tests
   */
  describe('Authentication Flow', () => {
    it('should show login screen on app launch', async () => {
      await expect(element(by.id('login-screen'))).toBeVisible();
      await expect(element(by.id('email-input'))).toBeVisible();
      await expect(element(by.id('password-input'))).toBeVisible();
      await expect(element(by.id('login-button'))).toBeVisible();
    });

    it('should show validation errors for empty login fields', async () => {
      await element(by.id('login-button')).tap();
      await expect(element(by.text('Email is required'))).toBeVisible();
      await expect(element(by.text('Password is required'))).toBeVisible();
    });

    it('should show error for invalid credentials', async () => {
      await element(by.id('email-input')).typeText('invalid@example.com');
      await element(by.id('password-input')).typeText('wrongpassword');
      await element(by.id('login-button')).tap();
      
      await waitFor(element(by.text('Invalid email or password')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should navigate to registration screen', async () => {
      await element(by.id('register-link')).tap();
      await expect(element(by.id('registration-screen'))).toBeVisible();
    });

    it('should register a new user', async () => {
      // Navigate to registration screen
      await element(by.id('register-link')).tap();
      
      // Fill registration form
      await element(by.id('name-input')).typeText('Test User');
      await element(by.id('email-input')).typeText(`test${Date.now()}@example.com`);
      await element(by.id('password-input')).typeText('Password123!');
      await element(by.id('confirm-password-input')).typeText('Password123!');
      
      // Submit form
      await element(by.id('register-button')).tap();
      
      // Verify success message or redirect to dashboard
      await waitFor(element(by.id('dashboard-screen')))
        .toBeVisible()
        .withTimeout(10000);
    });

    it('should successfully login with valid credentials', async () => {
      // Use test account credentials
      await element(by.id('email-input')).clearText();
      await element(by.id('email-input')).typeText('student@example.com');
      await element(by.id('password-input')).clearText();
      await element(by.id('password-input')).typeText('password123');
      await element(by.id('login-button')).tap();
      
      // Verify redirect to dashboard
      await waitFor(element(by.id('dashboard-screen')))
        .toBeVisible()
        .withTimeout(10000);
    });

    it('should reset password', async () => {
      // Navigate to forgot password screen
      await element(by.id('forgot-password-link')).tap();
      await expect(element(by.id('forgot-password-screen'))).toBeVisible();
      
      // Enter email
      await element(by.id('email-input')).typeText('student@example.com');
      await element(by.id('reset-button')).tap();
      
      // Verify success message
      await waitFor(element(by.text('Password reset instructions sent')))
        .toBeVisible()
        .withTimeout(5000);
    });
  });

  /**
   * Dashboard Tests
   */
  describe('Dashboard', () => {
    beforeEach(async () => {
      // Login before each test
      await element(by.id('email-input')).clearText();
      await element(by.id('email-input')).typeText('student@example.com');
      await element(by.id('password-input')).clearText();
      await element(by.id('password-input')).typeText('password123');
      await element(by.id('login-button')).tap();
      
      await waitFor(element(by.id('dashboard-screen')))
        .toBeVisible()
        .withTimeout(10000);
    });

    it('should display user information', async () => {
      await expect(element(by.id('user-greeting'))).toBeVisible();
      await expect(element(by.id('user-progress-summary'))).toBeVisible();
    });

    it('should display enrolled courses', async () => {
      await expect(element(by.id('enrolled-courses-section'))).toBeVisible();
      await expect(element(by.id('course-card'))).toExist();
    });

    it('should display upcoming assessments', async () => {
      await expect(element(by.id('upcoming-assessments-section'))).toBeVisible();
    });

    it('should navigate to course details', async () => {
      await element(by.id('course-card')).atIndex(0).tap();
      await expect(element(by.id('course-detail-screen'))).toBeVisible();
    });
  });

  /**
   * Course Tests
   */
  describe('Courses', () => {
    beforeEach(async () => {
      // Login and navigate to courses
      await element(by.id('email-input')).clearText();
      await element(by.id('email-input')).typeText('student@example.com');
      await element(by.id('password-input')).clearText();
      await element(by.id('password-input')).typeText('password123');
      await element(by.id('login-button')).tap();
      
      await waitFor(element(by.id('dashboard-screen')))
        .toBeVisible()
        .withTimeout(10000);
        
      await element(by.id('courses-tab')).tap();
    });

    it('should display course list', async () => {
      await expect(element(by.id('courses-screen'))).toBeVisible();
      await expect(element(by.id('course-list'))).toBeVisible();
      await expect(element(by.id('course-item'))).toExist();
    });

    it('should filter courses', async () => {
      await element(by.id('filter-button')).tap();
      await element(by.id('filter-option')).atIndex(1).tap(); // Select "In Progress"
      await element(by.id('apply-filter-button')).tap();
      
      // Verify filtered results
      await expect(element(by.id('course-item'))).toExist();
    });

    it('should search courses', async () => {
      await element(by.id('search-input')).typeText('Ethical');
      await element(by.id('search-button')).tap();
      
      // Verify search results
      await expect(element(by.id('course-item'))).toExist();
    });

    it('should navigate to course details', async () => {
      await element(by.id('course-item')).atIndex(0).tap();
      await expect(element(by.id('course-detail-screen'))).toBeVisible();
    });

    it('should display course modules', async () => {
      await element(by.id('course-item')).atIndex(0).tap();
      await expect(element(by.id('module-list'))).toBeVisible();
      await expect(element(by.id('module-item'))).toExist();
    });

    it('should navigate to module content', async () => {
      await element(by.id('course-item')).atIndex(0).tap();
      await element(by.id('module-item')).atIndex(0).tap();
      await expect(element(by.id('module-content-screen'))).toBeVisible();
    });
  });

  /**
   * Lab Tests
   */
  describe('Labs', () => {
    beforeEach(async () => {
      // Login and navigate to labs
      await element(by.id('email-input')).clearText();
      await element(by.id('email-input')).typeText('student@example.com');
      await element(by.id('password-input')).clearText();
      await element(by.id('password-input')).typeText('password123');
      await element(by.id('login-button')).tap();
      
      await waitFor(element(by.id('dashboard-screen')))
        .toBeVisible()
        .withTimeout(10000);
        
      await element(by.id('labs-tab')).tap();
    });

    it('should display lab list', async () => {
      await expect(element(by.id('labs-screen'))).toBeVisible();
      await expect(element(by.id('lab-list'))).toBeVisible();
      await expect(element(by.id('lab-item'))).toExist();
    });

    it('should filter labs by difficulty', async () => {
      await element(by.id('filter-button')).tap();
      await element(by.id('difficulty-filter')).atIndex(1).tap(); // Select "Intermediate"
      await element(by.id('apply-filter-button')).tap();
      
      // Verify filtered results
      await expect(element(by.id('lab-item'))).toExist();
    });

    it('should navigate to lab details', async () => {
      await element(by.id('lab-item')).atIndex(0).tap();
      await expect(element(by.id('lab-detail-screen'))).toBeVisible();
    });

    it('should display lab instructions', async () => {
      await element(by.id('lab-item')).atIndex(0).tap();
      await expect(element(by.id('lab-instructions'))).toBeVisible();
    });

    it('should launch lab environment', async () => {
      await element(by.id('lab-item')).atIndex(0).tap();
      await element(by.id('launch-lab-button')).tap();
      
      // Verify lab environment loading
      await expect(element(by.id('lab-environment-loading'))).toBeVisible();
      
      // Wait for lab to load (may take time)
      await waitFor(element(by.id('lab-environment-screen')))
        .toBeVisible()
        .withTimeout(30000);
    });
  });

  /**
   * Assessment Tests
   */
  describe('Assessments', () => {
    beforeEach(async () => {
      // Login and navigate to assessments
      await element(by.id('email-input')).clearText();
      await element(by.id('email-input')).typeText('student@example.com');
      await element(by.id('password-input')).clearText();
      await element(by.id('password-input')).typeText('password123');
      await element(by.id('login-button')).tap();
      
      await waitFor(element(by.id('dashboard-screen')))
        .toBeVisible()
        .withTimeout(10000);
        
      await element(by.id('assessments-tab')).tap();
    });

    it('should display assessment list', async () => {
      await expect(element(by.id('assessments-screen'))).toBeVisible();
      await expect(element(by.id('assessment-list'))).toBeVisible();
      await expect(element(by.id('assessment-item'))).toExist();
    });

    it('should filter assessments by type', async () => {
      await element(by.id('filter-button')).tap();
      await element(by.id('type-filter')).atIndex(0).tap(); // Select "Quiz"
      await element(by.id('apply-filter-button')).tap();
      
      // Verify filtered results
      await expect(element(by.id('assessment-item'))).toExist();
    });

    it('should navigate to assessment details', async () => {
      await element(by.id('assessment-item')).atIndex(0).tap();
      await expect(element(by.id('assessment-detail-screen'))).toBeVisible();
    });

    it('should start a quiz assessment', async () => {
      // Navigate to a quiz assessment
      await element(by.id('assessment-item')).atIndex(0).tap();
      await element(by.id('start-assessment-button')).tap();
      
      // Verify quiz started
      await expect(element(by.id('quiz-screen'))).toBeVisible();
      await expect(element(by.id('question-text'))).toBeVisible();
      await expect(element(by.id('answer-option'))).toExist();
    });

    it('should complete a quiz assessment', async () => {
      // Navigate to a quiz assessment
      await element(by.id('assessment-item')).atIndex(0).tap();
      await element(by.id('start-assessment-button')).tap();
      
      // Answer questions (assuming 5 questions)
      for (let i = 0; i < 5; i++) {
        await element(by.id('answer-option')).atIndex(0).tap();
        await element(by.id('next-question-button')).tap();
      }
      
      // Submit quiz
      await element(by.id('submit-quiz-button')).tap();
      
      // Verify results screen
      await expect(element(by.id('quiz-results-screen'))).toBeVisible();
      await expect(element(by.id('score-display'))).toBeVisible();
    });
  });

  /**
   * Profile Tests
   */
  describe('User Profile', () => {
    beforeEach(async () => {
      // Login and navigate to profile
      await element(by.id('email-input')).clearText();
      await element(by.id('email-input')).typeText('student@example.com');
      await element(by.id('password-input')).clearText();
      await element(by.id('password-input')).typeText('password123');
      await element(by.id('login-button')).tap();
      
      await waitFor(element(by.id('dashboard-screen')))
        .toBeVisible()
        .withTimeout(10000);
        
      await element(by.id('profile-tab')).tap();
    });

    it('should display user profile information', async () => {
      await expect(element(by.id('profile-screen'))).toBeVisible();
      await expect(element(by.id('profile-name'))).toBeVisible();
      await expect(element(by.id('profile-email'))).toBeVisible();
      await expect(element(by.id('profile-progress'))).toBeVisible();
    });

    it('should navigate to edit profile', async () => {
      await element(by.id('edit-profile-button')).tap();
      await expect(element(by.id('edit-profile-screen'))).toBeVisible();
    });

    it('should update profile information', async () => {
      await element(by.id('edit-profile-button')).tap();
      
      // Update name
      await element(by.id('name-input')).clearText();
      await element(by.id('name-input')).typeText('Updated Test User');
      
      // Save changes
      await element(by.id('save-profile-button')).tap();
      
      // Verify changes saved
      await expect(element(by.text('Profile updated successfully'))).toBeVisible();
      await expect(element(by.text('Updated Test User'))).toBeVisible();
    });

    it('should navigate to achievements', async () => {
      await element(by.id('achievements-button')).tap();
      await expect(element(by.id('achievements-screen'))).toBeVisible();
    });

    it('should log out', async () => {
      await element(by.id('logout-button')).tap();
      
      // Confirm logout
      await element(by.id('confirm-logout-button')).tap();
      
      // Verify redirect to login screen
      await expect(element(by.id('login-screen'))).toBeVisible();
    });
  });

  /**
   * Offline Mode Tests
   */
  describe('Offline Mode', () => {
    beforeEach(async () => {
      // Login
      await element(by.id('email-input')).clearText();
      await element(by.id('email-input')).typeText('student@example.com');
      await element(by.id('password-input')).clearText();
      await element(by.id('password-input')).typeText('password123');
      await element(by.id('login-button')).tap();
      
      await waitFor(element(by.id('dashboard-screen')))
        .toBeVisible()
        .withTimeout(10000);
    });

    it('should download content for offline use', async () => {
      // Navigate to a course
      await element(by.id('courses-tab')).tap();
      await element(by.id('course-item')).atIndex(0).tap();
      
      // Enable offline access
      await element(by.id('offline-access-toggle')).tap();
      
      // Verify download started
      await expect(element(by.id('download-progress'))).toBeVisible();
      
      // Wait for download to complete
      await waitFor(element(by.text('Available offline')))
        .toBeVisible()
        .withTimeout(30000);
    });

    it('should access content in offline mode', async () => {
      // Enable airplane mode
      await device.setStatusBar({ networkType: 'airplane' });
      
      // Navigate to courses
      await element(by.id('courses-tab')).tap();
      
      // Verify offline indicator
      await expect(element(by.id('offline-mode-indicator'))).toBeVisible();
      
      // Access downloaded course
      await element(by.id('course-item')).atIndex(0).tap();
      await element(by.id('module-item')).atIndex(0).tap();
      
      // Verify content is accessible
      await expect(element(by.id('module-content'))).toBeVisible();
      
      // Disable airplane mode
      await device.setStatusBar({ networkType: 'wifi' });
    });
  });
});
