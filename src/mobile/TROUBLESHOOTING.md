# Troubleshooting Guide for Ethical Hacking LMS Mobile App

This guide provides solutions for common issues you might encounter when developing, building, or deploying the Ethical Hacking LMS mobile app.

## Table of Contents

1. [Development Environment Issues](#development-environment-issues)
2. [Build Issues](#build-issues)
3. [Asset Generation Issues](#asset-generation-issues)
4. [Testing Issues](#testing-issues)
5. [App Store Submission Issues](#app-store-submission-issues)

## Development Environment Issues

### Metro Bundler Won't Start

**Symptoms**: Error when running `npm start` or `yarn start`.

**Solutions**:
1. Clear Metro cache:
   ```bash
   npx react-native start --reset-cache
   ```
2. Check if port 8081 is already in use:
   ```bash
   lsof -i :8081
   # Kill the process if needed
   kill -9 <PID>
   ```

### Android Emulator Issues

**Symptoms**: App won't install or crashes immediately on Android emulator.

**Solutions**:
1. Verify that Android SDK is properly set up in your environment variables
2. Try a different emulator image (API level 29 or 30 recommended)
3. Increase memory allocation for the emulator
4. Check for conflicting Android packages in your project

### iOS Simulator Issues

**Symptoms**: App won't build or install on iOS simulator.

**Solutions**:
1. Make sure Xcode is up to date
2. Reinstall CocoaPods dependencies:
   ```bash
   cd ios
   pod deintegrate
   pod install
   ```
3. Clean the build folder in Xcode (Product > Clean Build Folder)

## Build Issues

### Android Build Failures

**Symptoms**: `./gradlew assembleRelease` fails with errors.

**Solutions**:
1. Check your Java version (JDK 11 recommended)
2. Verify that the keystore file is in the correct location
3. Check that the signing configuration is correct in `gradle.properties`
4. Increase Gradle memory:
   ```
   # In android/gradle.properties
   org.gradle.jvmargs=-Xmx4096m -XX:MaxPermSize=1024m
   ```

### iOS Build Failures

**Symptoms**: Xcode build fails with errors.

**Solutions**:
1. Check that all required certificates and provisioning profiles are installed
2. Verify that the bundle identifier matches your provisioning profile
3. Update CocoaPods:
   ```bash
   sudo gem install cocoapods
   cd ios
   pod install
   ```

## Asset Generation Issues

### Missing Dependencies

**Symptoms**: Asset generation scripts fail with errors about missing modules.

**Solutions**:
1. Run the setup script to install required dependencies:
   ```bash
   npm run setup:assets
   ```
2. If issues persist, try installing dependencies globally:
   ```bash
   npm install -g sharp puppeteer
   ```
3. For Linux users, you might need additional system dependencies:
   ```bash
   sudo apt-get install -y libvips-dev
   ```

### Sharp Module Issues

**Symptoms**: Errors related to the Sharp module during asset generation.

**Solutions**:
1. Reinstall Sharp with specific version:
   ```bash
   npm uninstall sharp
   npm install sharp@0.32.5
   ```
2. Check for platform-specific issues:
   - On macOS, you might need to install libvips: `brew install vips`
   - On Windows, you might need to install build tools: `npm install --global windows-build-tools`

### Puppeteer Issues

**Symptoms**: Errors related to Puppeteer or Chrome during screenshot generation.

**Solutions**:
1. Reinstall Puppeteer:
   ```bash
   npm uninstall puppeteer
   npm install puppeteer@21.1.1
   ```
2. For Linux users, you might need additional dependencies:
   ```bash
   sudo apt-get install -y \
     gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 \
     libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 \
     libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 \
     libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 \
     libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates \
     fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
   ```

## Testing Issues

### Jest Test Failures

**Symptoms**: Unit tests fail with errors.

**Solutions**:
1. Update Jest configuration:
   ```bash
   # Check if jest.config.js is properly configured
   # Make sure transformIgnorePatterns is set correctly
   ```
2. Check for missing mock implementations in `jest.setup.js`
3. Run tests with verbose output to identify specific issues:
   ```bash
   npm test -- --verbose
   ```

### End-to-End Test Failures

**Symptoms**: Detox tests fail to run or complete.

**Solutions**:
1. Make sure Detox is properly installed:
   ```bash
   npm install -g detox-cli
   ```
2. Check that the emulator/simulator specified in `.detoxrc.js` is available
3. Rebuild the test app before running tests:
   ```bash
   npm run e2e:build:ios
   # or
   npm run e2e:build:android
   ```

## App Store Submission Issues

### App Store Connect Errors

**Symptoms**: App rejected during submission process.

**Solutions**:
1. Verify that all required app metadata is complete
2. Check that privacy policy URL is valid
3. Ensure all app permissions have proper usage descriptions
4. Verify that app icons and screenshots meet Apple's requirements

### Google Play Store Errors

**Symptoms**: App rejected during submission process.

**Solutions**:
1. Verify that the app meets Google's target API level requirements
2. Ensure the app has proper content ratings
3. Check that the app's permissions are justified in the submission
4. Verify that the app meets Google's privacy policy requirements

## Additional Resources

- [React Native Troubleshooting Guide](https://reactnative.dev/docs/troubleshooting)
- [Detox Troubleshooting](https://wix.github.io/Detox/docs/troubleshooting/running-tests)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policy Center](https://play.google.com/about/developer-content-policy/)
