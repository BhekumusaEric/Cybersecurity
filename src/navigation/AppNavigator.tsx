import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

const AppNavigator: React.FC = () => {
  const { isSignedIn, isLoading } = useAuth();
  const { colors, isDark } = useTheme();

  // Create navigation theme based on current theme
  const navigationTheme = {
    dark: isDark,
    colors: {
      primary: colors.primary,
      background: isDark ? colors.darker : colors.lighter,
      card: isDark ? colors.darkGray : colors.white,
      text: isDark ? colors.white : colors.dark,
      border: isDark ? colors.darkGray : colors.lightGray,
      notification: colors.danger,
    },
  };

  // Show loading screen while checking authentication status
  if (isLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: isDark ? colors.darker : colors.lighter },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      {isSignedIn ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigator;
