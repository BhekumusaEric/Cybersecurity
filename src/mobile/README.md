# Ethical Hacking LMS Mobile App

This is the React Native mobile application for the Ethical Hacking LMS platform. It provides a native mobile experience for students to access courses, labs, and assessments on iOS and Android devices.

## Features

- **Native Mobile Experience**: Built with React Native for optimal performance on mobile devices
- **Enhanced Offline Learning**: Download courses and labs for offline use with progress tracking and sync
- **Advanced Security**: Certificate pinning, jailbreak/root detection, and secure storage
- **Biometric Authentication**: Secure login with fingerprint or face recognition
- **Push Notifications**: Stay updated with course announcements and lab notifications
- **Mobile-Optimized Labs**: Touch-friendly lab interfaces designed for mobile devices
- **Camera Integration**: Document your lab work with device camera
- **Advanced Touch Gestures**: Pinch-to-zoom, swipe navigation, and more
- **Cross-Platform**: Works on both iOS and Android devices
- **Certificate Generation**: Earn and share certificates upon course completion
- **Analytics Dashboard**: Track your learning progress and performance
- **Download Manager**: Queue and manage downloads with progress tracking

## Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- React Native CLI
- Xcode (for iOS development)
- Android Studio (for Android development)
- CocoaPods (for iOS dependencies)

## Installation

1. Clone the repository
2. Navigate to the mobile app directory:
   ```
   cd src/mobile
   ```
3. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```
4. Install iOS dependencies (iOS development only):
   ```
   cd ios && pod install && cd ..
   ```

## Running the App

### iOS

```
npm run ios
# or
yarn ios
```

### Android

```
npm run android
# or
yarn android
```

## Project Structure

```
src/mobile/
├── android/                # Android native code
├── ios/                    # iOS native code
├── app_store_assets/       # Assets for app store listings
├── fastlane/               # Fastlane configuration for CI/CD
├── scripts/                # Build and release scripts
├── src/
│   ├── assets/             # Images, fonts, and other static assets
│   ├── components/         # Reusable UI components
│   │   ├── auth/           # Authentication-related components
│   │   ├── common/         # Common UI components
│   │   ├── courses/        # Course-related components
│   │   ├── labs/           # Lab-related components
│   │   └── navigation/     # Navigation components
│   ├── config/             # Configuration files
│   ├── context/            # React Context providers
│   │   ├── AuthContext.js  # Authentication state management
│   │   ├── OfflineContext.js # Offline content management
│   │   └── ThemeContext.js # Theme and appearance settings
│   ├── hooks/              # Custom React hooks
│   ├── navigation/         # Navigation configuration
│   ├── screens/            # Screen components
│   │   ├── auth/           # Authentication screens
│   │   └── main/           # Main app screens
│   ├── services/           # API and service functions
│   │   ├── api/            # API client and services
│   │   └── OfflineContentService.js # Offline content management
│   ├── tests/              # Test files
│   ├── utils/              # Utility functions
│   │   ├── analytics.js    # Analytics tracking
│   │   └── security.js     # Security utilities
│   └── App.js              # Main app component
├── .eslintrc.js            # ESLint configuration
├── .prettierrc.js          # Prettier configuration
├── app.json                # App configuration
├── babel.config.js         # Babel configuration
├── index.js                # Entry point
├── jest.config.js          # Jest test configuration
├── jest.setup.js           # Jest setup for mocking
├── metro.config.js         # Metro bundler configuration
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## Building for Production

### Android

1. Generate a signing key:
   ```
   keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Place the keystore file in `android/app`

3. Configure signing in `android/gradle.properties`:
   ```
   MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
   MYAPP_RELEASE_KEY_ALIAS=my-key-alias
   MYAPP_RELEASE_STORE_PASSWORD=*****
   MYAPP_RELEASE_KEY_PASSWORD=*****
   ```

4. Build the release APK:
   ```
   cd android
   ./gradlew assembleRelease
   ```

5. The APK will be generated at `android/app/build/outputs/apk/release/app-release.apk`

### iOS

1. Open the project in Xcode:
   ```
   cd ios
   open EthicalHackingLMS.xcworkspace
   ```

2. Select "Generic iOS Device" as the build target

3. Go to Product > Archive

4. Once the archive is created, the Organizer window will appear

5. Click "Distribute App" and follow the prompts to create an IPA file

## App Store Submission

To prepare the app for submission to app stores:

```bash
# First, set up the asset generation dependencies
npm run setup:assets

# Then prepare all assets for app store submission
npm run prepare:appstore
# or
yarn prepare:appstore
```

This process:
1. Checks and installs required dependencies (sharp, puppeteer)
2. Generates source assets if needed
3. Creates app icons and splash screens for all device sizes
4. Generates screenshots for app store listings
5. Sets up fastlane configuration for CI/CD

### Asset Generation

The app uses several scripts to generate assets:

- `setup:assets`: Checks and installs required dependencies
- `generate:source-assets`: Creates source SVG assets from templates
- `generate:assets`: Generates all app icons and splash screens
- `generate:screenshots`: Creates screenshots for app store listings
- `prepare:appstore`: Runs all of the above in sequence

See the `src/assets/source/README.md` file for additional instructions on preparing assets and metadata for app store submission.

## Testing

```
npm test
# or
yarn test
```

For test coverage report:
```
npm run test:coverage
# or
yarn test:coverage
```

For continuous testing during development:
```
npm run test:watch
# or
yarn test:watch
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
