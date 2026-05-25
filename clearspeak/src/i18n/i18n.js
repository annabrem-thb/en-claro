import plDict from '../i18n-core/locales/pl.json';
import enDict from '../i18n-core/locales/en.json';
import deDict from '../i18n-core/locales/de.json';

// Rebuild dynamic functions that cannot be natively serialized in JSON dictionaries
const dynamicBindings = {
  pl: {
    questLabel: (target, type, pillars) => `Wyzwanie (${target}): ${type === 'Any' ? 'Dowolne' : pillars[type] || type}`,
    removeCut: (pos) => `Usuń cięcie w pozycji ${pos}`,
    addCut: (pos) => `Dodaj cięcie w pozycji ${pos}`,
  },
  en: {
    questLabel: (target, type, pillars) => `Challenge (${target}): ${type === 'Any' ? 'Any' : pillars[type] || type}`,
    removeCut: (pos) => `Remove cut at position ${pos}`,
    addCut: (pos) => `Add cut at position ${pos}`,
  },
  de: {
    questLabel: (target, type, pillars) => `Herausforderung (${target}): ${type === 'Any' ? 'Beliebig' : pillars[type] || type}`,
    removeCut: (pos) => `Schnitt an Position ${pos} entfernen`,
    addCut: (pos) => `Schnitt an Position ${pos} hinzufügen`,
  }
};

export const translations = { 
  pl: { ...plDict, ...dynamicBindings.pl }, 
  en: { ...enDict, ...dynamicBindings.en }, 
  de: { ...deDict, ...dynamicBindings.de } 
};

export const useTranslation = (language) => {
  return translations[language] || translations.de;
};