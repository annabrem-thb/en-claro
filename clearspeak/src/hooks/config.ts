import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enDictionary from '../i18n-core/locales/en.json';
import plDictionary from '../i18n-core/locales/pl.json';
import deDictionary from '../i18n-core/locales/de.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enDictionary },
      pl: { translation: plDictionary },
      de: { translation: deDictionary },
    },
    lng: 'pl',
    fallbackLng: 'en',
    
    defaultNS: 'translation',
    
    interpolation: {
      escapeValue: false, 
    },
    
    debug: process.env.NODE_ENV === 'development',
  });

export default i18n;

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: typeof enDictionary;
    };
  }
}