import enCommon from './en/common.json';
import enErrors from './en/errors.json';
import enFeedback from './en/feedback.json';
import enProfileDashboard from './en/profileDashboard.json';
import enSurvey from './en/survey.json';
import enTranslation from './en/translation.json';

// Imported eagerly by src/i18n/config.ts — this is i18next's `fallbackLng`,
// so it must be synchronously available to resolve any key missing from
// the active language, not just when English is the active language.
export default function buildTranslationEN() {
  return {
    ...enTranslation,
    common: enCommon,
    profileDashboard: enProfileDashboard,
    errors: enErrors,
    feedback: enFeedback,
    survey: enSurvey,
  };
}
