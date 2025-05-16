# App Store Submission Guide

This document provides instructions for preparing and submitting the Ethical Hacking LMS mobile app to the Apple App Store and Google Play Store.

## Prerequisites

### Apple App Store

1. **Apple Developer Account**: You need an active Apple Developer Program membership ($99/year).
2. **App Store Connect Account**: Set up your app in App Store Connect.
3. **Certificates and Provisioning Profiles**: Set up using Fastlane Match.
4. **App Review Guidelines**: Familiarize yourself with [Apple's App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/).

### Google Play Store

1. **Google Play Developer Account**: You need a Google Play Developer account ($25 one-time fee).
2. **Google Play Console**: Set up your app in the Google Play Console.
3. **Signing Key**: Generate and secure your app signing key.
4. **Developer Program Policies**: Familiarize yourself with [Google Play's Developer Program Policies](https://play.google.com/about/developer-content-policy/).

## Automated Submission Process

We use GitHub Actions and Fastlane to automate the app submission process.

### Setting Up Secrets

Add the following secrets to your GitHub repository:

#### For iOS:
- `APPLE_API_KEY_ID`: Your App Store Connect API Key ID
- `APPLE_API_KEY_ISSUER_ID`: Your App Store Connect API Key Issuer ID
- `APPLE_API_KEY_CONTENT`: Your App Store Connect API Key content (p8 file)
- `MATCH_PASSWORD`: Password for your Match repository
- `MATCH_GIT_URL`: URL to your Match Git repository
- `FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD`: App-specific password for your Apple ID

#### For Android:
- `ANDROID_KEYSTORE_BASE64`: Base64-encoded Android keystore file
- `ANDROID_KEYSTORE_PASSWORD`: Password for your Android keystore
- `ANDROID_KEY_ALIAS`: Key alias in your Android keystore
- `ANDROID_KEY_PASSWORD`: Password for your key
- `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`: Google Play service account JSON key

### Triggering Deployment

You can trigger the deployment workflow in two ways:

1. **Automatically**: Push to the main branch.
2. **Manually**: Use the GitHub Actions workflow dispatch with the following parameters:
   - `platform`: Choose `ios`, `android`, or `both`
   - `track`: Choose `beta` or `production`

## Manual Submission Process

If you need to submit the app manually, follow these steps:

### Apple App Store

1. **Generate Assets**:
   ```bash
   cd src/mobile
   npm install
   node scripts/generate-assets.js
   ```

2. **Build the App**:
   ```bash
   cd ios
   pod install
   cd ..
   npm run build:ios
   ```

3. **Upload to App Store Connect**:
   - Open Xcode
   - Select Product > Archive
   - Use the Organizer to upload the archive to App Store Connect

4. **Submit for Review**:
   - Log in to [App Store Connect](https://appstoreconnect.apple.com/)
   - Navigate to your app
   - Complete all required information
   - Submit for review

### Google Play Store

1. **Generate Assets**:
   ```bash
   cd src/mobile
   npm install
   node scripts/generate-assets.js
   ```

2. **Build the App**:
   ```bash
   cd android
   ./gradlew bundleRelease
   ```

3. **Upload to Google Play Console**:
   - Log in to [Google Play Console](https://play.google.com/console/)
   - Navigate to your app
   - Go to Production > Create new release
   - Upload the AAB file from `android/app/build/outputs/bundle/release/app-release.aab`
   - Complete all required information
   - Submit for review

## App Store Metadata

All app store metadata is stored in the `fastlane/metadata` directory:

- `en-US/name.txt`: App name
- `en-US/subtitle.txt`: App subtitle (iOS only)
- `en-US/description.txt`: Full app description
- `en-US/keywords.txt`: Keywords for App Store search (iOS only)
- `en-US/promotional_text.txt`: Promotional text that can be updated without app review (iOS only)
- `en-US/release_notes.txt`: Release notes for app updates
- `en-US/privacy_url.txt`: URL to your privacy policy
- `en-US/support_url.txt`: URL to your support page
- `en-US/marketing_url.txt`: URL to your marketing website

## Screenshots

App store screenshots are generated automatically using the `scripts/generate-screenshots.js` script. This script captures screenshots of the app in various device sizes for both iOS and Android.

To generate screenshots manually:

```bash
cd src/mobile
npm install
node scripts/generate-screenshots.js
```

Screenshots are saved to:
- `src/assets/screenshots/ios/`: iOS screenshots
- `src/assets/screenshots/android/`: Android screenshots

## App Icons and Splash Screens

App icons and splash screens are generated automatically using the `scripts/generate-assets.js` script. This script creates all required sizes for both iOS and Android from the source files.

Source files are located in:
- `src/assets/source/icon.png`: Main app icon (1024x1024 PNG)
- `src/assets/source/splash.png`: Splash screen image (2732x2732 PNG)
- `src/assets/source/adaptive-icon-foreground.png`: Android adaptive icon foreground (432x432 PNG)
- `src/assets/source/adaptive-icon-background.png`: Android adaptive icon background (432x432 PNG)

## Troubleshooting

### Common Issues

1. **Certificate Errors**:
   - Ensure your certificates are valid and not expired
   - Check that your provisioning profiles are correctly set up
   - Verify that your Apple Developer account has the correct permissions

2. **Build Errors**:
   - Check that all dependencies are installed
   - Verify that the correct version of Node.js is being used
   - Ensure that CocoaPods is up to date (for iOS)

3. **Submission Rejections**:
   - Review the rejection reason carefully
   - Address all issues mentioned in the rejection
   - Test thoroughly before resubmitting

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
