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
    // SidebarNav and BottomNav both always render (one CSS-hidden per `lg:`
    // breakpoint), so a bare `nav` locator matches two elements and any
    // singular assertion on it throws a strict-mode error regardless of
    // which one is actually visible. `nav.justify-around` is BottomNav's own
    // distinguishing layout class (SidebarNav's nav uses justify-between),
    // so it unambiguously targets just the mobile bar.
    if (isMobile) {
      await expect(page.locator('aside')).not.toBeVisible();
      await expect(page.locator('nav.justify-around')).toBeVisible();
    } else {
      await expect(page.locator('aside')).toBeVisible();
      await expect(page.locator('nav.justify-around')).not.toBeVisible();
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
    await expect(page.locator('nav.justify-around')).toBeVisible();
    const navButtons = page.locator('nav.justify-around button');
    await expect(navButtons.nth(0)).toHaveAttribute('aria-current', 'page');
    await navButtons.nth(1).click();
    await expect(navButtons.nth(1)).toHaveAttribute('aria-current', 'page');
    await expect(navButtons.nth(0)).not.toHaveAttribute('aria-current');
    await navButtons.nth(2).click();
    await expect(navButtons.nth(2)).toHaveAttribute('aria-current', 'page');
  });
});
