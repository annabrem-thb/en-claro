import deCommon from './de/common.json';
import deErrors from './de/errors.json';
import deFeedback from './de/feedback.json';
import deProfileDashboard from './de/profileDashboard.json';
import deSurvey from './de/survey.json';
import deTranslation from './de/translation.json';
import enCommon from './en/common.json';
import enErrors from './en/errors.json';
import enFeedback from './en/feedback.json';
import enProfileDashboard from './en/profileDashboard.json';
import enSurvey from './en/survey.json';
import enTranslation from './en/translation.json';
import plCommon from './pl/common.json';
import plErrors from './pl/errors.json';
import plFeedback from './pl/feedback.json';
import plProfileDashboard from './pl/profileDashboard.json';
import plSurvey from './pl/survey.json';
import plTranslation from './pl/translation.json';

// NOTE: `profileDashboard` (from the old hooks/*.json fragments) is a distinct
// namespace from the flat `profile` key inside translation.json. `profile` is
// a plain string ("Profile"/"Profil") used as a nav-label by the app today;
// `profileDashboard` is unused scaffold content for the dead UserProfileDashboard.tsx
// component. Keep them under different keys — merging them under the same
// name previously corrupted the string into a character-indexed object.
const namespacesByLanguage = {
  en: {
    translation: enTranslation,
    common: enCommon,
    profileDashboard: enProfileDashboard,
    errors: enErrors,
    feedback: enFeedback,
    survey: enSurvey,
  },
  de: {
    translation: deTranslation,
    common: deCommon,
    profileDashboard: deProfileDashboard,
    errors: deErrors,
    feedback: deFeedback,
    survey: deSurvey,
  },
  pl: {
    translation: plTranslation,
    common: plCommon,
    profileDashboard: plProfileDashboard,
    errors: plErrors,
    feedback: plFeedback,
    survey: plSurvey,
  },
};

// Flattens a language's per-namespace files back into the single nested
// dictionary shape the app expects (`{ ...flatKeys, common: {...}, profileDashboard: {...}, ... }`).
export function buildTranslation(language) {
  const { translation, ...namespaces } = namespacesByLanguage[language];
  return { ...translation, ...namespaces };
}

export const SUPPORTED_LANGUAGES = Object.keys(namespacesByLanguage);
