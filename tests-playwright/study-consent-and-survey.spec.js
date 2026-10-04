import { test, expect } from '@playwright/test';

// Full guided-study run-through: the consent screen before block 1, the
// questionnaire that closes block 1 (gamified condition — exercises the
// gamification fieldset), and the questionnaire that closes block 2
// (classic condition — exercises the "Angaben zur Person" fieldset),
// repeated in all three languages. Real submissions are never sent: every
// request to the Netlify function is intercepted and inspected instead.
//
// Grinding through all 15 real exercise tasks per block twice (once per
// language) would make this test slow and tie it to every exercise
// component's own UI — the consent screen, both questionnaires, and the
// payload they produce are the actual subject here, so block progress is
// seeded directly via localStorage (the same state useStudyModeState.js
// itself persists under studyProgress_v2) rather than played through task
// by task.

const NEXT_BUTTON = /Weiter|Next|Dalej/i;
const START_BUTTON = /Start|Rozpocznij/i;

async function interceptSubmit(page) {
  let lastBody = null;
  await page.route('**/.netlify/functions/submit-survey', async (route) => {
    lastBody = JSON.parse(route.request().postData());
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Survey results saved successfully!' }),
    });
  });
  return () => lastBody;
}

async function fillRadioGroup(page, name, value) {
  await page
    .locator(`input[type="radio"][name="${name}"][value="${value}"]`)
    .check();
}

async function fillNasaSlider(page, name) {
  const slider = page.locator(`input[type="range"][name="${name}"]`);
  await slider.focus();
  // Any key in SLIDER_NAVIGATION_KEYS commits the current value as the
  // answer (SurveyComponent.tsx's handleNasaCommit) — a plain .fill() only
  // updates the displayed value, it does not count as answering.
  await slider.press('ArrowRight');
}

