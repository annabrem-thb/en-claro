import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { loadLanguageDictionary } from '../locales';
import buildTranslationEN from '../locales/en.js';
import buildTranslationPL from '../locales/pl.js';

// Only `lng` ('pl') and `fallbackLng` ('en') are loaded synchronously here —
// those are the two i18next genuinely needs available before the first
// render (the fallback resolves any key missing from the active language).
// German was being eagerly bundled too despite being neither, which put its
// ~23KB of JSON straight into the critical-path bundle for every visitor
// who never touches it — Lighthouse's "Reduce unused JavaScript" flagged
// exactly this. It's dynamically imported below instead, right after init,
// so it lands in its own chunk and is already loaded by the time a real
// user could reach Settings and pick Deutsch.
const enDictionary = buildTranslationEN();
const plDictionary = buildTranslationPL();

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enDictionary },
    pl: { translation: plDictionary },
  },
  lng: 'pl',
  fallbackLng: 'en',

  defaultNS: 'translation',

  interpolation: {
    escapeValue: false,
  },

  debug: process.env.NODE_ENV === 'development',
});

loadLanguageDictionary('de').then((deDictionary) => {
  i18n.addResourceBundle('de', 'translation', deDictionary, true, true);
});

export default i18n;

// Deliberately no `declare module 'i18next' { interface CustomTypeOptions ... }`
// augmentation here: the dictionary mixes dot-path nested keys with
// colon-namespaced keys, so a typed resource shape either rejects real call
// sites or blows the type-checker's instantiation depth on this large a
// dictionary. `t()` falls back to accepting any string key, which matches how
// the app actually calls it today.
