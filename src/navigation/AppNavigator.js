/**
 * App Navigator
 *
 * This file defines the main navigation structure for the Ethical Hacking LMS app.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import HomeScreen from '../screens/main/HomeScreen';
import CoursesScreen from '../screens/main/CoursesScreen';
import CourseDetailScreen from '../screens/main/CourseDetailScreen';
import LessonScreen from '../screens/main/LessonScreen';
import LabsScreen from '../screens/main/LabsScreen';
import LabDetailScreen from '../screens/main/LabDetailScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import NotificationsScreen from '../screens/main/NotificationsScreen';
import CertificatesScreen from '../screens/main/CertificatesScreen';
import OfflineContentScreen from '../screens/main/OfflineContentScreen';
import SecurityScreen from '../screens/main/SecurityScreen';

// Create navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Auth Navigator
const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

// Main Tab Navigator
const MainTabNavigator = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Courses"
        component={CoursesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="book-open-variant" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Labs"
        component={LabsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="flask" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Drawer Navigator
const MainDrawerNavigator = () => {
  const { colors } = useTheme();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
        drawerStyle: {
          backgroundColor: colors.card,
        },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.text,
      }}
    >
      <Drawer.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="cog" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="bell" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Certificates"
        component={CertificatesScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="certificate" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Offline Content"
        component={OfflineContentScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="download" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Security"
        component={SecurityScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="shield-check" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

// Main Stack Navigator (for screens that need to be outside the drawer/tab navigation)
const MainStackNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="DrawerMain" component={MainDrawerNavigator} />
    <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
    <Stack.Screen name="Lesson" component={LessonScreen} />
    <Stack.Screen name="LabDetail" component={LabDetailScreen} />
  </Stack.Navigator>
);

// App Navigator
const AppNavigator = () => {
  try {
    const { user, loading } = useAuth();

    if (loading) {
      // You could return a loading screen here
      return null;
    }

    return (
      <NavigationContainer>
        {user ? <MainStackNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    );
  } catch (error) {
    console.error('Error in AppNavigator:', error);
    // Fallback to AuthNavigator if there's an error
    return (
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    );
  }
};

export default AppNavigator;
