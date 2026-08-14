import plCommon from './pl/common.json';
import plErrors from './pl/errors.json';
import plFeedback from './pl/feedback.json';
import plProfileDashboard from './pl/profileDashboard.json';
import plSurvey from './pl/survey.json';
import plTranslation from './pl/translation.json';

// Split into its own module (one per language) so each is its own Vite
// chunk — see loadLanguageDictionary in index.js for why. This one is
// imported eagerly by src/i18n/config.ts (it's the app's default `lng`),
// unlike de.js.
export default function buildTranslationPL() {
  return {
    ...plTranslation,
    common: plCommon,
    profileDashboard: plProfileDashboard,
    errors: plErrors,
    feedback: plFeedback,
    survey: plSurvey,
  };
}
