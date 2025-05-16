# Testing Guide for Ethical Hacking LMS Mobile App

This guide provides comprehensive instructions for testing the Ethical Hacking LMS mobile app before submission to app stores.

## Automated Testing

### Unit Tests

The app includes a suite of unit tests to verify the functionality of individual components.

To run the unit tests:

```bash
cd src/mobile
npm test
```

To run tests with coverage:

```bash
npm run test:coverage
```

### Linting

The app uses ESLint to ensure code quality and consistency.

To run the linter:

```bash
npm run lint
```

To automatically fix linting issues:

```bash
npm run lint:fix
```

### CI/CD Pipeline

The app includes a GitHub Actions workflow that automatically runs tests and builds the app for both iOS and Android platforms.

To view the workflow:

1. Go to the GitHub repository
2. Click on the "Actions" tab
3. Select the "Test" workflow

## Manual Testing

### Testing Checklist

#### Authentication

- [ ] User can register with valid information
- [ ] User cannot register with invalid information (e.g., invalid email, short password)
- [ ] User can log in with valid credentials
- [ ] User cannot log in with invalid credentials
- [ ] User can reset password
- [ ] User can log out

#### Navigation

- [ ] User can navigate between all screens
- [ ] Bottom tab navigation works correctly
- [ ] Drawer navigation works correctly
- [ ] Back button works correctly on all screens
- [ ] Deep linking works correctly

#### Courses

- [ ] Course list displays correctly
- [ ] Course details display correctly
- [ ] User can enroll in a course
- [ ] User can view course progress
- [ ] User can navigate to lessons within a course

#### Lessons

- [ ] Lesson content displays correctly
- [ ] User can mark lessons as complete
- [ ] User can navigate between lessons
- [ ] Video content plays correctly
- [ ] Interactive elements work correctly

#### Labs

- [ ] Lab list displays correctly
- [ ] Lab details display correctly
- [ ] User can start a lab
- [ ] Lab environment loads correctly
- [ ] User can complete lab tasks
- [ ] User can submit lab results

#### Assessments

- [ ] Assessment list displays correctly
- [ ] User can start an assessment
- [ ] Questions display correctly
- [ ] User can submit answers
- [ ] Results display correctly
- [ ] User can review incorrect answers

#### Profile

- [ ] User profile displays correctly
- [ ] User can edit profile information
- [ ] User can change password
- [ ] User can view certificates
- [ ] User can view progress statistics

#### Offline Mode

- [ ] User can download content for offline use
- [ ] Downloaded content is accessible offline
- [ ] User can complete lessons offline
- [ ] Progress is saved offline
- [ ] Progress syncs when back online
- [ ] User can manage downloaded content

#### Performance

- [ ] App loads quickly
- [ ] Transitions are smooth
- [ ] Scrolling is smooth
- [ ] No memory leaks
- [ ] Battery usage is reasonable

#### Accessibility

- [ ] Text is readable at different font sizes
- [ ] Color contrast is sufficient
- [ ] Screen reader works correctly
- [ ] All interactive elements are accessible
- [ ] App supports device orientation changes

### Testing on Different Devices

#### iOS

Test on the following devices:

- iPhone SE (small screen)
- iPhone 12/13 (medium screen)
- iPhone 12/13 Pro Max (large screen)
- iPad (tablet)
- iPad Pro (large tablet)

#### Android

Test on the following devices:

- Small screen device (e.g., Pixel 4a)
- Medium screen device (e.g., Pixel 6)
- Large screen device (e.g., Pixel 6 Pro)
- Tablet (e.g., Samsung Galaxy Tab)

### Testing Different Network Conditions

- [ ] Test on Wi-Fi
- [ ] Test on cellular data (4G/5G)
- [ ] Test with slow network connection
- [ ] Test with intermittent network connection
- [ ] Test with no network connection

## Bug Reporting

When reporting bugs, include the following information:

1. **Device Information**
   - Device model
   - OS version
   - App version

2. **Steps to Reproduce**
   - Detailed steps to reproduce the issue
   - Expected behavior
   - Actual behavior

3. **Screenshots/Videos**
   - Include screenshots or videos if possible

4. **Logs**
   - Include any relevant logs or error messages

## Pre-Submission Testing

Before submitting to app stores, perform the following final checks:

### iOS

1. **App Store Guidelines**
   - Review [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
   - Ensure the app complies with all guidelines

2. **Privacy**
   - Verify privacy policy is accessible
   - Ensure all data collection is disclosed
   - Test App Tracking Transparency dialog

3. **Performance**
   - Test on oldest supported iOS version
   - Check memory usage
   - Verify background behavior

4. **Visual Design**
   - Verify app looks good on all screen sizes
   - Check dark mode support
   - Verify accessibility features

### Android

1. **Google Play Policies**
   - Review [Google Play Developer Program Policies](https://play.google.com/about/developer-content-policy/)
   - Ensure the app complies with all policies

2. **Privacy**
   - Verify privacy policy is accessible
   - Complete Data Safety section in Play Console
   - Ensure all permissions are justified

3. **Performance**
   - Test on oldest supported Android version
   - Test on low-end devices
   - Check battery usage

4. **Visual Design**
   - Verify app looks good on all screen sizes
   - Check dark mode support
   - Verify accessibility features

## Automated Testing Tools

The app uses the following testing tools:

- **Jest**: JavaScript testing framework
- **React Native Testing Library**: Testing utilities for React Native
- **Detox**: End-to-end testing framework
- **ESLint**: Static code analysis
- **GitHub Actions**: CI/CD pipeline

## Running End-to-End Tests

To run end-to-end tests with Detox:

### iOS

```bash
cd src/mobile
npm run e2e:build:ios
npm run e2e:test:ios
```

### Android

```bash
cd src/mobile
npm run e2e:build:android
npm run e2e:test:android
```

## Test Coverage

The goal is to maintain at least 80% test coverage for the app. The coverage report is generated when running:

```bash
npm run test:coverage
```

The report is available in the `coverage` directory.
