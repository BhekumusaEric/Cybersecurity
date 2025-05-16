#!/bin/bash

# App Store Submission Script
# This script automates the process of preparing and submitting the app to the Apple App Store and Google Play Store

# Parse command line arguments
PLATFORM="both"
BUILD_TYPE="beta"

while [[ "$#" -gt 0 ]]; do
    case $1 in
        --platform=*) PLATFORM="${1#*=}" ;;
        --build-type=*) BUILD_TYPE="${1#*=}" ;;
        *) echo "Unknown parameter: $1"; exit 1 ;;
    esac
    shift
done

# Validate arguments
if [[ "$PLATFORM" != "ios" && "$PLATFORM" != "android" && "$PLATFORM" != "both" ]]; then
    echo "Error: Platform must be 'ios', 'android', or 'both'"
    exit 1
fi

if [[ "$BUILD_TYPE" != "beta" && "$BUILD_TYPE" != "release" ]]; then
    echo "Error: Build type must be 'beta' or 'release'"
    exit 1
fi

# Navigate to the mobile app directory
cd "$(dirname "$0")/.." || exit 1
echo "Working directory: $(pwd)"

# Check if required tools are installed
echo "Checking required tools..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed"
    exit 1
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed"
    exit 1
fi

# Check Ruby and Bundler for Fastlane
if ! command -v ruby &> /dev/null; then
    echo "Error: Ruby is not installed"
    exit 1
fi

if ! command -v bundle &> /dev/null; then
    echo "Error: Bundler is not installed. Installing..."
    gem install bundler
fi

# Install dependencies
echo "Installing dependencies..."
npm install
bundle install

# Generate assets
echo "Generating app assets..."
npm run generate:source-assets
npm run generate:assets
npm run generate:screenshots

# Build and deploy based on platform and build type
if [[ "$PLATFORM" == "ios" || "$PLATFORM" == "both" ]]; then
    echo "Preparing iOS app..."
    
    # Check if Xcode is installed (macOS only)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if ! command -v xcodebuild &> /dev/null; then
            echo "Error: Xcode is not installed"
            exit 1
        fi
        
        # Install CocoaPods dependencies
        echo "Installing CocoaPods dependencies..."
        cd ios || exit 1
        pod install
        cd .. || exit 1
        
        # Build iOS app
        echo "Building iOS app..."
        if [[ "$BUILD_TYPE" == "beta" ]]; then
            npm run deploy:ios:beta
        else
            npm run deploy:ios:release
        fi
    else
        echo "Warning: iOS builds can only be performed on macOS"
    fi
fi

if [[ "$PLATFORM" == "android" || "$PLATFORM" == "both" ]]; then
    echo "Preparing Android app..."
    
    # Check if Android SDK is installed
    if [[ -z "$ANDROID_HOME" ]]; then
        echo "Warning: ANDROID_HOME environment variable is not set"
    fi
    
    # Build Android app
    echo "Building Android app..."
    if [[ "$BUILD_TYPE" == "beta" ]]; then
        npm run deploy:android:beta
    else
        npm run deploy:android:release
    fi
fi

echo "App store submission process completed!"
echo "Platform: $PLATFORM"
echo "Build type: $BUILD_TYPE"

# Provide next steps
echo ""
echo "Next steps:"
echo "1. Check the build logs for any errors"
echo "2. Verify that the app was uploaded to the app stores"
echo "3. Complete any remaining metadata in the app store consoles"
echo "4. Submit the app for review"

exit 0
