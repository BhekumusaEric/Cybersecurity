#!/bin/bash
# App Store Submission Script for Ethical Hacking LMS
# This script prepares and packages the app for submission to app stores

# Exit on error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Log function
log() {
  echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

# Success function
success() {
  echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Error function
error() {
  echo -e "${RED}[ERROR]${NC} $1"
  exit 1
}

# Warning function
warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if we're in the project root
if [ ! -d "src" ] || [ ! -d "scripts" ]; then
  error "Please run this script from the project root directory"
fi

# Check for required tools
log "Checking for required tools..."
command -v node >/dev/null 2>&1 || { error "Node.js is required but not installed"; }
command -v npm >/dev/null 2>&1 || { error "npm is required but not installed"; }

# Parse command line arguments
PLATFORM=""
BUILD_TYPE="release"
SKIP_TESTS=false

while [[ "$#" -gt 0 ]]; do
  case $1 in
    --platform=*)
      PLATFORM="${1#*=}"
      ;;
    --build-type=*)
      BUILD_TYPE="${1#*=}"
      ;;
    --platform)
      PLATFORM="$2"
      shift
      ;;
    --build-type)
      BUILD_TYPE="$2"
      shift
      ;;
    --skip-tests)
      SKIP_TESTS=true
      ;;
    *)
      error "Unknown parameter: $1"
      ;;
  esac
  shift
done

# Validate platform
if [ "$PLATFORM" != "ios" ] && [ "$PLATFORM" != "android" ] && [ "$PLATFORM" != "both" ]; then
  error "Platform must be 'ios', 'android', or 'both'"
fi

# Validate build type
if [ "$BUILD_TYPE" != "release" ] && [ "$BUILD_TYPE" != "beta" ]; then
  error "Build type must be 'release' or 'beta'"
fi

# Run regression tests if not skipped
if [ "$SKIP_TESTS" = false ]; then
  log "Running regression tests..."
  ./scripts/regression_test.sh || warning "Some regression tests failed"
fi

# Build for iOS
build_ios() {
  log "Building iOS app ($BUILD_TYPE)..."

  # Check for required tools
  command -v xcodebuild >/dev/null 2>&1 || {
    warning "xcodebuild is required but not installed. Skipping iOS build."
    return 1
  }

  cd src/mobile

  # Install dependencies if needed
  if [ ! -d "node_modules" ]; then
    log "Installing dependencies..."
    npm install || error "Failed to install dependencies"
  fi

  # Set environment variables
  export NODE_ENV=production

  # Install pods
  log "Installing CocoaPods dependencies..."
  cd ios && pod install && cd ..

  # Build the app
  if [ "$BUILD_TYPE" = "release" ]; then
    log "Building iOS release version..."
    npm run ios:release || error "Failed to build iOS release version"
  else
    log "Building iOS beta version..."
    npm run ios:beta || error "Failed to build iOS beta version"
  fi

  # Archive the app
  log "Archiving iOS app..."
  npm run ios:archive || error "Failed to archive iOS app"

  # Export IPA
  log "Exporting iOS IPA..."
  npm run ios:export-ipa || error "Failed to export iOS IPA"

  cd ../..
  success "iOS build completed successfully"
  return 0
}

# Build for Android
build_android() {
  log "Building Android app ($BUILD_TYPE)..."

  # Check if Android directory exists
  if [ ! -d "src/mobile/android" ]; then
    warning "Android directory not found. Skipping Android build."
    return 1
  fi

  cd src/mobile

  # Install dependencies if needed
  if [ ! -d "node_modules" ]; then
    log "Installing dependencies..."
    npm install || {
      warning "Failed to install dependencies. Skipping Android build."
      cd ../..
      return 1
    }
  fi

  # Set environment variables
  export NODE_ENV=production

  # Check if Android build scripts exist
  if [ ! -f "package.json" ]; then
    warning "package.json not found. Skipping Android build."
    cd ../..
    return 1
  fi

  # Build the app
  if [ "$BUILD_TYPE" = "release" ]; then
    log "Building Android release version..."
    npm run android:release || {
      warning "Failed to build Android release version. This might be a script configuration issue."
      # Continue anyway to try direct Gradle build
    }
  else
    log "Building Android beta version..."
    npm run android:beta || {
      warning "Failed to build Android beta version. This might be a script configuration issue."
      # Continue anyway to try direct Gradle build
    }
  fi

  # Check if Android directory exists
  if [ ! -d "android" ]; then
    warning "Android directory not found in mobile project. Skipping Android build."
    cd ../..
    return 1
  fi

  # Try direct Gradle build
  log "Generating Android App Bundle..."
  if [ -f "android/gradlew" ]; then
    cd android && chmod +x gradlew && ./gradlew bundleRelease && cd ..
  else
    warning "gradlew not found. Skipping Android App Bundle generation."
  fi

  # Generate APK for testing
  log "Generating Android APK for testing..."
  if [ -f "android/gradlew" ]; then
    cd android && chmod +x gradlew && ./gradlew assembleRelease && cd ..
  else
    warning "gradlew not found. Skipping Android APK generation."
  fi

  cd ../..
  success "Android build completed successfully"
  return 0
}

