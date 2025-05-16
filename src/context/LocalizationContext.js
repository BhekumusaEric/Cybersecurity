/**
 * Localization Context
 *
 * This context provides localization functionality for the app.
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../utils/i18n';

// Create context
const LocalizationContext = createContext();

// Provider component
export const LocalizationProvider = ({ children }) => {
  const [locale, setLocale] = useState('en');
  const [isRTL, setIsRTL] = useState(false);

  // Load saved locale
  useEffect(() => {
    const loadLocale = async () => {
      try {
        const savedLocale = await AsyncStorage.getItem('locale');
        if (savedLocale) {
          changeLocale(savedLocale);
        }
      } catch (error) {
        console.error('Error loading locale:', error);
      }
    };

    loadLocale();
  }, []);

  // Change locale
  const changeLocale = async (newLocale) => {
    try {
      if (i18n.translations[newLocale]) {
        setLocale(newLocale);
        i18n.setLocale(newLocale);

        try {
          // Check if the language is RTL
          const rtlLanguages = ['ar', 'he', 'ur'];
          const newIsRTL = rtlLanguages.includes(newLocale);

          // Only update if RTL status changed
          if (newIsRTL !== isRTL) {
            setIsRTL(newIsRTL);
            I18nManager.forceRTL(newIsRTL);
          }
        } catch (error) {
          console.error('Error handling RTL:', error);
        }

        // Save locale
        await AsyncStorage.setItem('locale', newLocale);
      }
    } catch (error) {
      console.error('Error changing locale:', error);
    }
  };

  // Translate function
  const t = (key, options) => {
    try {
      return i18n.t(key, options);
    } catch (error) {
      console.error('Translation error:', error);
      return key;
    }
  };

  return (
    <LocalizationContext.Provider
      value={{
        locale,
        isRTL,
        t,
        changeLocale,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};

// Custom hook
export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};

export default LocalizationContext;
