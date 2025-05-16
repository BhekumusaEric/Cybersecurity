import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';

import i18n, {
  initializeLocale,
  setLocale,
  getCurrentLocale,
  getAvailableLocales,
  getLocaleName
} from '../utils/i18n';

// Define context type
interface LocalizationContextType {
  t: (key: string, options?: object) => string;
  locale: string;
  setLocale: (locale: string) => Promise<void>;
  availableLocales: string[];
  getLocaleName: (locale: string) => string;
  isRTL: boolean;
}

// Create context with default values
const LocalizationContext = createContext<LocalizationContextType>({
  t: (key: string, options?: object) => key,
  locale: 'en',
  setLocale: async () => {},
  availableLocales: [],
  getLocaleName: () => '',
  isRTL: false,
});

// Custom hook to use the localization context
export const useLocalization = () => useContext(LocalizationContext);

interface LocalizationProviderProps {
  children: ReactNode;
}

// Localization provider component
export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({ children }) => {
  const [locale, setLocaleState] = useState(getCurrentLocale());
  const [isRTL, setIsRTL] = useState(false);

  // Initialize localization
  useEffect(() => {
    const initialize = async () => {
      await initializeLocale();
      setLocaleState(getCurrentLocale());
      updateRTL(getCurrentLocale());
    };

    initialize();

    // Add event listener for locale changes
    const localizationChangeSubscription = RNLocalize.addEventListener('change', () => {
      initialize();
    });

    // Cleanup
    return () => {
      localizationChangeSubscription.remove();
    };
  }, []);

  // Update RTL status based on locale
  const updateRTL = (locale: string) => {
    // RTL languages: Arabic (ar), Hebrew (he), Persian/Farsi (fa), Urdu (ur)
    const rtlLocales = ['ar', 'he', 'fa', 'ur'];
    setIsRTL(rtlLocales.includes(locale));
  };

  // Change locale
  const changeLocale = async (newLocale: string) => {
    try {
      await setLocale(newLocale);
      setLocaleState(newLocale);
      updateRTL(newLocale);
    } catch (error) {
      console.error('Error changing locale:', error);
    }
  };

  // Translation function
  const t = (key: string, options?: object): string => {
    try {
      // Split the key by dots to access nested properties
      const keys = key.split('.');

      // Get the translation object
      const translations = i18n.translations || {};
      let translation: any = translations[locale] || {};

      // Navigate through the nested properties
      for (const k of keys) {
        if (translation && translation[k] !== undefined) {
          translation = translation[k];
        } else {
          // If the key doesn't exist, return the key itself
          return key;
        }
      }

      // If the translation is a string, return it
      if (typeof translation === 'string') {
        // Replace placeholders with values from options
        if (options) {
          return Object.entries(options).reduce((acc, [key, value]) => {
            return acc.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
          }, translation);
        }
        return translation;
      }

      // If the translation is not a string, return the key
      return key;
    } catch (error) {
      console.error('Translation error:', error);
      return key;
    }
  };

  // Context value
  const contextValue: LocalizationContextType = {
    t,
    locale,
    setLocale: changeLocale,
    availableLocales: getAvailableLocales(),
    getLocaleName,
    isRTL,
  };

  return (
    <LocalizationContext.Provider value={contextValue}>
      {children}
    </LocalizationContext.Provider>
  );
};
