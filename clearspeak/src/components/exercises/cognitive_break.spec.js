import { test, expect } from '@playwright/test';

test.describe('Dyslexia PWA - Przerwy Kognitywne', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
  });

  test('powinno wyświetlić powiadomienie "Czas na przerwę?" po wystąpieniu zmęczenia (serii błędów)', async ({ page }) => {
    await page.goto('/');

    // 1. Przechodzimy przez ekran powitalny
    await page.locator('text=/Tylko nauka|Study only/i').click();
    await page.locator('text=/Rozpocznij|Start/i').click();

    // 2. Upewniamy się, że pasek energii poznawczej jest widoczny
    await expect(page.locator('[role="status"]')).toBeVisible();

    // 3. Symulujemy serię błędów
    for (let i = 0; i < 5; i++) {
      // Wyszukujemy opcje odpowiedzi, z pominięciem przycisków TTS/Mikrofonu i klikamy pierwszą z brzegu
      const answerButton = page.locator('main button:not(:has-text("🎤")):not(:has-text("🛑"))').first();
      await answerButton.click({ force: true });
      
      // Oczekujemy, aż aplikacja przetworzy odpowiedź (odpowiednik cy.wait(2000))
      await page.waitForTimeout(2000);
    }

    // 4. Weryfikujemy, czy powiadomienie o przerwie wyskoczyło
    await expect(page.locator('text=/Czas na przerwę\\?|Time for a break\\?/i')).toBeVisible();
    await page.locator('text=/Odpoczywam|Rest/i').click();
  });
});