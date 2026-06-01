import { test, expect } from '@playwright/test';

test.describe('Dyslexia PWA - Testy Responsywności (RWD)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
  });

  // Playwright automatycznie uruchomi ten test we wszystkich rozdzielczościach zdefiniowanych w playwright.config.js
  test('powinno poprawnie wyświetlać główny interfejs w zależności od urządzenia', async ({ page, isMobile }) => {
    await page.goto('/');

    await page.locator('text=/Tylko nauka|Study only/i').click();
    await page.locator('text=/Rozpocznij|Start/i').click();

    await expect(page.locator('main')).toBeVisible();

    if (isMobile) {
      await expect(page.locator('aside')).not.toBeVisible();
      await expect(page.locator('nav')).toBeVisible();
    } else {
      await expect(page.locator('aside')).toBeVisible();
      await expect(page.locator('nav')).not.toBeVisible();
    }
  });

  test('powinno umożliwiać nawigację między zakładkami na ekranie mobilnym', async ({ page, isMobile }) => {
    // Ten konkretny test wykonujemy tylko na małych ekranach (pomijamy go na desktopie i tabletach)
    test.skip(!isMobile, 'Ten test jest przeznaczony wyłącznie dla urządzeń mobilnych');

    await page.goto('/');
    await page.locator('text=/Tylko nauka|Study only/i').click();
    await page.locator('text=/Rozpocznij|Start/i').click();

    await expect(page.locator('nav')).toBeVisible();

    const navButtons = page.locator('nav button');
    await expect(navButtons.nth(0)).toHaveAttribute('aria-current', 'page');

    await navButtons.nth(1).click();
    await expect(navButtons.nth(1)).toHaveAttribute('aria-current', 'page');
    await expect(navButtons.nth(0)).not.toHaveAttribute('aria-current');

    await navButtons.nth(2).click();
    await expect(navButtons.nth(2)).toHaveAttribute('aria-current', 'page');
  });
});