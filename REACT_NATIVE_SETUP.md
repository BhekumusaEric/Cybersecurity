# Converting Your Ethical Hacking LMS to React Native

This guide provides detailed instructions for converting your web-based Ethical Hacking LMS to a native mobile application using React Native. This approach will give you the best performance and user experience on mobile devices.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Project Structure](#project-structure)
4. [Sharing Code with Web App](#sharing-code-with-web-app)
5. [Implementing Key Features](#implementing-key-features)
6. [Lab Environment Integration](#lab-environment-integration)
7. [Offline Support](#offline-support)
8. [Testing](#testing)
9. [Building for Production](#building-for-production)

## Prerequisites

Before starting the conversion process, ensure you have:

1. **Node.js and npm**: Latest stable version
2. **React Native CLI**: `npm install -g react-native-cli`
3. **Android Development Environment**:
   - Android Studio
   - Android SDK
   - JDK 8 or newer
4. **iOS Development Environment** (optional, for future expansion):
   - macOS
   - Xcode
   - CocoaPods
5. **Code Editor**: VS Code with React Native extensions recommended
6. **Git**: For version control

## Project Setup

### 1. Create a New React Native Project

```bash
# Navigate to a directory parallel to your web app
cd /path/to/projects

# Create a new React Native project
npx react-native init EthicalHackingLMSMobile

# Navigate to the new project
cd EthicalHackingLMSMobile
```

### 2. Install Essential Dependencies

```bash
# Navigation
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context

# UI Components
npm install react-native-paper
npm install react-native-vector-icons

# State Management
npm install @reduxjs/toolkit react-redux

# API and Networking
npm install axios

# Storage
npm install @react-native-async-storage/async-storage

# WebView (for lab environment)
npm install react-native-webview

# Offline Support
npm install @react-native-community/netinfo

# Authentication
npm install @react-native-community/cookies
npm install react-native-keychain

# File System Access
npm install react-native-fs

# Terminal Emulation
npm install react-native-terminal-component
```

### 3. Configure Native Modules

```bash
# Link native dependencies
npx pod-install ios  # Only if developing for iOS

# Update Android configuration
# Edit android/app/build.gradle to add vector icon support
```

Add the following to `android/app/build.gradle`:

```gradle
project.ext.vectoricons = [
    iconFontNames: [ 'MaterialIcons.ttf', 'FontAwesome.ttf' ]
]

apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

## Project Structure

Organize your React Native project to mirror your web app structure where possible:

```
EthicalHackingLMSMobile/
├── src/
│   ├── api/              # API service calls
│   ├── assets/           # Images, fonts, etc.
│   ├── components/       # Reusable UI components
│   │   ├── common/       # Shared components
│   │   ├── auth/         # Authentication components
│   │   ├── courses/      # Course-related components
│   │   ├── labs/         # Lab-related components
│   │   └── assessments/  # Assessment components
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom hooks
│   ├── navigation/       # Navigation configuration
│   ├── screens/          # Full screens
│   │   ├── auth/         # Login, Register, etc.
│   │   ├── dashboard/    # Dashboard screens
│   │   ├── courses/      # Course screens
│   │   ├── labs/         # Lab screens
│   │   └── profile/      # User profile screens
│   ├── services/         # Business logic services
│   ├── store/            # Redux store configuration
│   │   ├── slices/       # Redux slices
│   │   └── index.js      # Store configuration
│   ├── styles/           # Global styles
│   ├── utils/            # Utility functions
│   └── App.js            # Root component
├── .env                  # Environment variables
└── shared/               # Code shared with web app (symlink or copy)
```

## Sharing Code with Web App

Identify and share code between your web app and React Native app:

### 1. Create a Shared Directory

```bash
mkdir -p shared
```

### 2. Identify Shareable Code

Code that can be shared includes:
- API service definitions
- Data models
- Utility functions
- Business logic
- State management (Redux slices)
- Form validation

### 3. Extract Shared Code

Move shareable code to the shared directory, ensuring it doesn't use platform-specific APIs.

### 4. Use Symlinks or Copy

```bash
# Option 1: Symlink (development)
ln -s ../EthicalHackingLMS/src/services/api shared/api

# Option 2: Copy (more reliable for production)
cp -r ../EthicalHackingLMS/src/services/api shared/api
```

## Implementing Key Features

### 1. Authentication

Create native authentication screens that use the same API as your web app:

```jsx
// src/screens/auth/LoginScreen.js
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { login } from '../../store/slices/authSlice';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await dispatch(login({ email, password })).unwrap();
      // Navigate to dashboard on success
    } catch (error) {
      // Show error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ethical Hacking LMS</Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        style={styles.button}
      >
        Login
      </Button>
      <Button
        mode="text"
        onPress={() => navigation.navigate('Register')}
      >
        Create Account
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    marginBottom: 16,
  },
});

export default LoginScreen;
```

### 2. Navigation

Set up a navigation structure similar to your web app:

```jsx
// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { MaterialIcons } from 'react-native-vector-icons';

// Auth screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Main screens
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import CourseListScreen from '../screens/courses/CourseListScreen';
import CourseDetailScreen from '../screens/courses/CourseDetailScreen';
import LabListScreen from '../screens/labs/LabListScreen';
import LabDetailScreen from '../screens/labs/LabDetailScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Dashboard"
      component={DashboardScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="dashboard" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Courses"
      component={CourseListScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="school" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Labs"
      component={LabListScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="code" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="person" color={color} size={size} />
        ),
      }}
    />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { isAuthenticated } = useSelector(state => state.auth);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // Auth screens
          <Stack.Group>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Group>
        ) : (
          // Main app screens
          <Stack.Group>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
            <Stack.Screen name="LabDetail" component={LabDetailScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
```

## Lab Environment Integration

Integrate the lab environment using WebView for compatibility:

```jsx
// src/screens/labs/LabDetailScreen.js
import React, { useState, useRef } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';
import { Button, Text, ActivityIndicator } from 'react-native-paper';
import { useNetInfo } from '@react-native-community/netinfo';

const LabDetailScreen = ({ route }) => {
  const { lab } = route.params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const webViewRef = useRef(null);
  const netInfo = useNetInfo();

  // Handle back button to navigate within WebView
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, []);

  // Inject custom CSS for mobile optimization
  const injectedJavaScript = `
    (function() {
      const style = document.createElement('style');
      style.textContent = 'body { font-size: 16px; } .terminal { font-size: 14px; }';
      document.head.appendChild(style);
    })();
    true;
  `;

  if (!netInfo.isConnected) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Internet connection required for lab environment.
          Please connect to the internet and try again.
        </Text>
        <Button mode="contained" onPress={() => BackHandler.exitApp()}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{lab.title}</Text>
      </View>
      
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading lab environment...</Text>
        </View>
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Failed to load lab environment: {error}
          </Text>
          <Button mode="contained" onPress={() => setError(null)}>
            Retry
          </Button>
        </View>
      )}
      
      <WebView
        ref={webViewRef}
        source={{ uri: `https://your-api-domain.com/labs/${lab.id}/environment` }}
        style={[styles.webview, loading ? styles.hidden : null]}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={(e) => setError(e.nativeEvent.description)}
        injectedJavaScript={injectedJavaScript}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        allowsFullscreenVideo={true}
        useWebKit={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  webview: {
    flex: 1,
  },
  hidden: {
    opacity: 0,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 16,
    color: 'red',
  },
});

export default LabDetailScreen;
```

## Offline Support

Implement offline support using AsyncStorage and NetInfo:

```jsx
// src/services/offlineStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  COURSES: 'offline_courses',
  MODULES: 'offline_modules',
  LABS: 'offline_labs',
  USER_PROGRESS: 'offline_user_progress',
  PENDING_ACTIONS: 'offline_pending_actions',
};

export const storeData = async (key, data) => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (e) {
    console.error('Error storing data:', e);
    return false;
  }
};

