import deCommon from './de/common.json';
import deErrors from './de/errors.json';
import deFeedback from './de/feedback.json';
import deProfileDashboard from './de/profileDashboard.json';
import deSurvey from './de/survey.json';
import deTranslation from './de/translation.json';

// NOT imported eagerly anywhere — it's neither the default `lng` nor the
// `fallbackLng` in src/i18n/config.ts, so it was pure dead weight in the
// critical-path bundle for any visitor who never switches to German
// (Lighthouse's "Reduce unused JavaScript" flagged this exact ~23KB of
// JSON). config.ts dynamically imports this module in the background right
// after init instead, registering it via `i18n.addResourceBundle` once it
// arrives — by the time a real user opens Settings and picks Deutsch, it's
// already loaded.
export default function buildTranslationDE() {
  return {
    ...deTranslation,
    common: deCommon,
    profileDashboard: deProfileDashboard,
    errors: deErrors,
    feedback: deFeedback,
    survey: deSurvey,
  };
}
