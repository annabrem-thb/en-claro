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
// app_version is the study's independent variable, so an unrecognized value
// must fail loudly: silently coercing it to 'basic' would file a submission
// under the wrong condition with nothing to show it happened. Only the
// legacy pre-appVersion payload shape (a bare isGamified boolean) is still
// accepted as a fallback, and only when that boolean is really present.
const APP_VERSION_MAP = {
  vollversion: 'gamified',
  gamified: 'gamified',
  basis: 'basic',
  basic: 'basic',
};

// questionnaire_version 2 (SurveyComponent.tsx, see SURVEY_DRAFT_KEY_PREFIX/
// STUDY_CONSENT_KEY for the client-side bumps done alongside this) adds the
// consent screen and the "Angaben zur Person" block below. Keep these
// value lists in sync with PersonalInfoPayload in public/survey.ts and with
// the CHECK constraints in supabase/00_survey_schema.sql.
const QUESTIONNAIRE_VERSIONS = ['v2'];
const LRS_STATUS_VALUES = ['diagnosed', 'suspected', 'no', 'no_answer'];
const SLT_ROLE_VALUES = ['yes', 'training', 'no', 'no_answer'];
const AGE_GROUP_VALUES = ['18-29', '30-49', '50+', 'no_answer'];
const FIRST_LANGUAGE_VALUES = ['de', 'pl', 'en', 'other', 'no_answer'];

function resolveAppVersion(payload) {
  const raw = payload.appVersion;
  if (raw === undefined || raw === null) {
    if (typeof payload.isGamified === 'boolean') {
      return payload.isGamified ? 'gamified' : 'basic';
    }
    throw new Error('appVersion is required.');
  }
  if (typeof raw !== 'string' || !Object.hasOwn(APP_VERSION_MAP, raw)) {
    throw new Error(
      `Unknown appVersion ${JSON.stringify(raw)} (expected one of ${Object.keys(APP_VERSION_MAP).join(', ')}).`,
    );
  }
  return APP_VERSION_MAP[raw];
}

function buildDbData(payload) {
  // Standardization and translation of parameters to English
  const appVersionEn = resolveAppVersion(payload);

  const translatedTheme = themeMap[payload.theme] || payload.theme;
  const translatedLang = langMap[payload.userLanguage] || payload.userLanguage;

  let translatedAddons = payload.a11yAddons;
  if (Array.isArray(payload.a11yAddons)) {
    translatedAddons = payload.a11yAddons.map(
      (addon) => a11yMap[addon] || addon,
    );
  }

  // "Angaben zur Person" only applies to the questionnaire that closes
  // guided-study block 2 (see SurveyComponent.tsx's isPersonalInfoBlock) —
  // enforced here too, not just trusted from the client, so these four
  // columns are NULL for every other submission regardless of what a
  // malformed or out-of-date client sends.
  const isPersonalInfoBlock = payload.block === 2;

  return {
    app_version: appVersionEn,

    questionnaire_version: payload.questionnaireVersion ?? null,
    consent_given: payload.consentGiven === true,

    // Guided-study design context (SurveyComponent.tsx only sends these for
    // a participant with a study order / a block checkpoint) — NULL means
    // "not part of a guided block", not a dropped value.
    variant_order: payload.variantOrder ?? null,
    block: payload.block ?? null,

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

    // UEQ-S: SurveyComponent.tsx spreads `...ueqScores` (a UeqPayload)
    // with keys ueq01..ueq08, same convention as sus01..sus10 above.
    ueq_q01: payload.ueq01,
    ueq_q02: payload.ueq02,
    ueq_q03: payload.ueq03,
    ueq_q04: payload.ueq04,
    ueq_q05: payload.ueq05,
    ueq_q06: payload.ueq06,
    ueq_q07: payload.ueq07,
    ueq_q08: payload.ueq08,

    // Concentration/perseverance: SurveyComponent.tsx spreads
    // `...engagementScores` (an EngagementPayload). Unlike gamification
    // feedback below, these two are sent for every submission regardless
    // of condition — comparing classic vs. gamified on them needs the same
    // question answered in both blocks, not a gamified-only score.
    concentration: payload.concentration,
    perseverance: payload.perseverance,

    // Gamification-element feedback: only present in the payload for a
    // gamified submission (SurveyComponent.tsx only spreads it when
    // isGamified) — undefined/NULL here correctly means "not applicable"
    // for a basis-version submission, not a dropped answer.
    garden_motivation: payload.gardenMotivation,
    badge_motivation: payload.badgeMotivation,
    game_distraction: payload.gameDistraction,
    game_element_feedback: payload.gameElementFeedback || null,

    // "Angaben zur Person" — see isPersonalInfoBlock above. first_language
    // is stored as a JSON string, the same convention a11y_addons above
    // already uses for a list value.
    lrs_status: isPersonalInfoBlock ? (payload.lrsStatus ?? null) : null,
    slt_role: isPersonalInfoBlock ? (payload.sltRole ?? null) : null,
    age_group: isPersonalInfoBlock ? (payload.ageGroup ?? null) : null,
    first_language:
      isPersonalInfoBlock && Array.isArray(payload.firstLanguage)
        ? JSON.stringify(payload.firstLanguage)
        : null,
  };
}

