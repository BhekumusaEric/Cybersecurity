/**
 * App component test
 *
 * This test verifies that the App component renders correctly.
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import App from '../App';

// Mock the components used in App.js
jest.mock('../navigation/AppNavigator', () => {
  const { View, Text } = require('react-native');
  return function MockAppNavigator() {
    return (
      <View testID="app-navigator">
        <Text>Mock App Navigator</Text>
      </View>
    );
  };
});

// Mock the context providers
jest.mock('../context/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
}));

jest.mock('../context/ThemeContext', () => ({
  ThemeProvider: ({ children }) => children,
}));

jest.mock('../context/OfflineContext', () => ({
  OfflineProvider: ({ children }) => children,
}));

jest.mock('../context/LocalizationContext', () => ({
  LocalizationProvider: ({ children }) => children,
}));

jest.mock('../context/AccessibilityContext', () => ({
  AccessibilityProvider: ({ children }) => children,
}));

describe('App', () => {
  it('renders correctly', async () => {
    const { getByTestId } = render(<App />);

    await waitFor(() => {
      expect(getByTestId('app-navigator')).toBeTruthy();
    });
  });
});
