import { fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import i18n from '../i18n/config';

import { SurveyComponent } from './SurveyComponent';

let mockIsGamified = false;

vi.mock('../hooks/useGamification.js', () => ({
  useGamification: () => ({ isGamified: mockIsGamified }),
}));

vi.mock('../hooks/useUserSettingsContext.js', () => ({
  useUserSettingsContext: () => ({
    settings: {
      language: 'pl',
      theme: 'Natur',
      userDifficulty: 2,
      dailyGoal: 5,
      voiceAssistant: false,
      contrast: false,
      bionicReading: false,
      adaptiveDifficulty: false,
      bigTargets: false,
      noFlash: false,
      audioRewards: false,
      extendedTime: false,
      zenMode: false,
      minimalist: false,
      muteNotifications: false,
      lrs: false,
      motorik: false,
      color: false,
      motion: false,
      ruler: false,
      desaturation: false,
      fontSizeUi: 16,
      fontSizeExercise: 16,
      lineHeight: 1.5,
      letterSpacing: 0,
      wordSpacing: 0,
      paragraphSpacing: 0,
    },
  }),
}));

const NASA_IDS = [
  'mentalDemand',
  'physicalDemand',
  'temporalDemand',
  'performance',
  'effort',
  'frustration',
];
const SUS_IDS = Array.from(
  { length: 10 },
  (_, i) => `sus${String(i + 1).padStart(2, '0')}`,
);
const UEQ_IDS = Array.from({ length: 8 }, (_, i) => `ueq0${i + 1}`);
const ENGAGEMENT_IDS = ['concentration', 'perseverance'];

function slider(container: HTMLElement, id: string) {
  return container.querySelector<HTMLInputElement>(
    `input[type="range"][name="${id}"]`,
  )!;
}

function answerAllRatings(container: HTMLElement, ids: string[]) {
  for (const id of ids) {
    const radio = container.querySelector<HTMLInputElement>(
      `input[type="radio"][name="${id}"][value="1"]`,
    )!;
    fireEvent.click(radio);
  }
}

function submit(container: HTMLElement) {
  fireEvent.click(container.querySelector('button[type="submit"]')!);
}

describe('SurveyComponent: no pre-filled answers, required items', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    mockIsGamified = false;
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) });
    vi.stubGlobal('fetch', fetchMock);
    // jsdom doesn't implement scrollIntoView (every real browser does).
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('starts with every item unanswered', () => {
    const { container } = render(<SurveyComponent />);

    expect(
      container.querySelectorAll('input[type="radio"]:checked'),
    ).toHaveLength(0);
    for (const id of NASA_IDS) {
      expect(slider(container, id).getAttribute('aria-valuetext')).toBe(
        i18n.t('feedback.notAnswered'),
      );
    }
    expect(container.querySelector('[role="alert"]')).toBeNull();
  });

  it('blocks submission and reports every unanswered item accessibly', () => {
    const { container } = render(<SurveyComponent />);

    submit(container);

    expect(fetchMock).not.toHaveBeenCalled();
    const alert = container.querySelector('[role="alert"]');
    expect(alert?.textContent).toBe(i18n.t('feedback.validationSummary'));
    // Focus lands on the first unanswered item so keyboard/screen-reader
    // users are taken straight to it.
    expect(document.activeElement).toBe(slider(container, 'mentalDemand'));
    expect(slider(container, 'mentalDemand').getAttribute('aria-invalid')).toBe(
      'true',
    );
    const groups = container.querySelectorAll('[role="radiogroup"]');
    expect(groups).toHaveLength(
      SUS_IDS.length + ENGAGEMENT_IDS.length + UEQ_IDS.length,
    );
    groups.forEach((group) => {
      expect(group.getAttribute('aria-invalid')).toBe('true');
      const errorId = group.getAttribute('aria-describedby')!;
      expect(container.querySelector(`#${errorId}`)?.textContent).toContain(
        i18n.t('feedback.validationItemRequired'),
      );
    });
  });

  it('counts a released slider (no movement) and Enter as answering the midpoint', () => {
    const { container } = render(<SurveyComponent />);

    fireEvent.mouseUp(slider(container, 'mentalDemand'));
    expect(
      slider(container, 'mentalDemand').getAttribute('aria-valuetext'),
    ).toBe('50 / 100');

    fireEvent.keyDown(slider(container, 'effort'), { key: 'Enter' });
    expect(slider(container, 'effort').getAttribute('aria-valuetext')).toBe(
      '50 / 100',
    );
  });

  it('does not count merely tabbing onto a slider as an answer', () => {
    const { container } = render(<SurveyComponent />);

    fireEvent.keyUp(slider(container, 'mentalDemand'), { key: 'Tab' });

    expect(
      slider(container, 'mentalDemand').getAttribute('aria-valuetext'),
    ).toBe(i18n.t('feedback.notAnswered'));
  });

  it('submits once everything is answered, treating 0 as a real NASA-TLX answer', async () => {
    const { container } = render(<SurveyComponent />);

    for (const id of NASA_IDS) {
      fireEvent.change(slider(container, id), { target: { value: '0' } });
    }
    answerAllRatings(container, [...SUS_IDS, ...ENGAGEMENT_IDS, ...UEQ_IDS]);
    submit(container);

    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    for (const id of NASA_IDS) expect(body[id]).toBe(0);
    for (const id of [...SUS_IDS, ...ENGAGEMENT_IDS, ...UEQ_IDS])
      expect(body[id]).toBe(1);
    expect(body.appVersion).toBe('basis');
    // Basis condition: no gamification items in the payload.
    expect(body.gardenMotivation).toBeUndefined();
  });

  it('also requires the three gamification items in the gamified condition', () => {
    mockIsGamified = true;
    const { container } = render(<SurveyComponent />);

    for (const id of NASA_IDS) {
      fireEvent.change(slider(container, id), { target: { value: '10' } });
    }
    answerAllRatings(container, [...SUS_IDS, ...ENGAGEMENT_IDS, ...UEQ_IDS]);
    submit(container);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(
      container.querySelector('[role="radiogroup"][aria-invalid="true"]'),
    ).not.toBeNull();
    expect(
      container.querySelectorAll('[role="radiogroup"][aria-invalid="true"]'),
    ).toHaveLength(3);
  });
});