export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error retrieving data:', e);
    return null;
  }
};

export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error('Error removing data:', e);
    return false;
  }
};

export const storeCourses = (courses) => storeData(STORAGE_KEYS.COURSES, courses);
export const getCourses = () => getData(STORAGE_KEYS.COURSES);

export const storeModules = (modules) => storeData(STORAGE_KEYS.MODULES, modules);
export const getModules = () => getData(STORAGE_KEYS.MODULES);

export const storeLabs = (labs) => storeData(STORAGE_KEYS.LABS, labs);
export const getLabs = () => getData(STORAGE_KEYS.LABS);

export const storeUserProgress = (progress) => storeData(STORAGE_KEYS.USER_PROGRESS, progress);
export const getUserProgress = () => getData(STORAGE_KEYS.USER_PROGRESS);

export const addPendingAction = async (action) => {
  const pendingActions = await getData(STORAGE_KEYS.PENDING_ACTIONS) || [];
  pendingActions.push({
    ...action,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    status: 'pending',
  });
  return storeData(STORAGE_KEYS.PENDING_ACTIONS, pendingActions);
};

export const getPendingActions = () => getData(STORAGE_KEYS.PENDING_ACTIONS);

export const updatePendingAction = async (actionId, updates) => {
  const pendingActions = await getData(STORAGE_KEYS.PENDING_ACTIONS) || [];
  const updatedActions = pendingActions.map(action => 
    action.id === actionId ? { ...action, ...updates } : action
  );
  return storeData(STORAGE_KEYS.PENDING_ACTIONS, updatedActions);
};

export const clearAllData = async () => {
  const keys = Object.values(STORAGE_KEYS);
  try {
    await AsyncStorage.multiRemove(keys);
    return true;
  } catch (e) {
    console.error('Error clearing all data:', e);
    return false;
  }
};
```

## Testing

Set up testing for your React Native app:

```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native

# Create a test file
touch src/components/common/__tests__/Button.test.js
```

Example test:

```jsx
// src/components/common/__tests__/Button.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../Button';

describe('Button component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Button title="Test Button" />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Button title="Test Button" onPress={onPressMock} />);
    
    fireEvent.press(getByText('Test Button'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
```

## Building for Production

### Android

```bash
# Generate a signing key (if you don't have one)
keytool -genkeypair -v -keystore android/app/release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000

# Configure signing in android/app/build.gradle

# Build release APK
cd android
./gradlew assembleRelease

# Build App Bundle (preferred for Play Store)
./gradlew bundleRelease
```

The release APK will be at `android/app/build/outputs/apk/release/app-release.apk`
The App Bundle will be at `android/app/build/outputs/bundle/release/app-release.aab`

---

This guide provides a foundation for converting your Ethical Hacking LMS web application to a React Native mobile app. The process involves significant work but results in a high-quality native mobile experience that can be published to app stores.
