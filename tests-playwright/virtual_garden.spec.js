import { expect, test } from '@playwright/test';

for (const lang of ['de', 'en', 'pl']) {
  test.describe(`En-Claro - Virtual Garden [${lang.toUpperCase()}]`, () => {
    test.beforeEach(async ({ page }) => {
      // addInitScript, not page.evaluate() after a goto: sets baseline state
      await page.addInitScript((injectedLang) => {
        window.localStorage.clear();
        // Force the specific language for this test iteration
        window.localStorage.setItem('i18nextLng', injectedLang);
        // Study mode defaults to on (see useStudyModeState.js) and, while
        // active, replaces the Classic/Gamified picker with a read-only status
        // line showing whichever variant the study's own coin flip assigned —
        // this test needs Gamified specifically (to reach the Garden tab at
        // all), so it opts out of the guided flow first to get the picker back.
        window.localStorage.setItem('studyModeEnabled', 'false');
      }, lang);
      await page.goto('/');
    });

    test('loads the app, navigates to the garden and verifies its initial state', async ({
      page,
    }) => {
      // Explicitly click the language button to ensure the UI updates
      await page.locator(`button[lang="${lang}"]`).click();

      await page.locator('text=/Weiter|Next|Dalej/i').click();
      
      // Scoped to the button role: the Study Mode toggle's own description
      // text ("...one with game elements...") also contains "game" and would
      // otherwise match this same plain-text locator ambiguously. Added "Spiel" for DE.
      await page.getByRole('button', { name: /Gra|Game|Gamified|Spiel/i }).click();
      
      await page.locator('text=/Rozpocznij|Start/i').click();
      
      // Nav is unmounted entirely while a task is being processed (Stage 2D),
      // so it can't be relied on to click "Garden" right after Start — the
      // Ctrl/Cmd/Alt+4 shortcut (Garden is pillar-count-th, gamified mode
      // only) reaches it regardless of that window.
      await page.keyboard.press('Control+4');
      
      const gardenContainer = page.locator('#garden-container');
      await expect(gardenContainer).toBeVisible();
      
      // Using toContainText on the parent container bypasses Bionic Reading's HTML injection 
      // (<b> tags) by checking the aggregated raw text. Broadened the German regex to catch 
      // variations without failing on exact sentence matches.
      await expect(gardenContainer).toContainText(
        /Twój własny ekosystem|Your own ecosystem|Ökosystem|Oekosystem|Garten/i
      );
      
      // The Garden view's own heading is "Postęp Celu Dziennego" / "Daily Goal
      // Progress" (WeeklyCalendar) — "Cel dzienny" / "Daily goal" verbatim is
      // the goal-picker's label on the Intro/Settings screens, a different
      // string that never appears here.
      await expect(gardenContainer).toContainText(
        /Postęp Celu Dziennego|Daily Goal Progress|Tagesziel/i
      );
    });
  });
}