describe('SurveyComponent: submission errors (WCAG 3.3.1 / 3.3.3)', () => {
  const fetchMock = vi.fn();

  function fillAndSubmit() {
    const view = render(<SurveyComponent />);
    for (const id of NASA_IDS) {
      fireEvent.change(slider(view.container, id), { target: { value: '10' } });
    }
    answerAllRatings(view.container, [
      ...SUS_IDS,
      ...ENGAGEMENT_IDS,
      ...UEQ_IDS,
    ]);
    submit(view.container);
    return view;
  }

  const alertText = (container: HTMLElement) =>
    container.querySelector('[role="alert"]')?.textContent ?? '';

  beforeEach(() => {
    localStorage.clear();
    mockIsGamified = false;
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
    Element.prototype.scrollIntoView = vi.fn();
    // The failure paths log on purpose; keep the test output readable.
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      configurable: true,
    });
  });

  it('offline (fetch rejects with a TypeError): shows the offline message with a next step', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));
    const { container } = fillAndSubmit();

    await vi.waitFor(() =>
      expect(alertText(container)).toBe(i18n.t('feedback.errorOffline')),
    );
    expect(alertText(container)).not.toBe(i18n.t('feedback.errorServer'));
  });

  it('navigator.onLine === false: shows the offline message even for another exception', async () => {
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      configurable: true,
    });
    fetchMock.mockRejectedValue(new Error('boom'));
    const { container } = fillAndSubmit();

    await vi.waitFor(() =>
      expect(alertText(container)).toBe(i18n.t('feedback.errorOffline')),
    );
  });

  it('a non-2xx response (500): shows the server message, not the generic one', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Internal Server Error' }),
    });
    const { container } = fillAndSubmit();

    await vi.waitFor(() =>
      expect(alertText(container)).toBe(i18n.t('feedback.errorServer')),
    );
  });

  it('any other exception: shows the generic message with the reload hint', async () => {
    fetchMock.mockRejectedValue(new Error('something else'));
    const { container } = fillAndSubmit();

    await vi.waitFor(() =>
      expect(alertText(container)).toBe(i18n.t('feedback.errorGeneric')),
    );
  });

  it('keeps the draft after any failure, so nothing the participant entered is lost', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    });
    const { container } = fillAndSubmit();
    await vi.waitFor(() => expect(alertText(container)).not.toBe(''));

    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith('en-claro:survey:v3:'),
    );
    expect(keys).toHaveLength(1);
  });

  it('re-sends the same submissionId on a retry, and a UUID-shaped one', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    });
    const { container } = fillAndSubmit();
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    await vi.waitFor(() => expect(alertText(container)).not.toBe(''));

    submit(container);
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));

    const [first, second] = fetchMock.mock.calls.map(
      (call) => JSON.parse(call[1].body).submissionId,
    );
    expect(first).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(second).toBe(first);
  });

  it('keeps the submissionId when the survey is reopened from the saved draft', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    });
    const first = fillAndSubmit();
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    first.unmount();

    const second = render(<SurveyComponent />);
    // The restored draft already has every answer, so submitting again works.
    submit(second.container);
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    const ids = fetchMock.mock.calls.map(
      (call) => JSON.parse(call[1].body).submissionId,
    );
    expect(ids[1]).toBe(ids[0]);
  });
});
