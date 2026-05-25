import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import complete dictionaries
import enDictionary from './locales/en.json';
import plDictionary from './locales/pl.json';
import deDictionary from './locales/de.json';

/**
 * Core i18n configuration initializing the translation engine.
 * We explicitly bind resources to our separated namespaces to promote DRY modularity.
 */
i18n
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .init({
    resources: {
      en: enDictionary,
      pl: plDictionary,
      de: deDictionary,
    },
    lng: 'en', // Default initial language
    fallbackLng: 'en',
    
    // Default namespace to load if a component doesn't specify one
    defaultNS: 'common',
    
    interpolation: {
      // React already safely escapes values to prevent XSS
      escapeValue: false, 
    },
    
    // Enable debug logging in development for tracking down missing keys
    debug: process.env.NODE_ENV === 'development',
  });

export default i18n;

// Extend the 'i18next' module definitions to include our strict schema 
// so TypeScript enforces correct keys in the `t()` function.
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: typeof enDictionary;
  }
}