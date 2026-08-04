const { createClient } = require('@supabase/supabase-js');

// Dictionaries mapping app values to plain English (for data analysis)
const themeMap = {
  Natur: 'Nature',
  Musik: 'Music',
  Kunst: 'Art',
  Space: 'Space',
  Ocean: 'Ocean',
};

const a11yMap = {
  LRS: 'Friendly font',
  Kontrast: 'High contrast',
  Motorik: 'Comfortable buttons',
  Niedowidzenie: 'Larger text',
  Daltonizm: 'Safe colors',
  Redukcja: 'Calm screen',
  Linijka: 'Focus ruler',
  Spacing: 'Larger spacing',
  Desaturacja: 'Soft colors',
};

const langMap = {
  pl: 'Polish',
  de: 'German',
  en: 'English',
};

// Pure mapping from the raw client payload (see SurveyComponent.tsx,
// NasaTlxPayload/SusPayload in public/survey.ts) to the ab_study_submissions
// row shape (see src/server/00_survey_schema.sql). Kept separate from the
// handler's I/O (Supabase call, HTTP response) so the mapping — the part
// that previously silently dropped SUS and half of the NASA-TLX data via a
// field-name mismatch — can be regression-tested without a network call.
function buildDbData(payload) {
  // Standardization and translation of parameters to English
  const rawVersion =
    payload.appVersion || (payload.isGamified ? 'gamified' : 'basic');
  const appVersionEn =
    rawVersion === 'vollversion' || rawVersion === 'gamified'
      ? 'gamified'
      : 'basic';

  const translatedTheme = themeMap[payload.theme] || payload.theme;
  const translatedLang = langMap[payload.userLanguage] || payload.userLanguage;

  let translatedAddons = payload.a11yAddons;
  if (Array.isArray(payload.a11yAddons)) {
    translatedAddons = payload.a11yAddons.map(
      (addon) => a11yMap[addon] || addon,
    );
  }

  return {
    app_version: appVersionEn,

    local_timestamp: payload.localTimestamp || null,
    participant_id: payload.participantId || null,
    user_language: translatedLang || null,
    theme: translatedTheme || null,

    a11y_addons: translatedAddons ? JSON.stringify(translatedAddons) : null,
    inclusive_options: payload.inclusiveOptions
      ? JSON.stringify(payload.inclusiveOptions)
      : null,

    user_difficulty: payload.userDifficulty,
    daily_goal: payload.dailyGoal,

    // NASA Raw TLX: SurveyComponent.tsx spreads `...nasaScores` (a
    // NasaTlxPayload) straight into the payload, so the keys here are
    // mentalDemand/physicalDemand/temporalDemand, not mental/physical/
    // temporal. performance/effort/frustration happened to already match
    // by coincidence — the other three were silently landing as
    // `undefined` (i.e. NULL in Postgres) on every submission.
    mental_demand: payload.mentalDemand,
    physical_demand: payload.physicalDemand,
    temporal_demand: payload.temporalDemand,
    performance: payload.performance,
    effort: payload.effort,
    frustration: payload.frustration,

    // SUS Survey: SurveyComponent.tsx spreads `...susScores` (a
    // SusPayload) with keys sus01..sus10 (no "_q"), so payload.sus_q01
    // etc. was always `undefined` here — every SUS response was being
    // discarded before it ever reached ab_study_submissions.
    sus_q01: payload.sus01,
    sus_q02: payload.sus02,
    sus_q03: payload.sus03,
    sus_q04: payload.sus04,
    sus_q05: payload.sus05,
    sus_q06: payload.sus06,
    sus_q07: payload.sus07,
    sus_q08: payload.sus08,
    sus_q09: payload.sus09,
    sus_q10: payload.sus10,
  };
}

exports.buildDbData = buildDbData;

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error(
        'Missing Supabase environment variables in Netlify configuration.',
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload = JSON.parse(event.body);
    const dbData = buildDbData(payload);

    const { data, error } = await supabase
      .from('ab_study_submissions')
      .insert([dbData]);

    if (error) throw error;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Survey results saved successfully!' }),
    };
  } catch (error) {
    console.error('Database insertion error:', error.message);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal Server Error',
        details: error.message,
      }),
    };
  }
};
