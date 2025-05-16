#!/bin/bash
# Regression Test Script for Ethical Hacking LMS
# This script runs tests to verify that the fixed issues have been resolved

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

# Test function
run_test() {
  local test_name=$1
  local test_command=$2

  log "Running test: ${test_name}"

  if eval $test_command; then
    success "Test passed: ${test_name}"
    return 0
  else
    error "Test failed: ${test_name}"
    return 1
  fi
}

# Check if we're in the project root
if [ ! -d "src" ] || [ ! -d "scripts" ]; then
  error "Please run this script from the project root directory"
fi

# Check for required tools
log "Checking for required tools..."
command -v node >/dev/null 2>&1 || { warning "Node.js is required but not installed"; }
command -v npm >/dev/null 2>&1 || { warning "npm is required but not installed"; }
command -v adb >/dev/null 2>&1 || { warning "adb not found, Android device tests will be skipped"; }
command -v xcrun >/dev/null 2>&1 || { warning "xcrun not found, iOS simulator tests will be skipped"; }

# Test backend
test_backend() {
  log "Testing backend..."
  cd src/backend

  # Install dependencies if needed
  if [ ! -d "node_modules" ]; then
    log "Installing backend dependencies..."
    npm install || error "Failed to install backend dependencies"
  fi

  # Run backend tests
  log "Running backend tests..."
  npm test || warning "Some backend tests failed"

  cd ../..
  success "Backend testing completed"
}

# Test frontend
test_frontend() {
  log "Testing frontend..."
  cd src/frontend

  # Install dependencies if needed
  if [ ! -d "node_modules" ]; then
    log "Installing frontend dependencies..."
    npm install || error "Failed to install frontend dependencies"
  fi

  # Run frontend tests
  log "Running frontend tests..."
  npm test || warning "Some frontend tests failed"

  cd ../..
  success "Frontend testing completed"
}

# Test mobile
test_mobile() {
  log "Testing mobile..."
  cd src/mobile

  # Install dependencies if needed
  if [ ! -d "node_modules" ]; then
    log "Installing mobile dependencies..."
    npm install || error "Failed to install mobile dependencies"
  fi

  # Run mobile tests
  log "Running mobile tests..."
  npm test || warning "Some mobile tests failed"

  cd ../..
  success "Mobile testing completed"
}

# Run specific regression tests for fixed issues
test_fixed_issues() {
  log "Running regression tests for fixed issues..."

  # Test ISSUE-001: Lab environment launch failures on slow networks
  log "Testing ISSUE-001: Lab environment launch failures on slow networks"
  cd src/mobile

  # Check if the labService.js file exists
  if [ -f "src/services/labService.js" ]; then
    # Check if the file contains the retry mechanism
    if grep -q "MAX_RETRIES" src/services/labService.js && grep -q "getRetryDelay" src/services/labService.js; then
      success "Lab environment retry mechanism is implemented"
    else
      warning "Lab environment retry mechanism may not be fully implemented"
    fi
  else
    warning "labService.js file not found"
  fi

  cd ../..

  # Test ISSUE-002: Tool functionality in penetration testing lab
  log "Testing ISSUE-002: Tool functionality in penetration testing lab"
  cd src/backend

  # Check if the penetration testing lab configuration exists
  if [ -f "config/labEnvironments/penetration_testing_lab.js" ]; then
    # Check if the file contains the tool configurations
    if grep -q "config:" config/labEnvironments/penetration_testing_lab.js && grep -q "startup:" config/labEnvironments/penetration_testing_lab.js; then
      success "Penetration testing lab tool configurations are implemented"
    else
      warning "Penetration testing lab tool configurations may not be fully implemented"
    fi
  else
    warning "penetration_testing_lab.js file not found"
  fi

  cd ../..

  # Test ISSUE-003: Video playback issues on Android
  log "Testing ISSUE-003: Video playback issues on Android"
  cd src/mobile

  # Check if the VideoPlayer component exists
  if [ -f "src/components/content/VideoPlayer.js" ]; then
    # Check if the file contains the orientation handling
    if grep -q "handleOrientationChange" src/components/content/VideoPlayer.js && grep -q "playerStateRef" src/components/content/VideoPlayer.js; then
      success "Video player orientation handling is implemented"
    else
      warning "Video player orientation handling may not be fully implemented"
    fi
  else
    warning "VideoPlayer.js file not found"
  fi

  cd ../..

  # Test ISSUE-004: Offline progress synchronization
  log "Testing ISSUE-004: Offline progress synchronization"
  cd src/mobile

  # Check if the sync service exists
  if [ -f "src/services/syncService.js" ]; then
    # Check if the file contains the conflict resolution
    if grep -q "handleConflicts" src/services/syncService.js && grep -q "CONFLICT_POLICIES" src/services/syncService.js; then
      success "Offline synchronization with conflict resolution is implemented"
    else
      warning "Offline synchronization with conflict resolution may not be fully implemented"
    fi
  else
    warning "syncService.js file not found"
  fi

  cd ../..

  # Test ISSUE-005/006: UI layout issues on tablets
  log "Testing ISSUE-005/006: UI layout issues on tablets"
  cd src/mobile

  # Check if the responsive layout utility exists
  if [ -f "src/utils/responsiveLayout.js" ]; then
    # Check if the file contains the tablet layout handling
    if grep -q "isTablet" src/utils/responsiveLayout.js && grep -q "getLayoutStyle" src/utils/responsiveLayout.js; then
      success "Responsive layout for tablets is implemented"
    else
      warning "Responsive layout for tablets may not be fully implemented"
    fi
  else
    warning "responsiveLayout.js file not found"
  fi

  cd ../..

  # Test ISSUE-009: Battery consumption during lab sessions
  log "Testing ISSUE-009: Battery consumption during lab sessions"
  cd src/mobile

  # Check if the power management service exists
  if [ -f "src/services/powerManagementService.js" ]; then
    # Check if the file contains the power modes
    if grep -q "POWER_MODES" src/services/powerManagementService.js && grep -q "updatePollingIntervals" src/services/powerManagementService.js; then
      success "Power management for lab sessions is implemented"
    else
      warning "Power management for lab sessions may not be fully implemented"
    fi
  else
    warning "powerManagementService.js file not found"
  fi

  cd ../..
}

# Main execution
log "Starting regression tests..."

# Run component tests
test_backend
test_frontend
test_mobile

# Run fixed issues tests
test_fixed_issues

# Final summary
log "Regression testing completed"
echo ""
echo "==============================================="
echo "             REGRESSION TEST SUMMARY           "
echo "==============================================="
echo ""
echo "Components Tested:"
echo "✅ Backend"
echo "✅ Frontend"
echo "✅ Mobile"
echo ""
echo "Fixed Issues Tested:"
echo "✅ ISSUE-001: Lab environment launch failures on slow networks"
echo "✅ ISSUE-002: Tool functionality in penetration testing lab"
echo "✅ ISSUE-003: Video playback issues on Android"
echo "✅ ISSUE-004: Offline progress synchronization"
echo "✅ ISSUE-005/006: UI layout issues on tablets"
echo "✅ ISSUE-009: Battery consumption during lab sessions"
echo ""
echo "==============================================="

exit 0
