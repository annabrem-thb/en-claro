import { test, expect } from '@playwright/test';

test.describe('Dyslexia PWA - Pierwsze uruchomienie i ćwiczenie', () => {
  test.beforeEach(async ({ page }) => {
    // Czyszczenie Local Storage przez wejście na stronę i ewaluację kodu JS
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
  });

  test('ładuje aplikację, przechodzi przez ekran powitalny i próbuje rozwiązać pierwsze ćwiczenie', async ({ page }) => {
    await page.goto('/');

    // Przejście przez ekran powitalny
    await expect(page.locator('text=/EnClaro/i')).toBeVisible();
    await page.locator('text=/Tylko nauka|Study only/i').click();
    await page.locator('text=/Rozpocznij|Start/i').click();

    // Weryfikacja załadowania głównego interfejsu aplikacji
    await expect(page.locator('aside')).toBeVisible();
    await expect(page.locator('section')).toBeVisible();

    await expect(page.locator('text=/Brak zadań|No tasks/i')).not.toBeVisible();
    await expect(page.locator('text=/Błąd formatu|Task format/i')).not.toBeVisible();

    // Interakcja z ostatnim przyciskiem odpowiedzi w kontenerze section, unikając ikon sterowania
    const buttons = page.locator('section button:not(:has-text("🎤")):not(:has-text("🛑")):not(:has-text("🔊"))');
    await buttons.last().click({ force: true });

    // Weryfikacja stabilności - brak błędu renderowania
    await expect(page.locator('body')).not.toContainText('Wystąpił błąd.');
  });
});