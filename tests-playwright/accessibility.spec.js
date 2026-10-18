import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

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

async function skipIntro(page, lang) {
  await page.goto('/#/literacy');
  // If the intro screen is showing (e.g. first-ever load in this browser
  // context), dismiss it: step 1 (language/comfort tools) -> "Next" ->
  // step 2 (mode/theme) -> "Study only" -> "Start".
  const nextButton = page.locator('text=/Weiter|Next|Dalej/i');
  if (await nextButton.isVisible().catch(() => false)) {
    await page.locator(`button[lang="${lang}"]`).click();
    await nextButton.click();
    await page.locator('text=/Tylko nauka|Study only|Nur lernen/i').click();
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

for (const lang of ['de', 'en', 'pl']) {
  test.describe(`Accessibility (axe-core) [${lang.toUpperCase()}]`, () => {
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
      // CI-only diagnostics: keep browser-side errors so a failure can say
      // why the app rendered nothing, not just that it did.
      page.errorLog = [];
      page.on('pageerror', (err) =>
        page.errorLog.push(`pageerror: ${err.message}`),
      );
      page.on('console', (msg) => {
        if (msg.type() === 'error')
          page.errorLog.push(`console: ${msg.text().slice(0, 200)}`);
      });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      // addInitScript, not page.evaluate() after a goto: the app's own
      // useUserSettings effect writes its current in-memory settings back to
      // localStorage on mount, which races with a page.evaluate() write made
      // right after that mount already happened (see cognitive_break.spec.js).
      await page.addInitScript((injectedLang) => {
        window.localStorage.clear();
        window.localStorage.setItem('i18nextLng', injectedLang);
        // Study mode defaults to on (see useStudyModeState.js) and, while
        // active, replaces the Classic/Gamified picker with a read-only
        // status line — opt out first so "Study only" is an actual clickable
        // button in skipIntro() below.
        window.localStorage.setItem('studyModeEnabled', 'false');
        window.localStorage.setItem('voiceFallbackBannerDismissed', 'true');
      }, lang);
      await page.goto('/');
    });

    // The bare `/` intro screen — every other test below navigates past it via
    // skipIntro(), so without this it was the one route never scanned on its
    // own despite being the very first thing every real visitor sees.
    test('Intro screen has no WCAG 2.1 A/AA violations', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('main')).toBeVisible();
      // Ensure the language toggle is clicked so axe scans the exact language view
      await page.locator(`button[lang="${lang}"]`).click();
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
        await skipIntro(page, lang);
        await page.goto(`/#/${route}`);
        await expect(page.locator('section')).toBeVisible();
        const results = await runAxe(page);
        expect(results.violations, formatViolations(results)).toEqual([]);
      });
    }

    // Exercise types are drawn at random per pillar, so a single scan per
    // pillar (above) only ever sees one of them. Skipping through a run of
    // tasks scans several different exercise types, and checks the screen
    // reader contract on every one: focus lands on the task heading (not
    // <body>) and the answer controls are grouped under it. German only —
    // the markup is language-independent and this keeps CI time in check.
    if (lang === 'de') {
      const focusedHeadingTag = (page) =>
        page
          .evaluate(() => {
            const el = document.activeElement;
            return el &&
              el.getAttribute('tabindex') === '-1' &&
              el.closest('main')
              ? el.tagName
              : null;
          })
          // A page reload mid-evaluate (dev-server HMR/PWA update) just
          // means "not focused yet" — poll again.
          .catch(() => null);

      // Waits for focus to land on a task heading; on failure reports what
      // actually has focus and what the page shows, so a CI-only failure is
      // diagnosable without reproducing it.
      const expectHeadingFocused = async (page, label) => {
        try {
          await expect
            .poll(() => focusedHeadingTag(page), { timeout: 10000 })
            .toMatch(/^H[1-6]$/);
        } catch (e) {
          const state = await page
            .evaluate(() => {
              const el = document.activeElement;
              const main = document.querySelector('main');
              return {
                active: el
                  ? `${el.tagName}#${el.id} tabindex=${el.getAttribute('tabindex')}`
                  : null,
                headings: [
                  ...document.querySelectorAll('main [tabindex="-1"]'),
                ].map(
                  (h) => `${h.tagName}:${h.textContent.trim().slice(0, 40)}`,
                ),
                hash: location.hash,
                text: (main?.innerText || '').slice(0, 200),
                body: document.body.innerHTML.slice(0, 300),
              };
            })
            .catch((err) => ({ evaluateFailed: String(err) }));
          throw new Error(
            `${label}: no focused task heading. ${JSON.stringify(state)} errors=${JSON.stringify(page.errorLog)}\n${e.message}`,
          );
        }
      };

      // axe throws if the page navigates while it injects/runs; retry.
      const runAxeStable = async (page) => {
        for (let attempt = 0; ; attempt++) {
          try {
            return await runAxe(page);
          } catch (e) {
            if (attempt >= 2) throw e;
            await page.waitForTimeout(500);
          }
        }
      };

      for (const route of ['literacy', 'visual', 'cognitive']) {
        test(`${route}: every task has a focused heading and no WCAG 2.1 A/AA violations`, async ({
          page,
          browserName,
        }) => {
          test.fixme(
            browserName === 'firefox' && route === 'cognitive',
            'Bekanntes Problem: Fokus nach Aufgabenwechsel in Firefox, dokumentiert in der Masterarbeit, Abschnitt 6.2',
          );
          test.setTimeout(100000);
          // Redo the whole setup if the page reloads mid-way (dev-server /
          // PWA update on slow CI resets the app to the intro screen).
          await expect(async () => {
            await page.goto('/');
            await skipIntro(page, lang);
            await page.goto(`/#/${route}`);
            await expect(page.locator('section')).toBeVisible({
              timeout: 10000,
            });
          }).toPass({ timeout: 60000 });
          const skipBtn = page.getByRole('button', {
            name: /Überspringen|Skip|Pomiń/i,
          });

          for (let i = 0; i < 8; i++) {
            await expectHeadingFocused(page, 'task heading');
            const results = await runAxeStable(page);
            expect(results.violations, formatViolations(results)).toEqual([]);
            await skipBtn.click();
          }
        });
      }

      test('answering a task moves focus to the next task heading', async ({
        page,
      }) => {
        test.setTimeout(100000);
        await expect(async () => {
          await page.goto('/');
          await skipIntro(page, lang);
          await page.goto('/#/literacy');
          await expect(page.locator('section')).toBeVisible({ timeout: 10000 });
        }).toPass({ timeout: 60000 });

        const nextBtn = page.getByRole('button', {
          name: /Weiter|Next|Dalej/i,
        });
        const skipBtn = page.getByRole('button', {
          name: /Überspringen|Skip|Pomiń/i,
        });
        // Not every exercise is a pick-one task; skip until one has an
        // options group, then try its options until one is right.
        let answered = false;
        let answeredHeadingId = '';
        for (let i = 0; i < 15 && !answered; i++) {
          await expectHeadingFocused(page, 'task heading');
          answeredHeadingId = await page.evaluate(
            () => document.activeElement?.id ?? '',
          );
          const options = page.locator('main [role="group"] button');
          const count = await options.count();
          for (let o = 0; o < count && !answered; o++) {
            await options
              .nth(o)
              .click({ timeout: 5000 })
              .catch(() => {});
            answered = await nextBtn
              .waitFor({ state: 'visible', timeout: 1500 })
              .then(() => true)
              .catch(() => false);
          }
          if (!answered) await skipBtn.click();
        }
        expect(answered, 'no answerable pick-one task found').toBe(true);

        // A correct answer advances on its own after a short delay (the
        // "Next" button is only a shortcut and detaches when that fires), so
        // wait for the *new* task's heading — a fresh mount has a fresh id.
        await expect
          .poll(
            async () => {
              const id = await page
                .evaluate(() => document.activeElement?.id ?? '')
                .catch(() => '');
              const tag = await focusedHeadingTag(page);
              return tag && id && id !== answeredHeadingId ? 'moved' : 'same';
            },
            { timeout: 15000 },
          )
          .toBe('moved');
      });
    }

    test('Settings dialog has no WCAG 2.1 A/AA violations', async ({
      page,
    }) => {
      await skipIntro(page, lang);
      await page.goto('/#/settings');
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      await page.waitForLoadState('networkidle');
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
      await skipIntro(page, lang);
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
      const nextButton = page.locator('text=/Weiter|Next|Dalej/i');
      if (await nextButton.isVisible().catch(() => false)) {
        await page.locator(`button[lang="${lang}"]`).click();
        await nextButton.click();
        await page.locator('text=/Tylko nauka|Study only|Nur lernen/i').click();
        await page.locator('text=/Rozpocznij|Start/i').click();
      }
      await expect(page.locator('#main-content')).toBeVisible();

      await page.keyboard.press('Control+s');

      await expect(page.locator('#survey-title')).toBeVisible();
      const results = await runAxe(page);
      expect(results.violations, formatViolations(results)).toEqual([]);
    });
  });

  // Separate describe block: both tests below need study mode actually
  // active (the describe above deliberately opts out of it in its own
  // beforeEach, see the comment there), so they set up their own localStorage
  // state from scratch rather than fighting that shared hook.
  test.describe(`Accessibility (axe-core) — guided study [${lang.toUpperCase()}]`, () => {
    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
    });

    test('Study consent screen has no WCAG 2.1 A/AA violations', async ({
      page,
    }) => {
      await page.addInitScript((injectedLang) => {
        window.localStorage.clear();
        window.localStorage.setItem('i18nextLng', injectedLang);
      }, lang);
      await page.goto('/');
      const nextButton = page.locator('text=/Weiter|Next|Dalej/i');
      if (await nextButton.isVisible().catch(() => false)) {
        await page.locator(`button[lang="${lang}"]`).click();
        await nextButton.click();
        await page.locator('text=/Rozpocznij|Start/i').click();
      }
      // StudyConsentScreen.jsx also mounts its own #main-content landmark, the
      // same reasoning as IntroScreen.jsx (see skipIntro above).
      await expect(page.locator('#main-content')).toBeVisible();
      const results = await runAxe(page);
      expect(results.violations, formatViolations(results)).toEqual([]);
    });

    // variantOrder "classicFirst" makes block 2 the gamified condition
    // (isBlockGamified in useStudyModeState.js), so this one page exercises
    // NASA-TLX, SUS, UEQ-S, the gamification fieldset, and "Angaben zur
    // Person" together — the most complete single-page scan available.
    test('Questionnaire closing guided-study block 2 has no WCAG 2.1 A/AA violations', async ({
      page,
    }) => {
      await page.addInitScript((injectedLang) => {
        window.localStorage.clear();
        window.localStorage.setItem('i18nextLng', injectedLang);
        window.localStorage.setItem('studyConsent_v2', 'true');
        window.localStorage.setItem('variantOrder', 'classicFirst');
        window.localStorage.setItem(
          'studyProgress_v2',
          JSON.stringify({
            block: 2,
            pillarIndex: 0,
            pillarCount: 0,
            phase: 'survey',
          }),
        );
      }, lang);
      await page.goto('/#/literacy');

      const nextButton = page.locator('text=/Weiter|Next|Dalej/i');
      if (await nextButton.isVisible().catch(() => false)) {
        await page.locator(`button[lang="${lang}"]`).click();
        await nextButton.click();
        // Since studyProgress bypasses intro steps conditionally, handle UI if present
        await page
          .locator('text=/Rozpocznij|Start/i')
          .click()
          .catch(() => {});
      }
      await expect(page.locator('#main-content')).toBeVisible();

      await page.keyboard.press('Control+s');

      await expect(page.locator('#survey-title')).toBeVisible();
      const results = await runAxe(page);
      expect(results.violations, formatViolations(results)).toEqual([]);
    });
  });
}
