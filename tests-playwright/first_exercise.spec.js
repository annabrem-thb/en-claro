import { test, expect } from '@playwright/test';

test.describe('Dyslexia PWA - Pierwsze uruchomienie i ćwiczenie', () => {
  test.beforeEach(async ({ page }) => {
    // addInitScript, not page.evaluate() after a goto: the app's own
    // useUserSettings effect writes its current in-memory settings back to
    // localStorage on mount, which races with a page.evaluate() write made
    // right after that mount already happened (see cognitive_break.spec.js).
    await page.addInitScript(() => {
      window.localStorage.clear();
      // Study mode defaults to on (see useStudyModeState.js) and, while
      // active, replaces the Classic/Gamified picker with a read-only
      // status line — opt out first so "Study only" is an actual clickable
      // button.
      window.localStorage.setItem('studyModeEnabled', 'false');
    });
    await page.goto('/');
  });

  test('ładuje aplikację, przechodzi przez ekran powitalny i próbuje rozwiązać pierwsze ćwiczenie', async ({
    page,
  }) => {
    await page.goto('/');

    // Przejście przez ekran powitalny
    await expect(page.locator('text=/EnClaro/i')).toBeVisible();
    await page.locator('text=/Weiter|Next|Dalej/i').click();
    await page.locator('text=/Tylko nauka|Study only/i').click();
    await page.locator('text=/Rozpocznij|Start/i').click();

    // Weryfikacja załadowania głównego interfejsu aplikacji
    // Nav (SidebarNav/BottomNav) is unmounted entirely while a task is
    // actively being processed (Stage 2D) — not just CSS-hidden per
    // breakpoint — so it can't be asserted visible here; the main content
    // region below is the reliable "app loaded" signal instead.
    await expect(page.locator('#main-content')).toBeVisible();
    await expect(page.locator('section')).toBeVisible();

    await expect(page.locator('text=/Brak zadań|No tasks/i')).not.toBeVisible();
    await expect(
      page.locator('text=/Błąd formatu|Task format/i'),
    ).not.toBeVisible();

    // Interakcja z ostatnim przyciskiem odpowiedzi w kontenerze section, unikając ikon sterowania
    const buttons = page.locator(
      'section button:not(:has-text("🎤")):not(:has-text("🛑")):not(:has-text("🔊"))',
    );
    await buttons.last().click({ force: true });

    // Weryfikacja stabilności - brak błędu renderowania
    await expect(page.locator('body')).not.toContainText('Wystąpił błąd.');
  });
});
