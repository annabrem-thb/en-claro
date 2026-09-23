import { test, expect } from '@playwright/test';

test.describe('Dyslexia PWA - Ekstremalne Testy RWD (Długie Słowa)', () => {
  test.beforeEach(async ({ page: page }) => {
    // addInitScript, not page.evaluate() after a goto: the app's own
    // useUserSettings effect writes its current in-memory settings back to
    // localStorage on mount, which races with a page.evaluate() write made
    // right after that mount already happened (see cognitive_break.spec.js).
    await page.addInitScript(() => {
      window.localStorage.clear();
      // Study mode defaults to on (see useStudyModeState.js) and, while
      // active, replaces the Classic/Gamified picker with a read-only
      // status line — opt out first so "Study only"/"Nur lernen" is an
      // actual clickable button.
      window.localStorage.setItem('studyModeEnabled', 'false');
    });
    await page.goto('/');
  });
  test('powinno łamać długie niemieckie słowa w ustawieniach i zapobiegać poziomemu scrollowi', async ({
    page: page,
    isMobile: isMobile,
  }) => {
    test.skip(
      !isMobile,
      'Ten test RWD jest przeznaczony dla wąskich ekranów mobilnych',
    );
    await page.goto('/');
    await page.locator('button[lang="de"]').click();
    await page.locator('text=/Weiter|Next|Dalej/i').click();
    await page.locator('text=/Nur lernen/i').click();
    await page.locator('text=/Start/i').click();
    // Nav (and its Settings button) is unmounted entirely while a task is
    // being processed (Stage 2D) — the Ctrl/Cmd/Alt+, shortcut opens
    // Settings regardless of that window.
    await page.keyboard.press('Control+,');
    // There is no "Stimme" (Voice) tab anymore — voice/speech settings live
    // under "Komfort" (a11y) alongside the rest of the accessibility
    // toggles. "Pausenerinnerungen" (cognitiveBreaks) is a real, currently
    // rendered long unbroken German compound word there, serving the same
    // RWD purpose the removed "Sprechgeschwindigkeit" check had.
    await page
      .locator('button[role="tab"]')
      .filter({ hasText: 'Komfort' })
      .click();
    await expect(
      page.getByText('Pausenerinnerungen', { exact: true }),
    ).toBeVisible();
    const hasHorizontalScroll = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(hasHorizontalScroll).toBe(false);
  });
  test('powinno zapobiegać awarii layoutu przy wstrzyknięciu sztucznego, 63-znakowego słowa', async ({
    page: page,
    isMobile: isMobile,
  }) => {
    test.skip(
      !isMobile,
      'Ten test RWD jest przeznaczony dla wąskich ekranów mobilnych',
    );
    await page.goto('/');
    await page.locator('text=/Weiter|Next|Dalej/i').click();
    await page.locator('text=/Tylko nauka|Study only/i').click();
    await page.locator('text=/Rozpocznij|Start/i').click();
    await expect(page.locator('main')).toBeVisible();
    await page.evaluate(() => {
      const mainArea = document.querySelector('main');
      const badWordElement = document.createElement('div');
      badWordElement.textContent =
        'Rindfleischetikettierungsüberwachungsaufgabenübertragungsgesetz';
      badWordElement.className =
        'text-3xl font-black break-words hyphens-auto w-full';
      mainArea.appendChild(badWordElement);
    });
    const hasHorizontalScroll = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(hasHorizontalScroll).toBe(false);
  });
});
