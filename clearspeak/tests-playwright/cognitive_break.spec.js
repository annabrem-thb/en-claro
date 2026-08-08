import { test, expect } from '@playwright/test';

test.describe('Dyslexia PWA - Przerwy Kognitywne', () => {
  test.beforeEach(async ({ page: page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
  });
  test('powinno wyświetlić powiadomienie "Czas na przerwę?" po wystąpieniu zmęczenia (serii błędów)', async ({
    page: page,
  }) => {
    test.setTimeout(90000);
    await page.goto('/');
    await page.locator('text=/Tylko nauka|Study only/i').click();
    await page.locator('text=/Rozpocznij|Start/i').click();
    await expect(page.locator('[role="status"]')).toBeVisible();
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
    await page.locator('text=/Odpoczywam|Rest/i').click();
  });
});
