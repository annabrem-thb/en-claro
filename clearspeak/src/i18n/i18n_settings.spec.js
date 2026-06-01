import { test, expect } from '@playwright/test';

test.describe('Dyslexia PWA - Internacjonalizacja (i18n)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
  });

  test('powinno zmieniać język w Ustawieniach i aktualizować tłumaczenia na żywo', async ({ page }) => {
    await page.goto('/');

    // 1. Przejście przez intro z wyborem języka angielskiego (EN)
    await page.locator('button[lang="en"]').click();
    await page.locator('text=/Study only/i').click();
    await page.locator('text=/Start/i').click();

    // 2. Otwarcie modalu Ustawień (używamy ikony ⚙️, która jest niezależna od języka)
    await page.locator('button').filter({ hasText: '⚙️' }).first().click();

    // 3. Weryfikacja obecności języka angielskiego (EN)
    await expect(page.locator('text="App mode"')).toBeVisible();
    await expect(page.locator('text="Settings"').first()).toBeVisible();

    // 4. Zmiana języka na polski (PL)
    await page.locator('span', { hasText: /^PL$/ }).click();

    // 5. Weryfikacja zmiany na język polski
    await expect(page.locator('text="Tryb aplikacji"')).toBeVisible();
    await expect(page.locator('text="Ustawienia"').first()).toBeVisible();
    await expect(page.locator('text="App mode"')).not.toBeVisible();

    // 6. Zmiana języka na niemiecki (DE)
    await page.locator('span', { hasText: /^DE$/ }).click();

    // 7. Weryfikacja zmiany na język niemiecki
    await expect(page.locator('text="App-Modus"')).toBeVisible();
    await expect(page.locator('text="Einstellungen"').first()).toBeVisible();
  });
});