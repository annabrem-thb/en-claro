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

const MAX_STRING_LENGTH = 500;

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function isPlainString(value) {
  return typeof value === 'string' && value.length <= MAX_STRING_LENGTH;
}

// This endpoint is public and unauthenticated, so the body is untrusted
// input, not just a shape buildDbData can assume. Rejecting malformed
// payloads here with a 400 keeps garbage out of ab_study_submissions and
// avoids routing bad input through to the Supabase call, where a failure
// used to surface as a 500 with the raw error message below.
function validatePayload(payload) {
  if (
    payload === null ||
    typeof payload !== 'object' ||
    Array.isArray(payload)
  ) {
    return 'Payload must be a JSON object.';
  }

  const numericFields = [
    'mentalDemand',
    'physicalDemand',
    'temporalDemand',
    'performance',
    'effort',
    'frustration',
    'sus01',
    'sus02',
    'sus03',
    'sus04',
    'sus05',
    'sus06',
    'sus07',
    'sus08',
    'sus09',
    'sus10',
    'userDifficulty',
    'dailyGoal',
  ];
  for (const field of numericFields) {
    if (payload[field] !== undefined && !isFiniteNumber(payload[field])) {
      return `${field} must be a number.`;
    }
  }

  const stringFields = [
    'participantId',
    'appVersion',
    'userLanguage',
    'theme',
    'localTimestamp',
  ];
  for (const field of stringFields) {
    if (payload[field] !== undefined && !isPlainString(payload[field])) {
      return `${field} must be a string.`;
    }
  }

  if (payload.a11yAddons !== undefined && !Array.isArray(payload.a11yAddons)) {
    return 'a11yAddons must be an array.';
  }

  if (
    payload.inclusiveOptions !== undefined &&
    (typeof payload.inclusiveOptions !== 'object' ||
      payload.inclusiveOptions === null ||
      Array.isArray(payload.inclusiveOptions))
  ) {
    return 'inclusiveOptions must be an object.';
  }

  return null;
}

exports.validatePayload = validatePayload;

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON body.' }),
    };
  }

  const validationError = validatePayload(payload);
  if (validationError) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: validationError }),
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

    const dbData = buildDbData(payload);

    const { error } = await supabase
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
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
