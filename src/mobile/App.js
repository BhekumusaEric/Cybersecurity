/**
 * Ethical Hacking LMS Mobile App
 */

import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, I18nManager, LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';

import { ThemeProvider } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { OfflineProvider } from './src/context/OfflineContext';
import { LocalizationProvider } from './src/context/LocalizationContext';
import { AccessibilityProvider } from './src/context/AccessibilityContext';
import { NotificationProvider } from './src/context/NotificationContext';
import AppNavigator from './src/navigation/AppNavigator';

// Ignore specific warnings
LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
  'Reanimated 2',
]);

// Error handling for the entire app
const errorHandler = (error, isFatal) => {
  console.error('Global error handler:', error);
};

// Set up global error handler
if (global.ErrorUtils) {
  global.ErrorUtils.setGlobalHandler(errorHandler);
}

const App = () => {
  // Set up RTL layout if needed
  useEffect(() => {
    try {
      // Force LTR layout for development
      if (__DEV__ && I18nManager.isRTL) {
        I18nManager.forceRTL(false);
      }
    } catch (error) {
      console.error('Error setting up RTL layout:', error);
    }
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <OfflineProvider>
              <LocalizationProvider>
                <AccessibilityProvider>
                  <NotificationProvider>
                    <PaperProvider>
                      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
                      <AppNavigator />
                    </PaperProvider>
                  </NotificationProvider>
                </AccessibilityProvider>
              </LocalizationProvider>
            </OfflineProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
