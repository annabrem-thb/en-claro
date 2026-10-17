import { expect, test } from '@playwright/test';

for (const lang of ['de', 'en', 'pl']) {
  test.describe(`En-Claro - Cognitive Breaks [${lang.toUpperCase()}]`, () => {
    test.beforeEach(async ({ page }) => {
      // addInitScript, not page.evaluate() after a goto: the app's own
      // useUserSettings effect writes its current in-memory settings back to
      // localStorage on mount (to persist other fields as the user changes
      // them), which races with — and can silently overwrite — a
      // page.evaluate() write made right after that mount already happened.
      await page.addInitScript((injectedLang) => {
        window.localStorage.clear();
        // Force the specific language for this test iteration
        window.localStorage.setItem('i18nextLng', injectedLang);
        window.localStorage.setItem(
          'cfg_settings',
          JSON.stringify({ cognitiveBreaks: true }),
        );
        window.localStorage.setItem('studyModeEnabled', 'false');
        // Prevent the voice fallback banner from appearing in CI by marking it dismissed
        window.localStorage.setItem('voiceFallbackBannerDismissed', 'true');
      }, lang);
    });

    test('should display the "Time for a break?" prompt after cognitive fatigue (error streak)', async ({
      page,
    }) => {
      test.setTimeout(150000);
      // The whole onboarding is retried as one unit: on slow CI the PWA
      // service worker can reload the page mid-flow, which drops the app
      // back to step 1 (and the init script re-seeds localStorage). Redoing
      // the sequence from a fresh load is the only reliable recovery.
      await expect(async () => {
        await page.goto('/');
        await page.locator(`button[lang="${lang}"]`).click({ timeout: 10000 });
        await page.locator('text=/Weiter|Next|Dalej/i').click({ timeout: 10000 });

        // The mode picker only renders while study mode is off; switch it
        // off through the UI if the seeded flag didn't stick.
        const studySwitch = page.getByRole('switch').first();
        await studySwitch.waitFor({ state: 'visible', timeout: 10000 });
        if ((await studySwitch.getAttribute('aria-checked')) === 'true') {
          await studySwitch.click();
        }
        await page
          .locator('text=/Tylko nauka|Study only|Nur lernen/i')
          .click({ timeout: 10000 });
        await page.locator('text=/Rozpocznij|Start/i').click({ timeout: 10000 });
      }).toPass({ timeout: 90000 });

      const breakPrompt = page.locator(
        'text=/Czas na przerwę\\??|Time for a break\\??|Zeit für eine Pause\\??/i',
      );
      const submitBtn = page.locator(
        'main button:has-text("Sprawdź"), main button:has-text("Check"), main button:has-text("Prüfen")',
      );
      
      const coverBtn = page.locator(
        'main button:has-text("Zakryj słowo"), main button:has-text("Cover word"), main button:has-text("Wort verdecken")',
      );
      const answerButtons = page.locator(
        'main button:not(:has-text("🎤")):not(:has-text("🛑")):not(:has-text("🔊"))',
      );
      const skipBtn = page.locator(
        'button:has-text("Pomiń"), button:has-text("Skip"), button:has-text("Überspringen")',
      );
      
      let breakShown = false;
      let attempts = 0;
      const deadline = Date.now() + 100_000;
      
      while (Date.now() < deadline && !breakShown) {
        const isBuildThenSubmit =
          (await submitBtn.isVisible().catch(() => false)) ||
          (await coverBtn.isVisible().catch(() => false));
        const count = await answerButtons.count();
        
        if (!isBuildThenSubmit && count >= 2) {
          // Mobile fix: dispatchEvent bypasses Playwright's strict viewport bounding box checks
          // which fail during React entrance animations on small screens.
-          await answerButtons.first().dispatchEvent('click').catch(() => {});
+          // Use Playwright's click({ force: true }) so React handlers are reliably invoked
+          await answerButtons.first().click({ force: true }).catch(() => {});

          await page.waitForTimeout(500);
            
          attempts++;
          
          breakShown = await breakPrompt
            .waitFor({ state: 'visible', timeout: attempts >= 4 ? 7000 : 1500 })
            .then(() => true)
            .catch(() => false);
        } else if (await skipBtn.isVisible().catch(() => false)) {
          // Mobile fix applied to the skip button as well
          await skipBtn.dispatchEvent('click').catch(() => {});
          await page.waitForTimeout(300);
        } else {
          await page.waitForTimeout(250);
        }
      }
      
      // Diagnostics for a CI-only failure: how many answers were sent and
      // what the energy indicator (role=status) says — the break only opens
      // once it reads "red" (4 errors within 3 minutes).
      const energy = await page
        .locator('[role="status"]')
        .allInnerTexts()
        .catch(() => []);
      expect(
        await breakPrompt.isVisible(),
        `no break prompt after ${attempts} answers; status regions: ${JSON.stringify(energy)}`,
      ).toBe(true);
      
      await page.getByRole('button', { name: /Odpoczywam|Rest|Pause|Ausruhen/i }).click();
    });
  });
}
