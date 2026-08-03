import deCommon from './de/common.json';
import deErrors from './de/errors.json';
import deFeedback from './de/feedback.json';
import deProfile from './de/profile.json';
import deSurvey from './de/survey.json';
import deTranslation from './de/translation.json';
import enCommon from './en/common.json';
import enErrors from './en/errors.json';
import enFeedback from './en/feedback.json';
import enProfile from './en/profile.json';
import enSurvey from './en/survey.json';
import enTranslation from './en/translation.json';
import plCommon from './pl/common.json';
import plErrors from './pl/errors.json';
import plFeedback from './pl/feedback.json';
import plProfile from './pl/profile.json';
import plSurvey from './pl/survey.json';
import plTranslation from './pl/translation.json';

const namespacesByLanguage = {
  en: {
    translation: enTranslation,
    common: enCommon,
    profile: enProfile,
    errors: enErrors,
    feedback: enFeedback,
    survey: enSurvey,
  },
  de: {
    translation: deTranslation,
    common: deCommon,
    profile: deProfile,
    errors: deErrors,
    feedback: deFeedback,
    survey: deSurvey,
  },
  pl: {
    translation: plTranslation,
    common: plCommon,
    profile: plProfile,
    errors: plErrors,
    feedback: plFeedback,
    survey: plSurvey,
  },
};

// Flattens a language's per-namespace files back into the single nested
// dictionary shape the app expects (`{ ...flatKeys, common: {...}, profile: {...}, ... }`).
export function buildTranslation(language) {
  const { translation, ...namespaces } = namespacesByLanguage[language];
  return { ...translation, ...namespaces };
}

export const SUPPORTED_LANGUAGES = Object.keys(namespacesByLanguage);
