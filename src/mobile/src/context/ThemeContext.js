import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { DefaultTheme, DarkTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('auto'); // 'light', 'dark', or 'auto'
  
  // Load theme preference from storage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themeMode');
        if (savedTheme) {
          setThemeMode(savedTheme);
        }
      } catch (error) {
        console.log('Load theme error:', error);
      }
    };
    
    loadTheme();
  }, []);
  
  // Save theme preference to storage
  const setTheme = async (mode) => {
    try {
      await AsyncStorage.setItem('themeMode', mode);
      setThemeMode(mode);
    } catch (error) {
      console.log('Save theme error:', error);
    }
  };
  
  // Determine the actual theme based on preference and device theme
  const getActiveTheme = () => {
    if (themeMode === 'auto') {
      return deviceTheme === 'dark' ? 'dark' : 'light';
    }
    return themeMode;
  };
  
  const activeTheme = getActiveTheme();
  
  // Custom theme configurations
  const lightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#1976d2',
      accent: '#dc004e',
      background: '#f5f5f5',
      surface: '#ffffff',
      text: '#333333',
      error: '#f44336',
      success: '#4caf50',
      warning: '#ff9800',
    },
    roundness: 8,
  };
  
  const darkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: '#90caf9',
      accent: '#f48fb1',
      background: '#121212',
      surface: '#1e1e1e',
      text: '#ffffff',
      error: '#f44336',
      success: '#4caf50',
      warning: '#ff9800',
    },
    roundness: 8,
  };
  
  // Get the theme object based on active theme
  const theme = activeTheme === 'dark' ? darkTheme : lightTheme;
  
  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        setTheme,
        isDark: activeTheme === 'dark',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
