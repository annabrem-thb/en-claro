import { test, expect } from '@playwright/test';

test.describe('Dyslexia PWA - Internacjonalizacja (i18n)', () => {
  test.beforeEach(async ({ page: page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
  });
  test('powinno zmieniać język w Ustawieniach i aktualizować tłumaczenia na żywo', async ({
    page: page,
  }) => {
    await page.goto('/');
    await page.locator('button[lang="en"]').click();
    await page.locator('text=/Study only/i').click();
    await page.locator('text=/Start/i').click();
    // Nav (and its Settings button) is unmounted entirely while a task is
    // being processed (Stage 2D) — the Ctrl/Cmd/Alt+, shortcut opens
    // Settings regardless of that window, so it's used here instead of
    // needing nav visible and clickable first.
    await page.keyboard.press('Control+,');
    // Exact `text="..."` CSS-engine locators require the matched element's
    // own text to equal the string with no other descendant elements in the
    // way — but Bionic Reading (on by default) splits every label into
    // `<b>`/`<span>` fragments, so that engine no longer finds a match even
    // though the rendered text is unchanged. getByText(..., {exact:true})
    // matches on the same aggregated/normalized text instead and is
    // unaffected by how many child nodes render it.
    await expect(page.getByText('App mode', { exact: true })).toBeVisible();
    await expect(
      page.getByText('Settings', { exact: true }).locator('visible=true'),
    ).toBeVisible();
    // Settings' own LanguageSwitcher (distinct from the intro screen's,
    // which has `lang="xx"` on each button) renders full language names,
    // never two-letter codes — there is no "PL"/"DE" span to match here.
    await page.locator('button', { hasText: 'Polski' }).click();
    await expect(
      page.getByText('Tryb aplikacji', { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText('Ustawienia', { exact: true }).locator('visible=true'),
    ).toBeVisible();
    await expect(page.getByText('App mode', { exact: true })).not.toBeVisible();
    await page.locator('button', { hasText: 'Deutsch' }).click();
    await expect(page.getByText('App-Modus', { exact: true })).toBeVisible();
    await expect(
      page.getByText('Einstellungen', { exact: true }).locator('visible=true'),
    ).toBeVisible();
  });
});
