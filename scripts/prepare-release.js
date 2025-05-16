/**
 * Script to prepare the app for release
 * 
 * This script:
 * 1. Generates app icons and splash screens for all device sizes
 * 2. Updates version numbers
 * 3. Creates release notes
 * 4. Prepares app store metadata
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const packageJson = require('../package.json');

// Configuration
const APP_NAME = 'Ethical Hacking LMS';
const APP_DESCRIPTION = 'Learn ethical hacking with interactive labs and courses';
const APP_KEYWORDS = 'ethical hacking,cybersecurity,education,labs,courses';
const APP_CATEGORY = 'Education';
const APP_PRIVACY_POLICY_URL = 'https://ethicalhackinglms.com/privacy';
const APP_WEBSITE = 'https://ethicalhackinglms.com';
const APP_SUPPORT_URL = 'https://ethicalhackinglms.com/support';
const APP_MARKETING_URL = 'https://ethicalhackinglms.com';

// Create directories if they don't exist
const createDirIfNotExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
};

// Main function
const prepareRelease = async () => {
  try {
    console.log('Preparing app for release...');
    
    // Create necessary directories
    createDirIfNotExists(path.join(__dirname, '../fastlane'));
    createDirIfNotExists(path.join(__dirname, '../fastlane/metadata'));
    createDirIfNotExists(path.join(__dirname, '../fastlane/metadata/android'));
    createDirIfNotExists(path.join(__dirname, '../fastlane/metadata/ios'));
    createDirIfNotExists(path.join(__dirname, '../fastlane/screenshots'));
    
    // Generate app icons and splash screens
    console.log('Generating app icons and splash screens...');
    try {
      execSync('npx react-native-asset-generator', { stdio: 'inherit' });
      console.log('✅ Generated app icons and splash screens');
    } catch (error) {
      console.error('❌ Failed to generate app icons and splash screens');
      console.error('Make sure you have installed the required dependencies:');
      console.error('npm install -g react-native-asset-generator sharp puppeteer');
      console.error(error);
    }
    
    // Create app store metadata
    console.log('Creating app store metadata...');
    
    // Android metadata
    createDirIfNotExists(path.join(__dirname, '../fastlane/metadata/android/en-US'));
    fs.writeFileSync(
      path.join(__dirname, '../fastlane/metadata/android/en-US/full_description.txt'),
      `${APP_DESCRIPTION}\n\nFeatures:\n- Interactive ethical hacking courses\n- Hands-on lab environments\n- Progress tracking\n- Offline access to course content\n- Certification upon completion`
    );
    fs.writeFileSync(
      path.join(__dirname, '../fastlane/metadata/android/en-US/short_description.txt'),
      APP_DESCRIPTION.substring(0, 80)
    );
    fs.writeFileSync(
      path.join(__dirname, '../fastlane/metadata/android/en-US/title.txt'),
      APP_NAME
    );
    fs.writeFileSync(
      path.join(__dirname, '../fastlane/metadata/android/en-US/video.txt'),
      ''
    );
    
    // iOS metadata
    createDirIfNotExists(path.join(__dirname, '../fastlane/metadata/ios/en-US'));
    fs.writeFileSync(
      path.join(__dirname, '../fastlane/metadata/ios/en-US/description.txt'),
      `${APP_DESCRIPTION}\n\nFeatures:\n- Interactive ethical hacking courses\n- Hands-on lab environments\n- Progress tracking\n- Offline access to course content\n- Certification upon completion`
    );
    fs.writeFileSync(
      path.join(__dirname, '../fastlane/metadata/ios/en-US/keywords.txt'),
      APP_KEYWORDS
    );
    fs.writeFileSync(
      path.join(__dirname, '../fastlane/metadata/ios/en-US/marketing_url.txt'),
      APP_MARKETING_URL
    );
    fs.writeFileSync(
      path.join(__dirname, '../fastlane/metadata/ios/en-US/name.txt'),
      APP_NAME
    );
    fs.writeFileSync(
      path.join(__dirname, '../fastlane/metadata/ios/en-US/privacy_url.txt'),
      APP_PRIVACY_POLICY_URL
    );
    fs.writeFileSync(
      path.join(__dirname, '../fastlane/metadata/ios/en-US/promotional_text.txt'),
      'Master the art of ethical hacking with our comprehensive courses and hands-on labs.'
    );
    fs.writeFileSync(
      path.join(__dirname, '../fastlane/metadata/ios/en-US/release_notes.txt'),
      `Version ${packageJson.version}:\n- Enhanced security features\n- Improved offline capabilities\n- Better performance and stability\n- Bug fixes and UI improvements`
    );
    fs.writeFileSync(
      path.join(__dirname, '../fastlane/metadata/ios/en-US/subtitle.txt'),
      'Learn Ethical Hacking'
    );
    fs.writeFileSync(
      path.join(__dirname, '../fastlane/metadata/ios/en-US/support_url.txt'),
      APP_SUPPORT_URL
    );
    
    console.log('✅ Created app store metadata');
    
    // Create Fastfile for CI/CD
    console.log('Creating Fastfile for CI/CD...');
    createDirIfNotExists(path.join(__dirname, '../fastlane'));
    fs.writeFileSync(
      path.join(__dirname, '../fastlane/Fastfile'),
      `# Fastfile for Ethical Hacking LMS
# This file contains the fastlane.tools configuration

default_platform(:ios)

platform :ios do
  desc "Build and upload to TestFlight"
  lane :beta do
    increment_build_number(xcodeproj: "ios/EthicalHackingLMS.xcodeproj")
    build_app(workspace: "ios/EthicalHackingLMS.xcworkspace", scheme: "EthicalHackingLMS")
    upload_to_testflight
  end

  desc "Build and upload to App Store"
  lane :release do
    increment_build_number(xcodeproj: "ios/EthicalHackingLMS.xcodeproj")
    build_app(workspace: "ios/EthicalHackingLMS.xcworkspace", scheme: "EthicalHackingLMS")
    upload_to_app_store(
      skip_metadata: false,
      skip_screenshots: false,
      skip_binary_upload: false
    )
  end
end

platform :android do
  desc "Build and upload to Play Store internal testing track"
  lane :beta do
    gradle(task: "clean assembleRelease", project_dir: "android/")
    upload_to_play_store(track: 'internal')
  end

  desc "Build and upload to Play Store production"
  lane :release do
    gradle(task: "clean assembleRelease", project_dir: "android/")
    upload_to_play_store(track: 'production')
  end
end`
    );
    
    console.log('✅ Created Fastfile for CI/CD');
    
    console.log('✅ App prepared for release!');
    console.log(`\nNext steps:
1. Run tests: npm test
2. Build the app: 
   - iOS: cd ios && pod install && cd .. && npx react-native run-ios --configuration Release
   - Android: npx react-native run-android --variant=release
3. Submit to app stores:
   - iOS: npx fastlane ios beta
   - Android: npx fastlane android beta`);
    
  } catch (error) {
    console.error('❌ Failed to prepare app for release:', error);
    process.exit(1);
  }
};

// Run the script
prepareRelease();
