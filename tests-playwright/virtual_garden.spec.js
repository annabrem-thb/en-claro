import { test, expect } from '@playwright/test';

test.describe('Dyslexia PWA - Wirtualny Ogród', () => {
  test.beforeEach(async ({ page: page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
  });
  test('ładuje aplikację, przechodzi do ogrodu i weryfikuje jego stan startowy', async ({
    page: page,
  }) => {
    await page.goto('/');
    await page.locator('text=/Gra|Game|Gamified/i').click();
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
