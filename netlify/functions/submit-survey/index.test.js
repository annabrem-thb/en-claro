import { createRequire } from 'module';
import { describe, it, expect } from 'vitest';

// This directory has its own package.json ("type": "commonjs") and its own
// node_modules (the Netlify Functions bundling convention). Loading it via
// Node's native `require` — rather than an ESM `import`, which would run it
// through Vite's transform pipeline and could paper over module-boundary
// issues — exercises exactly what Netlify's Lambda runtime does in
// production.
const require = createRequire(import.meta.url);
const { buildDbData, validatePayload, handler } = require('./index.js');

// Mirrors the exact shape SurveyComponent.tsx sends: NasaTlxPayload fields
// spread directly (mentalDemand/physicalDemand/temporalDemand/performance/
// effort/frustration), SusPayload fields spread directly (sus01..sus10, no
// "_q"), UeqPayload fields spread directly (ueq01..ueq08, no "_q"), and
// GamificationFeedbackPayload fields (only present for a gamified session —
// see public/survey.ts).
function makeClientPayload(overrides = {}) {
  return {
    mentalDemand: 70,
    physicalDemand: 20,
    temporalDemand: 55,
    performance: 80,
    effort: 65,
    frustration: 30,
    sus01: 4,
    sus02: 2,
    sus03: 5,
    sus04: 1,
    sus05: 4,
    sus06: 2,
    sus07: 5,
    sus08: 2,
    sus09: 4,
    sus10: 1,
    ueq01: 6,
    ueq02: 5,
    ueq03: 6,
    ueq04: 5,
    ueq05: 7,
    ueq06: 6,
    ueq07: 4,
    ueq08: 5,
    gardenMotivation: 4,
    badgeMotivation: 5,
    gameDistraction: 2,
    gameElementFeedback: 'Der Garten hat mich am meisten motiviert.',
    participantId: 'participant-123',
    appVersion: 'vollversion',
    userLanguage: 'de',
    localTimestamp: '2026-08-04T12:00:00.000Z',
    theme: 'Natur',
    a11yAddons: ['LRS', 'Kontrast'],
    inclusiveOptions: { zenMode: true },
    userDifficulty: 2,
    dailyGoal: 10,
    ...overrides,
  };
}