for (const lang of ['de', 'en', 'pl']) {
  test.describe(`Guided study consent + both questionnaires (${lang})`, () => {
    // No localStorage.clear() here on purpose: unlike accessibility.spec.js
    // (a single goto per test), this test reloads mid-test to jump between
    // block 1 and block 2 (see the comment at the top of this file) — an
    // addInitScript persists across every navigation in a test, including
    // page.reload(), so clearing storage here would wipe the consent and
    // progress state each reload is meant to carry forward. Each Playwright
    // test already starts in its own fresh, isolated context, so storage is
    // empty on the very first goto below regardless.

    test(`consent screen, block 1 (gamified) and block 2 (classic) questionnaires submit the expected fields`, async ({
      page,
    }) => {
      // ~50 radio/slider actions; takes ~25s locally on mobile, so the 30s
      // default is too tight for slower CI runners.
      test.setTimeout(120000);
      const getLastBody = await interceptSubmit(page);

      await page.goto('/');
      await page.locator(`button[lang="${lang}"]`).click();
      await page.locator(`text=${NEXT_BUTTON}`).click();
      // Study mode defaults to on, so the intro's Classic/Gamified picker is
      // a read-only status line here (IntroScreen.jsx) rather than buttons —
      // the Start button itself is unconditional, no mode pick needed.
      await page.locator(`text=${START_BUTTON}`).click();

      // --- Consent screen (StudyConsentScreen.jsx) ---
      const startStudyButton = page.getByRole('button', {
        name: START_BUTTON,
      });
      await expect(startStudyButton).toBeVisible();

      // Clicking Start without checking either box blocks progress and
      // announces why via role="alert".
      await startStudyButton.click();
      await expect(page.locator('[role="alert"]')).toBeVisible();

      const checkboxes = page.locator('input[type="checkbox"]');
      await expect(checkboxes).toHaveCount(2);
      await checkboxes.nth(0).check();
      await checkboxes.nth(1).check();
      await startStudyButton.click();

      // Consent persisted locally — past the consent screen, into the app.
      await expect(page.locator('#main-content')).toBeVisible();
      expect(
        await page.evaluate(() => localStorage.getItem('studyConsent_v2')),
      ).toBe('true');

      // --- Block 1 questionnaire (gamified condition) ---
      await page.evaluate(() => {
        localStorage.setItem('variantOrder', 'gamifiedFirst');
        localStorage.setItem(
          'studyProgress_v2',
          JSON.stringify({
            block: 1,
            pillarIndex: 0,
            pillarCount: 0,
            phase: 'survey',
          }),
        );
      });
      await page.reload();
      await expect(page.locator('#main-content')).toBeVisible();
      await page.keyboard.press('Control+s');
      await expect(page.locator('#survey-title')).toBeVisible();

      for (const name of [
        'mentalDemand',
        'physicalDemand',
        'temporalDemand',
        'performance',
        'effort',
        'frustration',
      ]) {
        await fillNasaSlider(page, name);
      }
      for (let i = 1; i <= 10; i++) {
        await fillRadioGroup(page, `sus${String(i).padStart(2, '0')}`, '3');
      }
      // Asked every time regardless of condition (see ENGAGEMENT_SCALES in
      // SurveyComponent.tsx), unlike the gamification fieldset below.
      await fillRadioGroup(page, 'concentration', '4');
      await fillRadioGroup(page, 'perseverance', '3');
      for (let i = 1; i <= 8; i++) {
        await fillRadioGroup(page, `ueq0${i}`, '4');
      }
      // Block 1 is the gamified condition for variantOrder "gamifiedFirst"
      // (isBlockGamified in useStudyModeState.js) — its fieldset is present.
      await fillRadioGroup(page, 'gardenMotivation', '3');
      await fillRadioGroup(page, 'badgeMotivation', '3');
      await fillRadioGroup(page, 'gameDistraction', '2');

      await page.locator('button[type="submit"]').click();
      await expect(
        page.locator('[role="status"][tabindex="-1"]'),
      ).toBeVisible();

      const block1Body = getLastBody();
      expect(block1Body.questionnaireVersion).toBe('v2');
      expect(block1Body.consentGiven).toBe(true);
      expect(block1Body.appVersion).toBe('vollversion');
      expect(block1Body.block).toBe(1);
      expect(block1Body.variantOrder).toBe('gamifiedFirst');
      expect(block1Body.concentration).toBe(4);
      expect(block1Body.perseverance).toBe(3);
      expect(block1Body.gardenMotivation).toBe(3);
      expect(block1Body.badgeMotivation).toBe(3);
      expect(block1Body.gameDistraction).toBe(2);
      // "Angaben zur Person" only belongs to the block-2 questionnaire.
      expect(block1Body.lrsStatus).toBeUndefined();
      expect(block1Body.sltRole).toBeUndefined();
      expect(block1Body.ageGroup).toBeUndefined();
      expect(block1Body.firstLanguage).toBeUndefined();

      // --- Block 2 questionnaire (classic condition) ---
      await page.evaluate(() => {
        localStorage.setItem(
          'studyProgress_v2',
          JSON.stringify({
            block: 2,
            pillarIndex: 0,
            pillarCount: 0,
            phase: 'survey',
          }),
        );
      });
      await page.reload();
      await expect(page.locator('#main-content')).toBeVisible();
      await page.keyboard.press('Control+s');
      await expect(page.locator('#survey-title')).toBeVisible();

      for (const name of [
        'mentalDemand',
        'physicalDemand',
        'temporalDemand',
        'performance',
        'effort',
        'frustration',
      ]) {
        await fillNasaSlider(page, name);
      }
      for (let i = 1; i <= 10; i++) {
        await fillRadioGroup(page, `sus${String(i).padStart(2, '0')}`, '3');
      }
      // Asked every time regardless of condition (see ENGAGEMENT_SCALES in
      // SurveyComponent.tsx), unlike the gamification fieldset below.
      await fillRadioGroup(page, 'concentration', '4');
      await fillRadioGroup(page, 'perseverance', '3');
      for (let i = 1; i <= 8; i++) {
        await fillRadioGroup(page, `ueq0${i}`, '4');
      }
      // Block 2 is the classic condition here — no gamification fieldset —
      // but "Angaben zur Person" is present (block === 2).
      await fillRadioGroup(page, 'lrsStatus', 'no');
      await fillRadioGroup(page, 'sltRole', 'no');
      await fillRadioGroup(page, 'ageGroup', '30-49');

      // "Keine Angabe hebt die anderen Antworten auf und umgekehrt": select
      // a real language, then no_answer, and confirm the real one was
      // cleared, before picking a real language again to actually submit.
      const germanOption = page.locator(
        'input[type="checkbox"][name="firstLanguage"][value="de"]',
      );
      const noAnswerOption = page.locator(
        'input[type="checkbox"][name="firstLanguage"][value="no_answer"]',
      );
      await germanOption.check();
      await noAnswerOption.check();
      await expect(germanOption).not.toBeChecked();
      await expect(noAnswerOption).toBeChecked();
      await germanOption.check();
      await expect(noAnswerOption).not.toBeChecked();
      await expect(germanOption).toBeChecked();

      await page.locator('button[type="submit"]').click();
      await expect(
        page.locator('[role="status"][tabindex="-1"]'),
      ).toBeVisible();

      const block2Body = getLastBody();
      expect(block2Body.questionnaireVersion).toBe('v2');
      expect(block2Body.consentGiven).toBe(true);
      expect(block2Body.appVersion).toBe('basis');
      expect(block2Body.block).toBe(2);
      expect(block2Body.concentration).toBe(4);
      expect(block2Body.perseverance).toBe(3);
      expect(block2Body.lrsStatus).toBe('no');
      expect(block2Body.sltRole).toBe('no');
      expect(block2Body.ageGroup).toBe('30-49');
      expect(block2Body.firstLanguage).toEqual(['de']);
      expect(block2Body.gardenMotivation).toBeUndefined();
      expect(block2Body.badgeMotivation).toBeUndefined();
      expect(block2Body.gameDistraction).toBeUndefined();
    });
  });
}
