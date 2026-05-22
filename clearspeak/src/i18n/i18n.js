import pl from './pl.js';
import en from './en.js';
import de from './de.js';

export const translations = { pl, en, de };

export const useTranslation = (language) => {
  return translations[language] || translations.de;
};