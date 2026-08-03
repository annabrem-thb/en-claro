import { test, expect } from '@playwright/test';

test.describe('Dyslexia PWA - Testy Responsywności (RWD)', () => {
  test.beforeEach(async ({ page: page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
  });
  test('powinno poprawnie wyświetlać główny interfejs w zależności od urządzenia', async ({
    page: page,
    isMobile: isMobile,
  }) => {
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
  test('powinno umożliwiać nawigację między zakładkami na ekranie mobilnym', async ({
    page: page,
    isMobile: isMobile,
  }) => {
    test.skip(
      !isMobile,
      'Ten test jest przeznaczony wyłącznie dla urządzeń mobilnych',
    );
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
