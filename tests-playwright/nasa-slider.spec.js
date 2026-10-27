import { expect, test } from '@playwright/test';

// NASA-RTLX sliders: WCAG 2.5.8 needs a hit area of at least 24 CSS px, and
// the custom track/thumb styling (index.css `.nasa-slider`) must not break
// the actual interaction. Runs in every configured browser engine
// (Chromium, Firefox, WebKit via the iPad/iPhone projects).

async function openSurvey(page) {
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.localStorage.setItem('i18nextLng', 'en');
    window.localStorage.setItem('studyModeEnabled', 'false');
    window.localStorage.setItem('voiceFallbackBannerDismissed', 'true');
  });
  await page.goto('/#/literacy');
  const nextButton = page.locator('text=/Weiter|Next|Dalej/i');
  if (await nextButton.isVisible().catch(() => false)) {
    await page.locator('button[lang="en"]').click();
    await nextButton.click();
    await page.locator('text=/Tylko nauka|Study only|Nur lernen/i').click();
    await page.locator('text=/Rozpocznij|Start/i').click();
  }
  await expect(page.locator('#main-content')).toBeVisible();
  await page.keyboard.press('Control+s');
  await expect(page.locator('#survey-title')).toBeVisible();
}

const slider = (page) =>
  page.locator('input[type="range"][name="mentalDemand"]');
const valueOf = async (page) => Number(await slider(page).inputValue());

test.describe('NASA-RTLX slider', () => {
  test.beforeEach(async ({ page }) => {
    await openSurvey(page);
    await slider(page).scrollIntoViewIfNeeded();
  });

  test('has a hit area of at least 24px in both dimensions', async ({
    page,
  }) => {
    const box = await slider(page).boundingBox();
    expect(box.height).toBeGreaterThanOrEqual(24);
    expect(box.width).toBeGreaterThanOrEqual(24);
  });

  test('a click sets the value', async ({ page }) => {
    await slider(page).click({ position: { x: 0, y: 12 } });
    const box = await slider(page).boundingBox();
    await slider(page).click({ position: { x: box.width * 0.8, y: 12 } });
    const value = await valueOf(page);
    expect(value).toBeGreaterThanOrEqual(70);
    expect(value).toBeLessThanOrEqual(90);
    await expect(slider(page)).toHaveAttribute(
      'aria-valuetext',
      `${value} / 100`,
    );
  });

  test('dragging moves the value', async ({ page }) => {
    const box = await slider(page).boundingBox();
    const y = box.y + box.height / 2;
    await page.mouse.move(box.x + box.width * 0.5, y);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.2, y, { steps: 8 });
    await page.mouse.up();
    const value = await valueOf(page);
    expect(value).toBeGreaterThanOrEqual(10);
    expect(value).toBeLessThanOrEqual(30);
  });

  test('arrow keys change the value in steps and commit the answer', async ({
    page,
  }) => {
    await slider(page).focus();
    await expect(slider(page)).toHaveAttribute(
      'aria-valuetext',
      /not answered|Nicht beantwortet|Nie udzielono/i,
    );
    await page.keyboard.press('ArrowRight');
    await expect(slider(page)).toHaveAttribute('aria-valuetext', '55 / 100');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await expect(slider(page)).toHaveAttribute('aria-valuetext', '45 / 100');
  });

  test('the focus ring is visible on the slider', async ({ page }) => {
    await slider(page).focus();
    const shadow = await slider(page).evaluate(
      (el) => getComputedStyle(el).boxShadow,
    );
    expect(shadow).not.toBe('none');
  });
});