exports.buildDbData = buildDbData;

const MAX_STRING_LENGTH = 500;
const VARIANT_ORDERS = ['classicFirst', 'gamifiedFirst'];
const STUDY_BLOCKS = [1, 2];

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
    'ueq01',
    'ueq02',
    'ueq03',
    'ueq04',
    'ueq05',
    'ueq06',
    'ueq07',
    'ueq08',
    'concentration',
    'perseverance',
    'gardenMotivation',
    'badgeMotivation',
    'gameDistraction',
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
    'gameElementFeedback',
  ];
  for (const field of stringFields) {
    if (payload[field] !== undefined && !isPlainString(payload[field])) {
      return `${field} must be a string.`;
    }
  }

  // Same rule as buildDbData: an unknown or missing condition is a 400, not
  // a row filed under a guessed condition.
  try {
    resolveAppVersion(payload);
  } catch (err) {
    return err.message;
  }

  if (
    payload.variantOrder !== undefined &&
    payload.variantOrder !== null &&
    !VARIANT_ORDERS.includes(payload.variantOrder)
  ) {
    return 'variantOrder must be "classicFirst" or "gamifiedFirst".';
  }

  if (
    payload.block !== undefined &&
    payload.block !== null &&
    !STUDY_BLOCKS.includes(payload.block)
  ) {
    return 'block must be 1 or 2.';
  }

  // A block number is meaningless without the order that says which
  // condition that block ran — reject rather than store an unanalyzable row.
  if (
    payload.block !== undefined &&
    payload.block !== null &&
    (payload.variantOrder === undefined || payload.variantOrder === null)
  ) {
    return 'variantOrder is required when block is set.';
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

  // questionnaire_version identifies which wording/fields a row was
  // collected under (see QUESTIONNAIRE_VERSIONS above) — every current
  // client always sends one, so a missing or unrecognized value is rejected
  // rather than silently filed as the current version.
  if (!QUESTIONNAIRE_VERSIONS.includes(payload.questionnaireVersion)) {
    return `questionnaireVersion must be one of ${QUESTIONNAIRE_VERSIONS.join(', ')}.`;
  }

  // Every submission requires consent (StudyConsentScreen.jsx) — not just
  // guided-study ones — so an absent or falsy value is a 400, never stored
  // under a guessed or defaulted consent state.
  if (payload.consentGiven !== true) {
    return 'consentGiven must be true.';
  }

  // "Angaben zur Person" only applies to the questionnaire that closes
  // guided-study block 2 — reject a value here for any other block rather
  // than silently ignoring it, since a client sending these outside block 2
  // is a sign of a stale or broken client, not something to paper over.
  const isPersonalInfoBlock = payload.block === 2;

  if (
    payload.lrsStatus !== undefined &&
    !LRS_STATUS_VALUES.includes(payload.lrsStatus)
  ) {
    return `lrsStatus must be one of ${LRS_STATUS_VALUES.join(', ')}.`;
  }
  if (
    payload.sltRole !== undefined &&
    !SLT_ROLE_VALUES.includes(payload.sltRole)
  ) {
    return `sltRole must be one of ${SLT_ROLE_VALUES.join(', ')}.`;
  }
  if (
    payload.ageGroup !== undefined &&
    !AGE_GROUP_VALUES.includes(payload.ageGroup)
  ) {
    return `ageGroup must be one of ${AGE_GROUP_VALUES.join(', ')}.`;
  }
  if (payload.firstLanguage !== undefined) {
    if (
      !Array.isArray(payload.firstLanguage) ||
      payload.firstLanguage.some((v) => !FIRST_LANGUAGE_VALUES.includes(v))
    ) {
      return `firstLanguage must be an array containing only ${FIRST_LANGUAGE_VALUES.join(', ')}.`;
    }
  }
  if (
    !isPersonalInfoBlock &&
    (payload.lrsStatus !== undefined ||
      payload.sltRole !== undefined ||
      payload.ageGroup !== undefined ||
      payload.firstLanguage !== undefined)
  ) {
    return 'lrsStatus/sltRole/ageGroup/firstLanguage are only valid when block is 2.';
  }
  if (
    isPersonalInfoBlock &&
    (payload.lrsStatus === undefined ||
      payload.sltRole === undefined ||
      payload.ageGroup === undefined ||
      !Array.isArray(payload.firstLanguage) ||
      payload.firstLanguage.length === 0)
  ) {
    return 'lrsStatus, sltRole, ageGroup, and a non-empty firstLanguage are required when block is 2.';
  }

  return null;
}

exports.validatePayload = validatePayload;

exports.handler = async (event) => {
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
    // Deliberately never logs error.message or error.details: a Postgres
    // CHECK-constraint or NOT-NULL violation's message/detail can echo back
    // the offending value (e.g. a free-text answer), and answers must never
    // land in server logs. The error code and the column/constraint name
    // (metadata, not an answer) are enough to diagnose a schema/payload
    // mismatch without risking that.
    console.error('Database insertion error:', {
      code: error.code || null,
      column: error.column || null,
      constraint: error.constraint || null,
    });

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