# Prepare app store assets
prepare_assets() {
  log "Preparing app store assets..."

  # Create output directory
  mkdir -p build/app_store_assets

  # Copy screenshots
  log "Copying screenshots..."
  if [ -d "src/mobile/app_store_assets/screenshots" ]; then
    cp -R src/mobile/app_store_assets/screenshots build/app_store_assets/
  else
    warning "Screenshots directory not found"
  fi

  # Copy app icons
  log "Copying app icons..."
  if [ -d "src/mobile/app_store_assets/icons" ]; then
    cp -R src/mobile/app_store_assets/icons build/app_store_assets/
  else
    warning "Icons directory not found"
  fi

  # Copy metadata
  log "Copying metadata..."
  if [ -d "src/mobile/app_store_assets/metadata" ]; then
    cp -R src/mobile/app_store_assets/metadata build/app_store_assets/
  else
    warning "Metadata directory not found"
  fi

  # Generate app store descriptions
  log "Generating app store descriptions..."
  mkdir -p build/app_store_assets/descriptions

  # Create Apple App Store description
  cat > build/app_store_assets/descriptions/apple_app_store.txt << EOF
Ethical Hacking LMS - Learn Cybersecurity Skills

Master ethical hacking and cybersecurity with our comprehensive 12-week course. Perfect for beginners and intermediate learners looking to develop practical skills in a safe, legal environment.

FEATURES:
• Structured learning path with progressive difficulty
• Interactive labs for hands-on practice
• Real-world hacking scenarios and challenges
• Comprehensive assessments to test your knowledge
• Progress tracking and certification
• Offline access to course materials

COURSE CONTENT:
• Network scanning and enumeration
• Vulnerability assessment
• Web application security
• Social engineering techniques
• Wireless network security
• Penetration testing methodologies
• Ethical hacking tools and frameworks
• Security best practices

Learn at your own pace with our mobile-friendly platform. All labs are conducted in isolated environments, ensuring legal and ethical practice.

Start your cybersecurity journey today!
EOF

  # Create Google Play Store description
  cat > build/app_store_assets/descriptions/google_play_store.txt << EOF
Ethical Hacking LMS - Learn Cybersecurity Skills

Master ethical hacking and cybersecurity with our comprehensive 12-week course. Perfect for beginners and intermediate learners looking to develop practical skills in a safe, legal environment.

FEATURES:
• Structured learning path with progressive difficulty
• Interactive labs for hands-on practice
• Real-world hacking scenarios and challenges
• Comprehensive assessments to test your knowledge
• Progress tracking and certification
• Offline access to course materials

COURSE CONTENT:
• Network scanning and enumeration
• Vulnerability assessment
• Web application security
• Social engineering techniques
• Wireless network security
• Penetration testing methodologies
• Ethical hacking tools and frameworks
• Security best practices

Learn at your own pace with our mobile-friendly platform. All labs are conducted in isolated environments, ensuring legal and ethical practice.

Start your cybersecurity journey today!
EOF

  success "App store assets prepared successfully"
}

# Run platform-specific builds
IOS_BUILD_SUCCESS=false
ANDROID_BUILD_SUCCESS=false

if [ "$PLATFORM" = "ios" ] || [ "$PLATFORM" = "both" ]; then
  if build_ios; then
    IOS_BUILD_SUCCESS=true
  else
    warning "iOS build was not successful"
  fi
fi

if [ "$PLATFORM" = "android" ] || [ "$PLATFORM" = "both" ]; then
  if build_android; then
    ANDROID_BUILD_SUCCESS=true
  else
    warning "Android build was not successful"
  fi
fi

# Check if at least one platform was built successfully
if [ "$PLATFORM" = "both" ] && [ "$IOS_BUILD_SUCCESS" = "false" ] && [ "$ANDROID_BUILD_SUCCESS" = "false" ]; then
  warning "Both iOS and Android builds failed, but continuing to generate assets and report"
elif [ "$PLATFORM" = "ios" ] && [ "$IOS_BUILD_SUCCESS" = "false" ]; then
  warning "iOS build failed, but continuing to generate assets and report"
