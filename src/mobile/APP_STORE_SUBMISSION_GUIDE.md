# App Store Submission Guide

This guide provides step-by-step instructions for submitting the Ethical Hacking LMS mobile app to the Apple App Store and Google Play Store.

## Prerequisites

Before you begin, make sure you have:

1. **Developer Accounts**:
   - Apple Developer Program account ($99/year)
   - Google Play Developer account ($25 one-time fee)

2. **Required Tools**:
   - Node.js and npm
   - Ruby and Bundler (for Fastlane)
   - Xcode (for iOS, macOS only)
   - Android Studio (for Android)

3. **Certificates and Keys**:
   - iOS: App Store Connect API Key
   - Android: Keystore file for app signing

## Step 1: Prepare Source Assets

The app requires the following source assets:

- `src/assets/source/icon.png`: Main app icon (1024x1024 PNG)
- `src/assets/source/splash.png`: Splash screen image (2732x2732 PNG)
- `src/assets/source/adaptive-icon-foreground.png`: Android adaptive icon foreground (432x432 PNG)
- `src/assets/source/adaptive-icon-background.png`: Android adaptive icon background (432x432 PNG)

Create these files with appropriate designs for your app.

## Step 2: Install Dependencies

```bash
cd src/mobile
npm install
bundle install
```

## Step 3: Generate App Assets

Run the asset generation scripts to create all required app icons, splash screens, and screenshots:

```bash
npm run generate:source-assets
npm run generate:assets
npm run generate:screenshots
```

Or use the combined command:

```bash
npm run prepare:appstore
```

## Step 4: Build and Submit the App

### Using the Automated Script

We've provided a script that automates the build and submission process:

```bash
./scripts/app_store_submission.sh --platform=both --build-type=release
```

Options:
- `--platform`: Choose `ios`, `android`, or `both`
- `--build-type`: Choose `beta` or `release`

### Manual Submission

#### For iOS:

1. **Build the App**:
   ```bash
   cd ios
   pod install
   cd ..
   npm run build:ios
   ```

2. **Deploy to App Store**:
   ```bash
   npm run deploy:ios:release
   ```

#### For Android:

1. **Build the App**:
   ```bash
   npm run build:android
   ```

2. **Deploy to Google Play Store**:
   ```bash
   npm run deploy:android:release
   ```

## Step 5: Complete App Store Listings

After uploading your app, you need to complete the app store listings:

1. **Log in to the app store consoles**:
   - [App Store Connect](https://appstoreconnect.apple.com/)
   - [Google Play Console](https://play.google.com/console/)

2. **Complete any remaining information**:
   - App category
   - Content rating
   - Pricing and availability
   - App review information

3. **Submit for review**:
   - Follow the prompts to submit your app for review
   - Be prepared to answer any questions from the review team

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check that all dependencies are installed
   - Verify that the correct version of Node.js is being used
   - Ensure that CocoaPods is up to date (for iOS)

2. **Submission Rejections**:
   - Review the rejection reason carefully
   - Address all issues mentioned in the rejection
   - Test thoroughly before resubmitting

3. **Certificate Issues**:
   - Ensure your certificates are valid and not expired
   - Check that your provisioning profiles are correctly set up
   - Verify that your Apple Developer account has the correct permissions

### Getting Help

If you encounter issues with the submission process, check the following resources:

- [Fastlane Documentation](https://docs.fastlane.tools/)
- [Apple Developer Forums](https://developer.apple.com/forums/)
- [Google Play Developer Help](https://support.google.com/googleplay/android-developer/)

## Checklist Before Submission

- [ ] App icon and splash screen are properly set up
- [ ] App metadata is complete and accurate
- [ ] Screenshots are up to date and show the latest UI
- [ ] Privacy policy is in place and accessible
- [ ] Terms of service are in place and accessible
- [ ] App has been thoroughly tested on multiple devices
- [ ] All required permissions are justified and documented
- [ ] App complies with all platform-specific guidelines
- [ ] Release notes are clear and describe the latest changes
