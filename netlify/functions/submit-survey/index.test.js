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
// effort/frustration) plus SusPayload fields spread directly (sus01..sus10,
// no "_q"). See public/survey.ts.
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