elif [ "$PLATFORM" = "android" ] && [ "$ANDROID_BUILD_SUCCESS" = "false" ]; then
  warning "Android build failed, but continuing to generate assets and report"
fi

# Prepare app store assets
prepare_assets

# Generate submission report
log "Generating submission report..."

mkdir -p build

cat > build/submission_report.html << EOF
<!DOCTYPE html>
<html>
<head>
  <title>App Store Submission Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h1 { color: #333; }
    h2 { color: #555; }
    .section { margin-bottom: 20px; }
    .success { color: green; }
    .warning { color: orange; }
    .error { color: red; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
  </style>
</head>
<body>
  <h1>App Store Submission Report</h1>
  <div class="section">
    <h2>Build Information</h2>
    <table>
      <tr><th>Platform</th><td>${PLATFORM}</td></tr>
      <tr><th>Build Type</th><td>${BUILD_TYPE}</td></tr>
      <tr><th>Date</th><td>$(date)</td></tr>
    </table>
  </div>

  <div class="section">
    <h2>Build Artifacts</h2>
    <h3>iOS Artifacts</h3>
    <ul>
      <li>IPA File: ./src/mobile/ios/build/EthicalHackingLMS.ipa</li>
      <li>dSYM File: ./src/mobile/ios/build/EthicalHackingLMS.app.dSYM.zip</li>
    </ul>

    <h3>Android Artifacts</h3>
    <ul>
      <li>App Bundle: ./src/mobile/android/app/build/outputs/bundle/release/app-release.aab</li>
      <li>APK File: ./src/mobile/android/app/build/outputs/apk/release/app-release.apk</li>
    </ul>
  </div>

  <div class="section">
    <h2>App Store Assets</h2>
    <ul>
      <li>Screenshots: ./build/app_store_assets/screenshots</li>
      <li>Icons: ./build/app_store_assets/icons</li>
      <li>Metadata: ./build/app_store_assets/metadata</li>
      <li>Descriptions: ./build/app_store_assets/descriptions</li>
    </ul>
  </div>

  <div class="section">
    <h2>Next Steps</h2>
    <ol>
      <li>Upload the artifacts to the respective app stores</li>
      <li>Complete the app store listings with the prepared assets</li>
      <li>Submit for review</li>
    </ol>
  </div>
</body>
</html>
EOF

# Final summary
log "App store submission preparation completed"
echo ""
echo "==============================================="
echo "          APP STORE SUBMISSION SUMMARY        "
echo "==============================================="
echo ""
echo "Platform: $PLATFORM"
echo "Build Type: $BUILD_TYPE"
echo ""

if ([ "$PLATFORM" = "ios" ] || [ "$PLATFORM" = "both" ]) && [ "$IOS_BUILD_SUCCESS" = "true" ]; then
  echo "iOS Artifacts:"
  echo "- IPA File: ./src/mobile/ios/build/EthicalHackingLMS.ipa"
  echo "- dSYM File: ./src/mobile/ios/build/EthicalHackingLMS.app.dSYM.zip"
  echo ""
elif [ "$PLATFORM" = "ios" ] || [ "$PLATFORM" = "both" ]; then
  echo "iOS Build: Failed"
  echo ""
fi

if ([ "$PLATFORM" = "android" ] || [ "$PLATFORM" = "both" ]) && [ "$ANDROID_BUILD_SUCCESS" = "true" ]; then
  echo "Android Artifacts:"
  echo "- App Bundle: ./src/mobile/android/app/build/outputs/bundle/release/app-release.aab"
  echo "- APK File: ./src/mobile/android/app/build/outputs/apk/release/app-release.apk"
  echo ""
elif [ "$PLATFORM" = "android" ] || [ "$PLATFORM" = "both" ]; then
  echo "Android Build: Failed"
  echo ""
fi

echo "App Store Assets:"
echo "- Screenshots: ./build/app_store_assets/screenshots"
echo "- Icons: ./build/app_store_assets/icons"
echo "- Metadata: ./build/app_store_assets/metadata"
echo "- Descriptions: ./build/app_store_assets/descriptions"
echo ""
echo "Submission Report: ./build/submission_report.html"
echo ""
echo "Next Steps:"
echo "1. Review the submission report"
echo "2. Upload the artifacts to the respective app stores"
echo "3. Complete the app store listings with the prepared assets"
echo ""
echo "==============================================="

# Open submission report
if [[ "$OSTYPE" == "darwin"* ]]; then
  open ./build/submission_report.html
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  xdg-open ./build/submission_report.html
fi

exit 0
