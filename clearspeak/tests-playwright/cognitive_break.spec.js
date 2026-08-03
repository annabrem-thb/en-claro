import { test, expect } from '@playwright/test';

test.describe('Dyslexia PWA - Przerwy Kognitywne', () => {
  test.beforeEach(async ({ page: page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
  });
  test('powinno wyświetlić powiadomienie "Czas na przerwę?" po wystąpieniu zmęczenia (serii błędów)', async ({
    page: page,
  }) => {
    await page.goto('/');
    await page.locator('text=/Tylko nauka|Study only/i').click();
    await page.locator('text=/Rozpocznij|Start/i').click();
    await expect(page.locator('[role="status"]')).toBeVisible();
    for (let i = 0; i < 5; i++) {
      const answerButton = page
        .locator('main button:not(:has-text("🎤")):not(:has-text("🛑"))')
        .first();
      await answerButton.click({ force: true });
      await page.waitForTimeout(2e3);
    }
    await expect(
      page.locator('text=/Czas na przerwę\\?|Time for a break\\?/i'),
    ).toBeVisible();
    await page.locator('text=/Odpoczywam|Rest/i').click();
  });
});
