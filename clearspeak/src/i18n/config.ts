import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { buildTranslation } from '../locales';

const enDictionary = buildTranslation('en');
const plDictionary = buildTranslation('pl');
const deDictionary = buildTranslation('de');

i18n.use(initReactI18next).init({
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

// Deliberately no `declare module 'i18next' { interface CustomTypeOptions ... }`
// augmentation here: the dictionary mixes dot-path nested keys, colon-namespaced
// keys, and two parallel translation systems (see src/i18n/i18n.js), so a typed
// resource shape either rejects real call sites or blows the type-checker's
// instantiation depth on this large a dictionary. `t()` falls back to accepting
// any string key, which matches how the app actually calls it today.
