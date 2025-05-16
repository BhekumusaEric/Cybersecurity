/**
 * Accessibility Context
 *
 * This context provides accessibility features for the app.
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AccessibilityInfo } from 'react-native';

// Create context
const AccessibilityContext = createContext();

// Provider component
export const AccessibilityProvider = ({ children }) => {
  // Font size multiplier (1.0 is default)
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1.0);

  // High contrast mode
  const [highContrastMode, setHighContrastMode] = useState(false);

  // Reduce motion
  const [reduceMotion, setReduceMotion] = useState(false);

  // Screen reader active
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);

  // Bold text
  const [boldText, setBoldText] = useState(false);

  // Load saved settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Load font size multiplier
        const savedFontSize = await AsyncStorage.getItem('accessibility_fontSize');
        if (savedFontSize) {
          setFontSizeMultiplier(parseFloat(savedFontSize));
        }

        // Load high contrast mode
        const savedHighContrast = await AsyncStorage.getItem('accessibility_highContrast');
        if (savedHighContrast) {
          setHighContrastMode(savedHighContrast === 'true');
        }

        // Load reduce motion
        const savedReduceMotion = await AsyncStorage.getItem('accessibility_reduceMotion');
        if (savedReduceMotion) {
          setReduceMotion(savedReduceMotion === 'true');
        }

        // Load bold text
        const savedBoldText = await AsyncStorage.getItem('accessibility_boldText');
        if (savedBoldText) {
          setBoldText(savedBoldText === 'true');
        }
      } catch (error) {
        console.error('Error loading accessibility settings:', error);
      }
    };

    loadSettings();

    // Listen for screen reader changes
    const screenReaderListener = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      isScreenReaderEnabled => {
        setScreenReaderEnabled(isScreenReaderEnabled);
      }
    );

    // Check if screen reader is enabled
    AccessibilityInfo.isScreenReaderEnabled().then(isScreenReaderEnabled => {
      setScreenReaderEnabled(isScreenReaderEnabled);
    });

    // Cleanup
    return () => {
      screenReaderListener.remove();
    };
  }, []);

  // Change font size
  const changeFontSize = async (size) => {
    try {
      setFontSizeMultiplier(size);
      await AsyncStorage.setItem('accessibility_fontSize', size.toString());
    } catch (error) {
      console.error('Error saving font size:', error);
    }
  };

  // Toggle high contrast mode
  const toggleHighContrastMode = async () => {
    try {
      const newValue = !highContrastMode;
      setHighContrastMode(newValue);
      await AsyncStorage.setItem('accessibility_highContrast', newValue.toString());
    } catch (error) {
      console.error('Error saving high contrast mode:', error);
    }
  };

  // Toggle reduce motion
  const toggleReduceMotion = async () => {
    try {
      const newValue = !reduceMotion;
      setReduceMotion(newValue);
      await AsyncStorage.setItem('accessibility_reduceMotion', newValue.toString());
    } catch (error) {
      console.error('Error saving reduce motion:', error);
    }
  };

  // Toggle bold text
  const toggleBoldText = async () => {
    try {
      const newValue = !boldText;
      setBoldText(newValue);
      await AsyncStorage.setItem('accessibility_boldText', newValue.toString());
    } catch (error) {
      console.error('Error saving bold text:', error);
    }
  };

  // Reset all settings to default
  const resetSettings = async () => {
    try {
      setFontSizeMultiplier(1.0);
      setHighContrastMode(false);
      setReduceMotion(false);
      setBoldText(false);

      await AsyncStorage.setItem('accessibility_fontSize', '1.0');
      await AsyncStorage.setItem('accessibility_highContrast', 'false');
      await AsyncStorage.setItem('accessibility_reduceMotion', 'false');
      await AsyncStorage.setItem('accessibility_boldText', 'false');
    } catch (error) {
      console.error('Error resetting accessibility settings:', error);
    }
  };

  // Get font size based on multiplier
  const getFontSize = (baseSize) => {
    try {
      if (baseSize === undefined || baseSize === null) {
        return 14 * fontSizeMultiplier; // Default size if baseSize is not provided
      }
      return baseSize * fontSizeMultiplier;
    } catch (error) {
      console.error('Error getting font size:', error);
      return baseSize || 14; // Return original size or default
    }
  };

  // Get font weight based on bold text setting
  const getFontWeight = (baseWeight = 'normal') => {
    try {
      if (boldText) {
        // If base weight is already bold, keep it
        if (baseWeight === 'bold' || baseWeight === '700' || baseWeight === '800' || baseWeight === '900') {
          return baseWeight;
        }
        // Otherwise, make it bold
        return 'bold';
      }
      return baseWeight;
    } catch (error) {
      console.error('Error getting font weight:', error);
      return baseWeight; // Return original weight
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
        fontSizeMultiplier,
        highContrastMode,
        reduceMotion,
        screenReaderEnabled,
        boldText,
        changeFontSize,
        toggleHighContrastMode,
        toggleReduceMotion,
        toggleBoldText,
        resetSettings,
        getFontSize,
        getFontWeight,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

// Custom hook
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export default AccessibilityContext;
