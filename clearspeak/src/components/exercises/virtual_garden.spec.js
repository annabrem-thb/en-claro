import { test, expect } from '@playwright/test';

test.describe('Dyslexia PWA - Wirtualny Ogród', () => {
  test.beforeEach(async ({ page }) => {
    // Czyszczenie Local Storage przed każdym testem
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
  });

  test('ładuje aplikację, przechodzi do ogrodu i weryfikuje jego stan startowy', async ({ page }) => {
    await page.goto('/');

    // Przejście przez ekran powitalny, wybór trybu grywalizacji
    await page.locator('text=/Gra|Game|Gamified/i').click();
    await page.locator('text=/Rozpocznij|Start/i').click();

    await expect(page.locator('aside')).toBeVisible();

    await page.locator('nav').locator('text=/Ogród|Garden/i').click();

    await expect(page.locator('#garden-container')).toBeVisible();
    await expect(page.locator('text=/Ziarenko|Seed/i')).toBeVisible();
    await expect(page.locator('text=/Twój własny ekosystem|Your own ecosystem/i')).toBeVisible();
    await expect(page.locator('text=/Cel dzienny|Daily goal/i')).toBeVisible();
  });
});