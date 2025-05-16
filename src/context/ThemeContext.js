/**
 * Theme Context
 *
 * This context provides theming functionality for the app.
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create context
const ThemeContext = createContext();

// Theme definitions
const themes = {
  light: {
    dark: false,
    colors: {
      primary: '#2563EB', // Blue
      background: '#F9FAFB', // Light gray
      card: '#FFFFFF', // White
      text: '#1F2937', // Dark gray
      border: '#E5E7EB', // Light gray
      notification: '#EF4444', // Red
      error: '#EF4444', // Red
      success: '#10B981', // Green
      warning: '#F59E0B', // Yellow
      info: '#3B82F6', // Blue
      secondary: '#6B7280', // Gray
      accent: '#8B5CF6', // Purple
    },
  },
  dark: {
    dark: true,
    colors: {
      primary: '#3B82F6', // Blue
      background: '#111827', // Dark gray
      card: '#1F2937', // Dark gray
      text: '#F9FAFB', // Light gray
      border: '#374151', // Gray
      notification: '#EF4444', // Red
      error: '#EF4444', // Red
      success: '#10B981', // Green
      warning: '#F59E0B', // Yellow
      info: '#3B82F6', // Blue
      secondary: '#9CA3AF', // Gray
      accent: '#A78BFA', // Purple
    },
  },
  highContrast: {
    dark: true,
    colors: {
      primary: '#FFFFFF', // White
      background: '#000000', // Black
      card: '#000000', // Black
      text: '#FFFFFF', // White
      border: '#FFFFFF', // White
      notification: '#FFFF00', // Yellow
      error: '#FFFF00', // Yellow
      success: '#FFFFFF', // White
      warning: '#FFFF00', // Yellow
      info: '#FFFFFF', // White
      secondary: '#FFFFFF', // White
      accent: '#FFFF00', // Yellow
    },
  },
};

// Provider component
export const ThemeProvider = ({ children }) => {
  // Get system color scheme
  const systemColorScheme = useColorScheme();

  // Theme mode (light, dark, system, highContrast)
  const [themeMode, setThemeMode] = useState('system');

  // Current theme
  const [theme, setTheme] = useState(themes.light);

  // Load saved theme mode
  useEffect(() => {
    const loadThemeMode = async () => {
      try {
        const savedThemeMode = await AsyncStorage.getItem('themeMode');
        if (savedThemeMode) {
          setThemeMode(savedThemeMode);
        }
      } catch (error) {
        console.error('Error loading theme mode:', error);
      }
    };

    loadThemeMode();
  }, []);

  // Update theme when theme mode or system color scheme changes
  useEffect(() => {
    let newTheme;

    switch (themeMode) {
      case 'light':
        newTheme = themes.light;
        break;
      case 'dark':
        newTheme = themes.dark;
        break;
      case 'highContrast':
        newTheme = themes.highContrast;
        break;
      case 'system':
      default:
        newTheme = systemColorScheme === 'dark' ? themes.dark : themes.light;
        break;
    }

    setTheme(newTheme);
  }, [themeMode, systemColorScheme]);

  // Change theme mode
  const changeThemeMode = async (mode) => {
    try {
      setThemeMode(mode);
      await AsyncStorage.setItem('themeMode', mode);
    } catch (error) {
      console.error('Error saving theme mode:', error);
    }
  };

  // Toggle between light and dark mode
  const toggleTheme = async () => {
    try {
      const newMode = themeMode === 'light' ? 'dark' : 'light';
      setThemeMode(newMode);
      await AsyncStorage.setItem('themeMode', newMode);
    } catch (error) {
      console.error('Error toggling theme:', error);
    }
  };

  // Create a safe context value
  const contextValue = {
    theme: theme || themes.light,
    themeMode: themeMode || 'light',
    colors: (theme && theme.colors) || themes.light.colors,
    isDark: (theme && theme.dark) || false,
    changeThemeMode: changeThemeMode || (() => {}),
    toggleTheme: toggleTheme || (() => {}),
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
