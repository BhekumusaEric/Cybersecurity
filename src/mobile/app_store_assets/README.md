# App Store Assets

This directory contains assets required for publishing the app to the Google Play Store and Apple App Store.

## App Icons

The following app icons are required:

### Android (Google Play Store)
- `icon-mdpi.png` - 48x48 px
- `icon-hdpi.png` - 72x72 px
- `icon-xhdpi.png` - 96x96 px
- `icon-xxhdpi.png` - 144x144 px
- `icon-xxxhdpi.png` - 192x192 px
- `store-icon.png` - 512x512 px (for Google Play listing)
- `feature-graphic.png` - 1024x500 px (for Google Play feature graphic)

### iOS (Apple App Store)
- `icon-20.png` - 20x20 px
- `icon-29.png` - 29x29 px
- `icon-40.png` - 40x40 px
- `icon-60.png` - 60x60 px
- `icon-76.png` - 76x76 px
- `icon-83.5.png` - 83.5x83.5 px
- `icon-1024.png` - 1024x1024 px (for App Store listing)

## Screenshots

The following screenshots are required for app store listings:

### Android (Google Play Store)
- Phone screenshots (minimum 2):
  - `screenshot-phone-1.png` - 1080x1920 px
  - `screenshot-phone-2.png` - 1080x1920 px
  - `screenshot-phone-3.png` - 1080x1920 px
  - `screenshot-phone-4.png` - 1080x1920 px
  - `screenshot-phone-5.png` - 1080x1920 px

- Tablet screenshots (optional):
  - `screenshot-tablet-1.png` - 1920x1200 px
  - `screenshot-tablet-2.png` - 1920x1200 px
  - `screenshot-tablet-3.png` - 1920x1200 px

### iOS (Apple App Store)
- iPhone screenshots (minimum 1):
  - `screenshot-iphone-5.5-1.png` - 1242x2208 px
  - `screenshot-iphone-5.5-2.png` - 1242x2208 px
  - `screenshot-iphone-5.5-3.png` - 1242x2208 px
  - `screenshot-iphone-6.5-1.png` - 1242x2688 px
  - `screenshot-iphone-6.5-2.png` - 1242x2688 px
  - `screenshot-iphone-6.5-3.png` - 1242x2688 px

- iPad screenshots (optional):
  - `screenshot-ipad-12.9-1.png` - 2048x2732 px
  - `screenshot-ipad-12.9-2.png` - 2048x2732 px
  - `screenshot-ipad-12.9-3.png` - 2048x2732 px

## App Store Metadata

### Google Play Store
- App name: Ethical Hacking LMS
- Short description (80 characters max): Learn ethical hacking with hands-on labs and interactive courses.
- Full description (4000 characters max): See `google-play-description.txt`
- App category: Education
- Content rating: Teen
- Privacy policy URL: https://example.com/privacy-policy

### Apple App Store
- App name: Ethical Hacking LMS
- Subtitle (30 characters max): Hands-on cybersecurity training
- Description (4000 characters max): See `app-store-description.txt`
- App category: Education
- Content rating: 12+
- Privacy policy URL: https://example.com/privacy-policy

## Splash Screen

The splash screen assets are located in the `splash` directory:
- `splash-hdpi.png` - 480x800 px
- `splash-mdpi.png` - 320x480 px
- `splash-xhdpi.png` - 720x1280 px
- `splash-xxhdpi.png` - 960x1600 px
- `splash-xxxhdpi.png` - 1280x1920 px

## App Signing

### Android
- Keystore file: `ethical-hacking-lms.keystore` (not included in repository for security reasons)
- Keystore password: (stored securely in password manager)
- Key alias: ethical-hacking-lms-key
- Key password: (stored securely in password manager)

### iOS
- Apple Developer Program membership required
- Certificates and provisioning profiles managed through Xcode

## Build Instructions

See the main README.md file for instructions on building and signing the app for release.
