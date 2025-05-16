# Final Testing Environment Setup

This document outlines the setup of the testing environment for final testing of the Ethical Hacking LMS application before submission to app stores.

## Test Devices

### iOS Devices

| Device | OS Version | Form Factor | Purpose |
|--------|------------|-------------|---------|
| iPhone 13 Pro | iOS 16.5 | Modern iPhone (6.1") | Primary test device |
| iPhone SE (2022) | iOS 16.5 | Compact iPhone (4.7") | Small screen testing |
| iPhone 8 | iOS 15.7 | Older iPhone | Minimum OS testing |
| iPad Pro 12.9" (2021) | iOS 16.5 | Large tablet | Tablet layout testing |
| iPad Mini (2021) | iOS 16.5 | Small tablet | Small tablet testing |

### Android Devices

| Device | OS Version | Form Factor | Purpose |
|--------|------------|-------------|---------|
| Google Pixel 7 | Android 13 | Modern Android | Primary test device |
| Samsung Galaxy S22 | Android 13 | Flagship Android | Manufacturer customization testing |
| Samsung Galaxy A53 | Android 13 | Mid-range Android | Average user device testing |
| Xiaomi Redmi Note 11 | Android 12 | Budget Android | Performance testing on lower specs |
| Samsung Galaxy Tab S8 | Android 13 | Large tablet | Tablet layout testing |
| Lenovo Tab M10 | Android 12 | Budget tablet | Tablet performance testing |
| Google Pixel 4a | Android 12 | Older device | Minimum OS testing |

## Test Accounts

### User Roles

| Role | Username | Password | Description |
|------|----------|----------|-------------|
| Admin | admin@test.com | Test@dmin123 | Full administrative access |
| Instructor | instructor@test.com | Test!nstructor123 | Course management access |
| Student (Premium) | premium@test.com | TestPremium123 | Access to all courses and features |
| Student (Basic) | basic@test.com | TestBasic123 | Limited access to basic courses |
| New User | (Created during testing) | TestNew123 | For testing registration flow |

### Account States

| State | Username | Password | Description |
|-------|----------|----------|-------------|
| Complete Profile | complete@test.com | TestComplete123 | User with all profile fields completed |
| Partial Profile | partial@test.com | TestPartial123 | User with minimal profile information |
| Course Progress | progress@test.com | TestProgress123 | User with various levels of course progress |
| Assessment History | assessment@test.com | TestAssessment123 | User with completed assessments |
| Lab History | lab@test.com | TestLab123 | User with completed lab sessions |

## Test Data

### Courses

| Course ID | Title | Modules | Description |
|-----------|-------|---------|-------------|
| COURSE-001 | Introduction to Ethical Hacking | 8 | Complete course with all content types |
| COURSE-002 | Network Security Fundamentals | 6 | Course with video-heavy content |
| COURSE-003 | Web Application Security | 10 | Course with interactive exercises |
| COURSE-004 | Social Engineering | 5 | Course with downloadable resources |
| COURSE-005 | Mobile Security | 7 | Course with complex lab environments |

### Labs

| Lab ID | Title | Type | Description |
|--------|-------|------|-------------|
| LAB-001 | Network Scanning Lab | Network | Basic network scanning exercises |
| LAB-002 | Web Application Security Lab | Web | OWASP Top 10 vulnerabilities |
| LAB-003 | Social Engineering Lab | Social | Phishing simulation exercises |
| LAB-004 | Wireless Security Lab | Wireless | WiFi security assessment |
| LAB-005 | Penetration Testing Lab | Pentest | Full-scope penetration test |

### Assessments

| Assessment ID | Title | Type | Questions/Tasks |
|---------------|-------|------|----------------|
| ASSESS-001 | Ethical Hacking Fundamentals | Quiz | 25 multiple choice questions |
| ASSESS-002 | Network Security Assessment | Quiz | 20 questions with diagrams |
| ASSESS-003 | Web Vulnerability Practical | Practical | 5 hands-on tasks |
| ASSESS-004 | Social Engineering Scenarios | Scenario | 10 scenario-based questions |
| ASSESS-005 | Final Certification Exam | Comprehensive | 50 questions across all topics |

## Network Conditions

| Condition | Description | Testing Focus |
|-----------|-------------|--------------|
| High-Speed WiFi | 100+ Mbps, low latency | Optimal performance baseline |
| Average Mobile Data | 10-20 Mbps, medium latency | Typical user experience |
| Poor Connection | 2-5 Mbps, high latency | Performance degradation handling |
| Intermittent Connection | Random disconnections | Offline mode and reconnection handling |
| Offline | No connection | Offline functionality |

## Test Environments

### Development Environment

- **URL**: https://dev.ethicalhackinglms.com
- **API Endpoint**: https://api-dev.ethicalhackinglms.com
- **Purpose**: Final pre-production testing

### Staging Environment

- **URL**: https://staging.ethicalhackinglms.com
- **API Endpoint**: https://api-staging.ethicalhackinglms.com
- **Purpose**: Production-like environment for final verification

### Test Database

- Populated with realistic test data
- Includes various user states and progress levels
- Contains complete course content
- Configured with test lab environments

## Testing Tools

### Automated Testing

| Tool | Purpose | Configuration |
|------|---------|--------------|
| Detox | E2E testing for React Native | Configured for iOS and Android |
| Jest | Unit and integration testing | Test suites for all components |
| Appium | Cross-platform mobile testing | Device farm integration |
| Espresso (Android) | UI testing for Android | Activity and fragment testing |
| XCTest (iOS) | UI testing for iOS | View controller testing |

### Manual Testing

| Tool | Purpose | Configuration |
|------|---------|--------------|
| TestRail | Test case management | Test cases organized by feature |
| Jira | Issue tracking | Linked to test cases |
| Charles Proxy | Network monitoring | SSL proxying enabled |
| Firebase Test Lab | Device testing | Virtual and physical devices |
| Android Studio | Android debugging | Logcat and profiling |
| Xcode | iOS debugging | Console and Instruments |

### Performance Testing

| Tool | Purpose | Configuration |
|------|---------|--------------|
| Lighthouse | Web performance | Mobile emulation enabled |
| Android Profiler | Android performance | Memory, CPU, and network monitoring |
| Xcode Instruments | iOS performance | Time Profiler and Allocations |
| Firebase Performance | Real-user monitoring | Custom traces configured |
| JMeter | API load testing | Test scenarios for key endpoints |

## Test Environment Setup Instructions

### 1. Device Preparation

1. **Reset Devices to Factory Settings**
   ```bash
   # For Android (via ADB)
   adb devices
   adb -s [device_id] shell wipe data
   
   # For iOS, use manual reset in Settings
   ```

2. **Install Required Certificates**
   ```bash
   # Install testing certificate for HTTPS inspection
   adb push ./certs/test_ca.crt /sdcard/
   # Then manually install from Settings
   ```

3. **Configure Developer Options**
   ```bash
   # Enable USB debugging (Android)
   adb shell settings put global development_settings_enabled 1
   adb shell settings put global adb_enabled 1
   
   # Enable UI Automation (iOS)
   # Enable from Settings > Developer
   ```

### 2. Application Installation

1. **Install Test Builds**
   ```bash
   # Android APK installation
   adb install -r ./builds/ethicalhackinglms-release-candidate.apk
   
   # iOS IPA installation via TestFlight
   # Distribute build through App Store Connect
   ```

2. **Configure App Settings**
   ```bash
   # Set API endpoint to staging
   adb shell am start -a android.intent.action.VIEW -d "ethicalhackinglms://settings/environment/staging"
   
   # Enable test mode
   adb shell am broadcast -a com.ethicalhackinglms.ENABLE_TEST_MODE
   ```

### 3. Test Account Setup

1. **Preload Test Accounts**
   ```bash
   # Run account setup script
   ./scripts/setup_test_accounts.sh
   
   # Verify accounts
   curl -X GET https://api-staging.ethicalhackinglms.com/v1/test-accounts \
     -H "Authorization: Bearer $ADMIN_TOKEN"
   ```

2. **Generate Test Data**
   ```bash
   # Run data generation script
   ./scripts/generate_test_data.sh
   
   # Verify test data
   curl -X GET https://api-staging.ethicalhackinglms.com/v1/test-data/status \
     -H "Authorization: Bearer $ADMIN_TOKEN"
   ```

### 4. Monitoring Setup

1. **Configure Logging**
   ```bash
   # Enable verbose logging
   adb shell setprop log.tag.EthicalHackingLMS VERBOSE
   
   # Start logcat capture
   adb logcat -v threadtime > test_session.log
   ```

2. **Setup Performance Monitoring**
   ```bash
   # Start Android profiling
   ./scripts/start_profiling.sh
   
   # Configure iOS Instruments
   # Launch from Xcode > Open Developer Tool > Instruments
   ```

### 5. Network Condition Simulation

1. **Configure Network Conditions**
   ```bash
   # Using Chrome DevTools for web components
   # Network tab > Throttling
   
   # Using Network Link Conditioner for iOS
   # Enable from Developer settings
   
   # Using Android emulator settings
   emulator -avd [avd_name] -netdelay [delay] -netspeed [speed]
   ```

2. **Setup Charles Proxy**
   ```bash
   # Configure proxy settings
   adb shell settings put global http_proxy "192.168.1.100:8888"
   
   # Install Charles SSL certificate
   # Follow instructions at charlesproxy.com/documentation
   ```

## Test Data Reset Procedure

To reset the test environment between test runs:

```bash
# Reset app data
adb shell pm clear com.ethicalhackinglms

# Reset server-side test data
curl -X POST https://api-staging.ethicalhackinglms.com/v1/test-data/reset \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Verify reset
curl -X GET https://api-staging.ethicalhackinglms.com/v1/test-data/status \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

## Troubleshooting Common Issues

| Issue | Resolution |
|-------|------------|
| App crashes on startup | Check logs: `adb logcat -b crash` |
| Network requests failing | Verify proxy settings and certificates |
| Test account login fails | Reset password using admin API |
| Lab environment not loading | Check lab provisioning status in admin panel |
| Performance degradation | Check for memory leaks using profiling tools |
