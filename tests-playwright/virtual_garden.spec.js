import { test, expect } from '@playwright/test';

test.describe('Dyslexia PWA - Wirtualny Ogród', () => {
  test.beforeEach(async ({ page: page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
  });
  test('ładuje aplikację, przechodzi do ogrodu i weryfikuje jego stan startowy', async ({
    page: page,
  }) => {
    // Study mode defaults to on (see useStudyModeState.js) and, while
    // active, replaces the Classic/Gamified picker with a read-only status
    // line showing whichever variant the study's own coin flip assigned —
    // this test needs Gamified specifically (to reach the Garden tab at
    // all), so it opts out of the guided flow first to get the picker back.
    await page.addInitScript(() => {
      window.localStorage.setItem('studyModeEnabled', 'false');
    });
    await page.goto('/');
    await page.locator('text=/Weiter|Next|Dalej/i').click();
    // Scoped to the button role: the Study Mode toggle's own description
    // text ("...one with game elements...") also contains "game" and would
    // otherwise match this same plain-text locator ambiguously.
    await page.getByRole('button', { name: /Gra|Game|Gamified/i }).click();
    await page.locator('text=/Rozpocznij|Start/i').click();
    // Nav is unmounted entirely while a task is being processed (Stage 2D),
    // so it can't be relied on to click "Garden" right after Start — the
    // Ctrl/Cmd/Alt+4 shortcut (Garden is pillar-count-th, gamified mode
    // only) reaches it regardless of that window.
    await page.keyboard.press('Control+4');
    await expect(page.locator('#garden-container')).toBeVisible();
    // The growth-stage name (e.g. "Ziarno") is no longer shown as a visible
    // heading — it lives only in the sr-only aria-live journey summary now
    // (see VirtualGarden.jsx). Assert on the visible description instead.
    await expect(
      page.locator('text=/Twój własny ekosystem|Your own ecosystem/i'),
    ).toBeVisible();
    // The Garden view's own heading is "Postęp Celu Dziennego" / "Daily Goal
    // Progress" (WeeklyCalendar) — "Cel dzienny" / "Daily goal" verbatim is
    // the goal-picker's label on the Intro/Settings screens, a different
    // string that never appears here.
    await expect(
      page.locator('text=/Postęp Celu Dziennego|Daily Goal Progress/i'),
    ).toBeVisible();
  });
});
