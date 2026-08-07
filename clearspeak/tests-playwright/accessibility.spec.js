import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

// Automated WCAG scanning for the app's major screens, using axe-core. This
// covers what a static/manual review can miss or overstate — actual computed
// contrast ratios, missing accessible names, invalid ARIA usage, etc. It is
// not a substitute for a manual screen-reader walkthrough (see
// docs/screen-reader-walkthrough.md), which covers things axe cannot check
// (reading order, announcement timing, whether the experience actually makes
// sense navigated by ear).
//
// Findings are asserted, not just logged: a violation here should fail CI,
// the same as any other regression.

async function skipIntro(page) {
  await page.goto('/#/literacy');
  // If the intro screen is showing (e.g. first-ever load in this browser
  // context), dismiss it via "Study only" -> "Start".
  const studyOnly = page.locator('text=/Tylko nauka|Study only|Nur lernen/i');
  if (await studyOnly.isVisible().catch(() => false)) {
    await studyOnly.click();
    await page.locator('text=/Rozpocznij|Start/i').click();
  }
  await expect(page.locator('aside')).toBeVisible();
}

async function runAxe(page, disableRules = []) {
  const builder = new AxeBuilder({ page }).withTags([
    'wcag2a',
    'wcag2aa',
    'wcag21a',
    'wcag21aa',
  ]);
  if (disableRules.length) builder.disableRules(disableRules);
  return builder.analyze();
}

function formatViolations(results) {
  return results.violations
    .map(
      (v) =>
        `\n[${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s))\n  ${v.nodes
          .map((n) => n.target.join(' '))
          .join('\n  ')}`,
    )
    .join('\n');
}

test.describe('Accessibility (axe-core)', () => {
  test.beforeEach(async ({ page }) => {
    // Entrance transitions (animate-in/fade-in/zoom-in/slide-in-from-*) are
    // real CSS animations, not just presence toggles — scanning immediately
    // after an element becomes visible can catch it mid-transition, where an
    // interpolated color transiently reads as lower-contrast than its
    // resting state. WCAG's contrast criteria describe the settled
    // presentation, not a transitional frame, so audits should run the same
    // way most real accessibility tooling does: with reduced motion, which
    // this app already wires up to skip its entrance animations entirely
    // (see a11y.css's `data-a11y-motion` rules) via the same
    // prefers-reduced-motion seed used for the "Calm screen" setting.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
  });

  // The bare `/` intro screen — every other test below navigates past it via
  // skipIntro(), so without this it was the one route never scanned on its
  // own despite being the very first thing every real visitor sees.
  test('Intro screen has no WCAG 2.1 A/AA violations', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main')).toBeVisible();
    const results = await runAxe(page);
    expect(results.violations, formatViolations(results)).toEqual([]);
  });

  // Each pillar draws from a different set of exercise components (Literacy:
  // phoneme/grapheme/syllable/scrabble/context/dictation/readAloud/lcwc,
  // Visual: clock/spatial, Cognitive: categorization/sequence) with their own
  // markup, so checking only one pillar would miss violations specific to
  // the others.
  for (const route of ['literacy', 'visual', 'cognitive']) {
    test(`${route} exercise view has no WCAG 2.1 A/AA violations`, async ({
      page,
    }) => {
      await skipIntro(page);
      await page.goto(`/#/${route}`);
      await expect(page.locator('section')).toBeVisible();
      const results = await runAxe(page);
      expect(results.violations, formatViolations(results)).toEqual([]);
    });
  }

  test('Settings dialog has no WCAG 2.1 A/AA violations', async ({ page }) => {
    await skipIntro(page);
    await page.goto('/#/settings');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    const results = await runAxe(page);
    expect(results.violations, formatViolations(results)).toEqual([]);
  });

  test('Profile dialog has no WCAG 2.1 A/AA violations', async ({ page }) => {
    await skipIntro(page);
    await page.goto('/#/profile');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    const results = await runAxe(page);
    expect(results.violations, formatViolations(results)).toEqual([]);
  });

  test('Feedback (NASA-TLX/SUS) dialog has no WCAG 2.1 A/AA violations', async ({
    page,
  }) => {
    test.setTimeout(60000);
    // The feedback survey only appears every 10 points in classic (non-
    // gamified) mode. Seed points to 9 via an init script — run before any
    // app JS executes — so the very next correct answer triggers it. Seeding
    // localStorage after mount is too late: useGamificationState reads it
    // only once, via a lazy useState initializer.
    //
    // beforeEach already navigated to '/' before this init script is
    // registered, and a hash-only goto (e.g. to '/#/literacy') is a
    // same-document navigation that does NOT run init scripts or remount the
    // app — so a plain skipIntro() here would silently skip the seed. Force
    // a real reload after registering the script so it actually applies.
    await page.addInitScript(() => {
      window.localStorage.clear();
      window.localStorage.setItem('pts', '9');
    });
    await page.goto('/#/literacy');
    await page.reload();
    const studyOnly = page.locator('text=/Tylko nauka|Study only|Nur lernen/i');
    if (await studyOnly.isVisible().catch(() => false)) {
      await studyOnly.click();
      await page.locator('text=/Rozpocznij|Start/i').click();
    }
    await expect(page.locator('aside')).toBeVisible();

    const getPoints = () =>
      page.evaluate(() => Number(window.localStorage.getItem('pts')) || 0);

    // Some exercise types (dictation, syllable-cutting) are build-then-submit
    // and expose a "Sprawdź/Check" button alongside several control buttons
    // that don't represent answer choices — blindly clicking those never
    // scores a point. Only attempt automatic answering on plain multiple-
    // choice exercises (no submit button present); skip everything else.
    const submitBtn = page.locator(
      'section button:has-text("Sprawdź"), section button:has-text("Check")',
    );
    const answerButtons = page.locator(
      'section button:not(:has-text("🎤")):not(:has-text("🛑")):not(:has-text("🔊"))',
    );
    const skipBtn = page.locator(
      'button:has-text("Skip"), button:has-text("Pomiń")',
    );

    let feedbackShown = false;
    for (let exercise = 0; exercise < 15 && !feedbackShown; exercise++) {
      feedbackShown = await page
        .locator('#survey-title')
        .isVisible()
        .catch(() => false);
      if (feedbackShown) break;
      const isBuildThenSubmit = await submitBtn.isVisible().catch(() => false);
      const count = await answerButtons.count();
      if (!isBuildThenSubmit && count >= 2) {
        for (let i = 0; i < count && !feedbackShown; i++) {
          const before = await getPoints();
          await answerButtons
            .nth(i)
            .click({ force: true })
            .catch(() => {});
          await page.waitForTimeout(300);
          const after = await getPoints();
          if (after > before) {
            // A correct answer was registered; the survey trigger (every
            // 10th point) has its own short delay before it renders.
            await page.waitForTimeout(2000);
            feedbackShown = await page
              .locator('#survey-title')
              .isVisible()
              .catch(() => false);
          }
        }
      }
      if (!feedbackShown && (await skipBtn.isVisible().catch(() => false))) {
        await skipBtn.click();
        await page.waitForTimeout(300);
      }
    }

    expect(
      feedbackShown,
      'Feedback dialog never appeared within the attempt budget',
    ).toBe(true);
    const results = await runAxe(page);
    expect(results.violations, formatViolations(results)).toEqual([]);
  });
});
