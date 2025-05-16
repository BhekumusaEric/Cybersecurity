import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define context type
interface AccessibilityContextType {
  isScreenReaderEnabled: boolean;
  isReduceMotionEnabled: boolean;
  isBoldTextEnabled: boolean;
  isGrayscaleEnabled: boolean;
  isInvertColorsEnabled: boolean;
  fontSizeMultiplier: number;
  setFontSizeMultiplier: (size: number) => Promise<void>;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => Promise<void>;
  announceForAccessibility: (message: string) => void;
}

// Create context with default values
const AccessibilityContext = createContext<AccessibilityContextType>({
  isScreenReaderEnabled: false,
  isReduceMotionEnabled: false,
  isBoldTextEnabled: false,
  isGrayscaleEnabled: false,
  isInvertColorsEnabled: false,
  fontSizeMultiplier: 1,
  setFontSizeMultiplier: async () => {},
  highContrast: false,
  setHighContrast: async () => {},
  announceForAccessibility: () => {},
});

// Custom hook to use the accessibility context
export const useAccessibility = () => useContext(AccessibilityContext);

interface AccessibilityProviderProps {
  children: ReactNode;
}

// Accessibility provider component
export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  const [isReduceMotionEnabled, setIsReduceMotionEnabled] = useState(false);
  const [isBoldTextEnabled, setIsBoldTextEnabled] = useState(false);
  const [isGrayscaleEnabled, setIsGrayscaleEnabled] = useState(false);
  const [isInvertColorsEnabled, setIsInvertColorsEnabled] = useState(false);
  const [fontSizeMultiplier, setFontSizeMultiplierState] = useState(1);
  const [highContrast, setHighContrastState] = useState(false);

  // Initialize accessibility settings
  useEffect(() => {
    const initializeAccessibility = async () => {
      // Check screen reader status
      const screenReaderEnabled = await AccessibilityInfo.isScreenReaderEnabled();
      setIsScreenReaderEnabled(screenReaderEnabled);

      // Check reduce motion status
      const reduceMotionEnabled = await AccessibilityInfo.isReduceMotionEnabled();
      setIsReduceMotionEnabled(reduceMotionEnabled);

      // Check bold text status
      const boldTextEnabled = await AccessibilityInfo.isBoldTextEnabled();
      setIsBoldTextEnabled(boldTextEnabled);

      // Check grayscale status (iOS only)
      if (Platform.OS === 'ios') {
        const grayscaleEnabled = await AccessibilityInfo.isGrayscaleEnabled();
        setIsGrayscaleEnabled(grayscaleEnabled);
      }

      // Check invert colors status (iOS only)
      if (Platform.OS === 'ios') {
        const invertColorsEnabled = await AccessibilityInfo.isInvertColorsEnabled();
        setIsInvertColorsEnabled(invertColorsEnabled);
      }

      // Load font size multiplier from AsyncStorage
      try {
        const storedFontSize = await AsyncStorage.getItem('fontSizeMultiplier');
        if (storedFontSize) {
          setFontSizeMultiplierState(parseFloat(storedFontSize));
        }
      } catch (error) {
        console.error('Failed to load font size multiplier:', error);
      }

      // Load high contrast setting from AsyncStorage
      try {
        const storedHighContrast = await AsyncStorage.getItem('highContrast');
        if (storedHighContrast) {
          setHighContrastState(storedHighContrast === 'true');
        }
      } catch (error) {
        console.error('Failed to load high contrast setting:', error);
      }
    };

    initializeAccessibility();

    // Add event listeners for accessibility changes
    const screenReaderListener = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setIsScreenReaderEnabled
    );

    const reduceMotionListener = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setIsReduceMotionEnabled
    );

    const boldTextListener = AccessibilityInfo.addEventListener(
      'boldTextChanged',
      setIsBoldTextEnabled
    );

    // iOS-specific listeners
    let grayscaleListener: { remove: () => void } | null = null;
    let invertColorsListener: { remove: () => void } | null = null;

    if (Platform.OS === 'ios') {
      grayscaleListener = AccessibilityInfo.addEventListener(
        'grayscaleChanged',
        setIsGrayscaleEnabled
      );

      invertColorsListener = AccessibilityInfo.addEventListener(
        'invertColorsChanged',
        setIsInvertColorsEnabled
      );
    }

    // Cleanup
    return () => {
      screenReaderListener.remove();
      reduceMotionListener.remove();
      boldTextListener.remove();
      
      if (grayscaleListener) {
        grayscaleListener.remove();
      }
      
      if (invertColorsListener) {
        invertColorsListener.remove();
      }
    };
  }, []);

  // Set font size multiplier
  const setFontSizeMultiplier = async (size: number) => {
    try {
      setFontSizeMultiplierState(size);
      await AsyncStorage.setItem('fontSizeMultiplier', size.toString());
    } catch (error) {
      console.error('Failed to save font size multiplier:', error);
    }
  };

  // Set high contrast
  const setHighContrast = async (enabled: boolean) => {
    try {
      setHighContrastState(enabled);
      await AsyncStorage.setItem('highContrast', enabled.toString());
    } catch (error) {
      console.error('Failed to save high contrast setting:', error);
    }
  };

  // Announce message for screen readers
  const announceForAccessibility = (message: string) => {
    AccessibilityInfo.announceForAccessibility(message);
  };

  // Context value
  const contextValue: AccessibilityContextType = {
    isScreenReaderEnabled,
    isReduceMotionEnabled,
    isBoldTextEnabled,
    isGrayscaleEnabled,
    isInvertColorsEnabled,
    fontSizeMultiplier,
    setFontSizeMultiplier,
    highContrast,
    setHighContrast,
    announceForAccessibility,
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  );
};