describe('submit-survey buildDbData', () => {
  it('carries every NASA-TLX subscale through under its snake_case db column name', () => {
    const dbData = buildDbData(makeClientPayload());

    expect(dbData.mental_demand).toBe(70);
    expect(dbData.physical_demand).toBe(20);
    expect(dbData.temporal_demand).toBe(55);
    expect(dbData.performance).toBe(80);
    expect(dbData.effort).toBe(65);
    expect(dbData.frustration).toBe(30);
  });

  it('carries every SUS item through under its sus_qNN db column name', () => {
    const dbData = buildDbData(makeClientPayload());

    expect(dbData.sus_q01).toBe(4);
    expect(dbData.sus_q02).toBe(2);
    expect(dbData.sus_q03).toBe(5);
    expect(dbData.sus_q04).toBe(1);
    expect(dbData.sus_q05).toBe(4);
    expect(dbData.sus_q06).toBe(2);
    expect(dbData.sus_q07).toBe(5);
    expect(dbData.sus_q08).toBe(2);
    expect(dbData.sus_q09).toBe(4);
    expect(dbData.sus_q10).toBe(1);
  });

  it('carries every UEQ-S item through under its ueq_qNN db column name', () => {
    const dbData = buildDbData(makeClientPayload());

    expect(dbData.ueq_q01).toBe(6);
    expect(dbData.ueq_q02).toBe(5);
    expect(dbData.ueq_q03).toBe(6);
    expect(dbData.ueq_q04).toBe(5);
    expect(dbData.ueq_q05).toBe(7);
    expect(dbData.ueq_q06).toBe(6);
    expect(dbData.ueq_q07).toBe(4);
    expect(dbData.ueq_q08).toBe(5);
  });

  it('carries gamification-element feedback through for a gamified submission', () => {
    const dbData = buildDbData(makeClientPayload());

    expect(dbData.garden_motivation).toBe(4);
    expect(dbData.badge_motivation).toBe(5);
    expect(dbData.game_distraction).toBe(2);
    expect(dbData.game_element_feedback).toBe(
      'Der Garten hat mich am meisten motiviert.',
    );
  });

  // A basis-version session never shows a garden/badges, so
  // SurveyComponent.tsx omits these fields from the payload entirely
  // rather than sending a meaningless score — that must land as NULL, not
  // as an accidental 0/empty-string default.
  it('stores gamification-element feedback as NULL when absent from the payload (basis condition)', () => {
    const dbData = buildDbData(
      makeClientPayload({
        gardenMotivation: undefined,
        badgeMotivation: undefined,
        gameDistraction: undefined,
        gameElementFeedback: undefined,
      }),
    );

    expect(dbData.garden_motivation).toBeUndefined();
    expect(dbData.badge_motivation).toBeUndefined();
    expect(dbData.game_distraction).toBeUndefined();
    expect(dbData.game_element_feedback).toBeNull();
  });

  // The actual regression: this field-name mismatch (payload.mental instead
  // of payload.mentalDemand, payload.sus_q01 instead of payload.sus01, etc.)
  // was silently writing `undefined` — NULL in Postgres — for SUS and half
  // of the NASA-TLX columns on every real submission.
  it('never produces undefined for a NASA-TLX or SUS column when the client payload is well-formed', () => {
    const dbData = buildDbData(makeClientPayload());

    const measurementKeys = [
      'mental_demand',
      'physical_demand',
      'temporal_demand',
      'performance',
      'effort',
      'frustration',
      'sus_q01',
      'sus_q02',
      'sus_q03',
      'sus_q04',
      'sus_q05',
      'sus_q06',
      'sus_q07',
      'sus_q08',
      'sus_q09',
      'sus_q10',
      'ueq_q01',
      'ueq_q02',
      'ueq_q03',
      'ueq_q04',
      'ueq_q05',
      'ueq_q06',
      'ueq_q07',
      'ueq_q08',
    ];

    for (const key of measurementKeys) {
      expect(dbData[key], `${key} should not be undefined`).not.toBeUndefined();
    }
  });

  it('maps appVersion "vollversion" (gamified condition) to "gamified"', () => {
    const dbData = buildDbData(
      makeClientPayload({ appVersion: 'vollversion' }),
    );
    expect(dbData.app_version).toBe('gamified');
  });

  it('maps appVersion "basis" (control condition) to "basic"', () => {
    const dbData = buildDbData(makeClientPayload({ appVersion: 'basis' }));
    expect(dbData.app_version).toBe('basic');
  });

  it('falls back to isGamified when appVersion is absent (legacy payload shape)', () => {
    const payload = makeClientPayload({
      appVersion: undefined,
      isGamified: true,
    });
    expect(buildDbData(payload).app_version).toBe('gamified');
  });

  it('maps variantOrder and block to variant_order and block', () => {
    const dbData = buildDbData(
      makeClientPayload({
        appVersion: 'basis',
        variantOrder: 'classicFirst',
        block: 1,
      }),
    );
    expect(dbData.variant_order).toBe('classicFirst');
    expect(dbData.block).toBe(1);
  });

  it('stores variant_order and block as NULL for a survey outside a guided block', () => {
    const dbData = buildDbData(makeClientPayload());
    expect(dbData.variant_order).toBeNull();
    expect(dbData.block).toBeNull();
  });

  it('throws on an unknown appVersion instead of silently filing it as "basic"', () => {
    for (const appVersion of ['Basis', 'vollversion ', 'full', '', 7, true]) {
      expect(
        () => buildDbData(makeClientPayload({ appVersion })),
        `appVersion=${JSON.stringify(appVersion)}`,
      ).toThrow(/appVersion/);
    }
  });

  it('throws when neither appVersion nor a boolean isGamified is present', () => {
    expect(() =>
      buildDbData(makeClientPayload({ appVersion: undefined })),
    ).toThrow(/appVersion is required/);
    expect(() =>
      buildDbData(
        makeClientPayload({ appVersion: undefined, isGamified: 'yes' }),
      ),
    ).toThrow(/appVersion is required/);
  });

  it('accepts the already-English condition names as well', () => {
    expect(
      buildDbData(makeClientPayload({ appVersion: 'gamified' })).app_version,
    ).toBe('gamified');
    expect(
      buildDbData(makeClientPayload({ appVersion: 'basic' })).app_version,
    ).toBe('basic');
  });

  it('translates theme, language, and a11y addon labels to English for analysis', () => {
    const dbData = buildDbData(makeClientPayload());

    expect(dbData.theme).toBe('Nature');
    expect(dbData.user_language).toBe('German');
    expect(JSON.parse(dbData.a11y_addons)).toEqual([
      'Friendly font',
      'High contrast',
    ]);
  });

  it('serializes inclusiveOptions as JSON and passes participant/session metadata through unchanged', () => {
    const dbData = buildDbData(makeClientPayload());

    expect(JSON.parse(dbData.inclusive_options)).toEqual({ zenMode: true });
    expect(dbData.participant_id).toBe('participant-123');
    expect(dbData.local_timestamp).toBe('2026-08-04T12:00:00.000Z');
    expect(dbData.user_difficulty).toBe(2);
    expect(dbData.daily_goal).toBe(10);
  });
});

