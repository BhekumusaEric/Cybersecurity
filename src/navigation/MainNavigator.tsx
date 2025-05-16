import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Text, View } from 'react-native';

import HomeScreen from '../screens/main/HomeScreen';
import CoursesScreen from '../screens/main/CoursesScreen';
import LabsScreen from '../screens/main/LabsScreen';
import LabDetailsScreen from '../screens/main/LabDetailsScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import { MainStackParamList, DrawerParamList } from './types';
import { useTheme } from '../context/ThemeContext';
import { useLocalization } from '../context/LocalizationContext';

// Create navigators
const Stack = createStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator<DrawerParamList>();

// Placeholder screens
const ProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Profile Screen</Text>
  </View>
);

const CourseDetailsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Course Details Screen</Text>
  </View>
);

const HelpScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Help Screen</Text>
  </View>
);

const AboutScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>About Screen</Text>
  </View>
);

// Main Stack Navigator
const MainStackNavigator = () => {
  const { colors, isDark } = useTheme();
  const { t } = useLocalization();

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? colors.darker : colors.white,
        },
        headerTintColor: isDark ? colors.white : colors.dark,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CourseDetails"
        component={CourseDetailsScreen}
        options={{ title: t('courses.courseDetails') }}
      />
      <Stack.Screen
        name="LabDetails"
        component={LabDetailsScreen}
        options={{ title: t('labs.labDetails') }}
      />
    </Stack.Navigator>
  );
};

// Tab Navigator
const TabNavigator = () => {
  const { colors, isDark } = useTheme();
  const { t } = useLocalization();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: isDark ? colors.lightGray : colors.gray,
        tabBarStyle: {
          backgroundColor: isDark ? colors.darker : colors.white,
          borderTopColor: isDark ? colors.darkGray : colors.lightGray,
        },
        headerStyle: {
          backgroundColor: isDark ? colors.darker : colors.white,
        },
        headerTintColor: isDark ? colors.white : colors.dark,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: t('home.home'),
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="CoursesTab"
        component={CoursesScreen}
        options={{
          title: t('courses.allCourses'),
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>📚</Text>
          ),
        }}
      />
      <Tab.Screen
        name="LabsTab"
        component={LabsScreen}
        options={{
          title: t('labs.allLabs'),
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>🧪</Text>
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: t('profile.profile'),
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Drawer Navigator
const MainNavigator = () => {
  const { colors, isDark } = useTheme();
  const { t } = useLocalization();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: isDark ? colors.darker : colors.white,
        },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: isDark ? colors.lightGray : colors.gray,
      }}
    >
      <Drawer.Screen
        name="MainStack"
        component={MainStackNavigator}
        options={{ title: t('home.home') }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: t('settings.settings') }}
      />
      <Drawer.Screen
        name="Help"
        component={HelpScreen}
        options={{ title: t('profile.help') }}
      />
      <Drawer.Screen
        name="About"
        component={AboutScreen}
        options={{ title: t('profile.about') }}
      />
    </Drawer.Navigator>
  );
};

export default MainNavigator;
