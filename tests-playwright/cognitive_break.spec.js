import { test, expect } from '@playwright/test';

test.describe('Dyslexia PWA - Przerwy Kognitywne', () => {
  test.beforeEach(async ({ page }) => {
    // addInitScript, not page.evaluate() after a goto: the app's own
    // useUserSettings effect writes its current in-memory settings back to
    // localStorage on mount (to persist other fields as the user changes
    // them), which races with — and can silently overwrite — a
    // page.evaluate() write made right after that mount already happened.
    // addInitScript runs before any page script on every subsequent
    // navigation, so the seed is always in place before useUserSettings'
    // initializer ever reads it.
    await page.addInitScript(() => {
      window.localStorage.clear();
      // cognitiveBreaks now defaults to off ("all options off by default" —
      // useUserSettings.js DEFAULT_SETTINGS). This test specifically
      // exercises that mechanism, so it has to opt in explicitly instead of
      // relying on a default that's no longer true.
      window.localStorage.setItem(
        'cfg_settings',
        JSON.stringify({ cognitiveBreaks: true }),
      );
    });
  });
  test('powinno wyświetlić powiadomienie "Czas na przerwę?" po wystąpieniu zmęczenia (serii błędów)', async ({
    page,
  }) => {
    test.setTimeout(90000);
    await page.goto('/');
    await page.locator('text=/Tylko nauka|Study only/i').click();
    await page.locator('text=/Rozpocznij|Start/i').click();
    // The CognitiveEnergyIndicator badge that used to be asserted visible
    // here now lives in the progress row, which — like nav — is unmounted
    // while a task is actively being processed (Stage 2D), so it isn't
    // reliably present at this exact point; the loop below exercises the
    // same feature by driving it to the break prompt directly.
    // The break prompt needs 4 wrong answers within a 3-minute window
    // (useCognitiveLoad.js). Two things make a fixed "click the first
    // button 5 times" unreliable: (1) the exercise rotation includes
    // build-then-submit types (dictation, look-cover-write-check) whose
    // first non-mic/stop button is a 🔊 read-aloud control, not an answer —
    // clicking it never registers a right or wrong attempt at all; (2) even
    // on plain multiple-choice exercises, the correct option's position is
    // randomized, so one attempt isn't reliably wrong. Mirror the same
    // build-then-submit detection the Feedback dialog test already uses:
    // skip those exercises via "Pomiń" rather than guessing at a disabled
    // submit button, and only click an answer on genuine multiple-choice
    // ones — with a generous attempt budget since skips don't count errors.
    const breakPrompt = page.locator(
      'text=/Czas na przerwę\\?|Time for a break\\?/i',
    );
    const submitBtn = page.locator(
      'main button:has-text("Sprawdź"), main button:has-text("Check")',
    );
    const answerButtons = page.locator(
      'main button:not(:has-text("🎤")):not(:has-text("🛑")):not(:has-text("🔊"))',
    );
    const skipBtn = page.locator(
      'button:has-text("Pomiń"), button:has-text("Skip")',
    );
    let breakShown = false;
    for (let i = 0; i < 30 && !breakShown; i++) {
      const isBuildThenSubmit = await submitBtn.isVisible().catch(() => false);
      const count = await answerButtons.count();
      if (!isBuildThenSubmit && count >= 2) {
        await answerButtons
          .first()
          .click({ force: true })
          .catch(() => {});
        await page.waitForTimeout(2e3);
        breakShown = await breakPrompt.isVisible().catch(() => false);
      } else if (await skipBtn.isVisible().catch(() => false)) {
        await skipBtn.click().catch(() => {});
        await page.waitForTimeout(300);
      }
    }
    await expect(breakPrompt).toBeVisible();
    // A plain text locator is ambiguous in English specifically: the
    // prompt's own body copy ("Rest in the...") also contains "Rest", so it
    // matches both that sentence and the actual button. Scoping to the
    // button role avoids depending on which language happened to load.
    await page.getByRole('button', { name: /Odpoczywam|Rest/i }).click();
  });
});