describe('submit-survey validatePayload', () => {
  it('accepts a well-formed client payload', () => {
    expect(validatePayload(makeClientPayload())).toBeNull();
  });

  it('rejects a non-object payload', () => {
    expect(validatePayload(null)).toMatch(/object/i);
    expect(validatePayload([1, 2, 3])).toMatch(/object/i);
    expect(validatePayload('hi')).toMatch(/object/i);
  });

  it('rejects a numeric field sent as the wrong type', () => {
    const error = validatePayload(
      makeClientPayload({ mentalDemand: 'seventy' }),
    );
    expect(error).toMatch(/mentalDemand/);
  });

  it('rejects a string field sent as the wrong type', () => {
    const error = validatePayload(makeClientPayload({ participantId: 123 }));
    expect(error).toMatch(/participantId/);
  });

  it('rejects a UEQ-S field sent as the wrong type', () => {
    const error = validatePayload(makeClientPayload({ ueq03: 'six' }));
    expect(error).toMatch(/ueq03/);
  });

  it('rejects a gamification-feedback numeric field sent as the wrong type', () => {
    const error = validatePayload(
      makeClientPayload({ gardenMotivation: 'lots' }),
    );
    expect(error).toMatch(/gardenMotivation/);
  });

  it('accepts a payload with gamification-feedback fields omitted (basis condition)', () => {
    const error = validatePayload(
      makeClientPayload({
        gardenMotivation: undefined,
        badgeMotivation: undefined,
        gameDistraction: undefined,
        gameElementFeedback: undefined,
      }),
    );
    expect(error).toBeNull();
  });

  it('rejects an unknown or missing appVersion with a validation error', () => {
    expect(validatePayload(makeClientPayload({ appVersion: 'Basis' }))).toMatch(
      /Unknown appVersion/,
    );
    expect(
      validatePayload(makeClientPayload({ appVersion: undefined })),
    ).toMatch(/appVersion is required/);
  });

  it('accepts a valid variantOrder and block', () => {
    expect(
      validatePayload(
        makeClientPayload({ variantOrder: 'gamifiedFirst', block: 2 }),
      ),
    ).toBeNull();
  });

  it('accepts a variantOrder without a block (participant with an order, survey opened manually)', () => {
    expect(
      validatePayload(makeClientPayload({ variantOrder: 'classicFirst' })),
    ).toBeNull();
  });

  it('rejects an unknown variantOrder', () => {
    const error = validatePayload(
      makeClientPayload({ variantOrder: 'random', block: 1 }),
    );
    expect(error).toMatch(/variantOrder/);
  });

  it('rejects a block outside 1-2', () => {
    for (const block of [0, 3, '1', 1.5]) {
      const error = validatePayload(
        makeClientPayload({ variantOrder: 'classicFirst', block }),
      );
      expect(error, `block=${JSON.stringify(block)}`).toMatch(/block/);
    }
  });

  it('rejects a block sent without its variantOrder', () => {
    const error = validatePayload(makeClientPayload({ block: 1 }));
    expect(error).toMatch(/variantOrder is required/);
  });

  it('rejects a11yAddons that is not an array', () => {
    const error = validatePayload(
      makeClientPayload({ a11yAddons: 'LRS,Kontrast' }),
    );
    expect(error).toMatch(/a11yAddons/);
  });

  it('rejects inclusiveOptions that is not a plain object', () => {
    const error = validatePayload(
      makeClientPayload({ inclusiveOptions: ['zenMode'] }),
    );
    expect(error).toMatch(/inclusiveOptions/);
  });
});

describe('submit-survey handler', () => {
  const originalUrl = process.env.SUPABASE_URL;
  const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  function restoreEnv() {
    process.env.SUPABASE_URL = originalUrl;
    process.env.SUPABASE_SERVICE_ROLE_KEY = originalKey;
  }

  it('rejects non-POST requests with 405', async () => {
    const response = await handler({ httpMethod: 'GET' }, {});
    expect(response.statusCode).toBe(405);
  });

  it('rejects a malformed JSON body with 400 instead of a raw parse-error message', async () => {
    const response = await handler(
      { httpMethod: 'POST', body: '{not valid json' },
      {},
    );
    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.error).toBe('Invalid JSON body.');
  });

  it('rejects a payload that fails validation with 400', async () => {
    const response = await handler(
      {
        httpMethod: 'POST',
        body: JSON.stringify(makeClientPayload({ dailyGoal: 'lots' })),
      },
      {},
    );
    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.error).toMatch(/dailyGoal/);
  });

  it('answers an unknown appVersion with 400, never inserting it under a guessed condition', async () => {
    const response = await handler(
      {
        httpMethod: 'POST',
        body: JSON.stringify(makeClientPayload({ appVersion: 'Basis' })),
      },
      {},
    );
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body).error).toMatch(/Unknown appVersion/);
  });

  // Regression test for the leak: index.js used to return
  // `{ error: 'Internal Server Error', details: error.message }`, exposing
  // whatever the Supabase client (or, before validation existed, a raw
  // JSON.parse crash) said internally. Unsetting the Supabase env vars
  // deterministically triggers the same catch block without a network call.
  it('never leaks internal error details in a 500 response', async () => {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    const response = await handler(
      { httpMethod: 'POST', body: JSON.stringify(makeClientPayload()) },
      {},
    );

    restoreEnv();

    expect(response.statusCode).toBe(500);
    const body = JSON.parse(response.body);
    expect(body).toEqual({ error: 'Internal Server Error' });
    expect(body.details).toBeUndefined();
  });
});
