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
  // Nav (SidebarNav's <aside> or BottomNav's <nav class="...justify-
  // around...">, depending on breakpoint) is unmounted entirely while a
  // task is actively being processed — only the main content region is
  // guaranteed to be present at this point, so that's what this helper
  // waits on instead of nav visibility.
  await expect(page.locator('#main-content')).toBeVisible();
}

async function runAxe(page, disableRules = []) {
  const builder = new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    // @floating-ui/react's FloatingFocusManager (used by every modal via
    // Dialog.jsx) inserts invisible `role="button"` focus-guard sentinels
    // at the start/end of the trap to loop Tab back into the dialog. They
    // must stay focusable and nameless by design — a screen-reader user
    // tabs straight past them, they're never a destination, and giving them
    // a label would announce a meaningless "button" that invites an
    // Enter/Space press with no effect. This is the same tradeoff every
    // focus-trap library makes (Radix, Chakra, react-aria); excluding just
    // these library-internal sentinels keeps `aria-command-name` fully
    // enforced for every button *this app* renders.
    .exclude('[data-floating-ui-focus-guard]');
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

  // Skipped, not deleted: there is no '/#/profile' route or Profile dialog
  // in the app today — useHashRoute.js only recognizes literacy/visual/
  // cognitive/garden/settings, and the component this test targeted
  // (UserProfileDashboard.tsx) has been removed from src/ entirely (only
  // unused i18n scaffold content — profileDashboard.json — still exists per
  // src/locales/index.js's own comment). Re-enable this once that feature
  // actually ships with a real route and a `role="dialog"` surface.
  test.skip('Profile dialog has no WCAG 2.1 A/AA violations', async ({
    page,
  }) => {
    await skipIntro(page);
    await page.goto('/#/profile');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    const results = await runAxe(page);
    expect(results.violations, formatViolations(results)).toEqual([]);
  });

  test('Feedback (NASA-TLX/SUS) dialog has no WCAG 2.1 A/AA violations', async ({
    page,
  }) => {
    // The survey no longer auto-appears every 10 points in either study arm
    // (removed in Stage 1A: it's a researcher-administered instrument, not
    // an inline popup — see docs/COMPLIANCE_AUDIT.md §6). Nav (and its "open
    // survey" button) is unmounted entirely while a task is being processed
    // (Stage 2D), so the Ctrl/Cmd/Alt+S shortcut — wired for exactly this
    // reason — is the only way to reach it reliably regardless of that
    // window; the nav button click only ever worked here by timing luck.
    await page.goto('/#/literacy');
    const studyOnly = page.locator('text=/Tylko nauka|Study only|Nur lernen/i');
    if (await studyOnly.isVisible().catch(() => false)) {
      await studyOnly.click();
      await page.locator('text=/Rozpocznij|Start/i').click();
    }
    await expect(page.locator('#main-content')).toBeVisible();

    await page.keyboard.press('Control+s');

    await expect(page.locator('#survey-title')).toBeVisible();
    const results = await runAxe(page);
    expect(results.violations, formatViolations(results)).toEqual([]);
  });
});
