import { test, expect } from '@playwright/test';

// Nav is unmounted entirely while a task is actively being processed
// (Stage 2D) — visible only before a task starts and in the brief feedback
// window after it's answered. Some exercise rotations are "build-then-
// submit" types (dictation, look-cover-write-check) whose first non-mic/
// stop/TTS button is a 🔊 read-aloud control, not an answer — clicking it
// never registers an attempt at all, so those are skipped via "Pomiń"
// instead (mirrors cognitive_break.spec.js's own exercise-type detection).
async function triggerFeedbackWindow(page) {
  const submitBtn = page.locator(
    'main button:has-text("Sprawdź"), main button:has-text("Check")',
  );
  const skipBtn = page.locator(
    'button:has-text("Pomiń"), button:has-text("Skip")',
  );
  // Excludes Skip itself too — it advances silently with no feedback at all
  // (see App.jsx's handleSkip), so if it were ever the first match here,
  // clicking it would never open the window this is trying to reach.
  const answerButtons = page.locator(
    'main button:not(:has-text("🎤")):not(:has-text("🛑")):not(:has-text("🔊")):not(:has-text("Pomiń")):not(:has-text("Skip"))',
  );
  for (let i = 0; i < 20; i++) {
    if (await submitBtn.isVisible().catch(() => false)) {
      await skipBtn.click().catch(() => {});
      await page.waitForTimeout(300);
      continue;
    }
    if ((await answerButtons.count()) >= 2) {
      // Scroll position inside `main` carries over across a tab switch, so
      // the new exercise's first option can land below the fold on a short
      // mobile viewport — `force: true` skips the usual actionability
      // checks but still needs a real in-viewport point to click.
      await answerButtons.first().scrollIntoViewIfNeeded();
      await answerButtons.first().click({ force: true });
      // Scoped to the exercise's own feedback bubble, not a bare
      // `[role="status"]` — VoiceFallbackBanner's toast (shown in browsers
      // without built-in speech recognition) uses the same role and would
      // otherwise satisfy this check without a real answer ever landing. If
      // this particular click didn't land on a real answer control, retry
      // instead of failing the whole helper outright.
      const landed = await page
        .getByRole('region', { name: /Exercise|Ćwiczenie|Übung/i })
        .getByRole('status')
        .isVisible({ timeout: 2000 })
        .catch(() => false);
      if (landed) return;
    }
    await page.waitForTimeout(300);
  }
  throw new Error('Could not find an answerable exercise to trigger feedback');
}

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
    // Opens the brief feedback/transition window nav is visible in, which is
    // what this test actually needs to check its responsive breakpoint.
    await triggerFeedbackWindow(page);
    await expect(
      page
        .getByRole('region', { name: /Exercise|Ćwiczenie|Übung/i })
        .getByRole('status'),
    ).toBeVisible();
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
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'cfg_settings',
        JSON.stringify({
          // A correct answer's feedback window auto-advances after 1.5s
          // (App.jsx's advanceDelay) — too tight a race against this test's
          // own multi-step aria-current assertions on a slower mobile/CI
          // render. extendedTime widens that to 3s, same knob a real user
          // with that setting on gets, without changing what's asserted.
          extendedTime: true,
          // Entrance transitions (animate-in/fade-in/slide-in-from-*) keep
          // the exercise wrapper "not stable" from Playwright's point of
          // view for a beat after every task/tab change, which made a
          // scroll-then-click on the very next task flaky here. noFlash
          // skips them entirely — same accessibility setting a real user
          // with motion sensitivity gets, not a test-only shortcut.
          noFlash: true,
          // This test switches through all three pillars and needs to
          // answer *something* in each to reveal nav again — several
          // Visual/Cognitive exercise types (Clock, Spatial, Sequence,
          // MemorySpan, rhythm/melody-tap) don't fit a generic "click a
          // button" heuristic at all (drag interactions, build-then-submit
          // with no plain options). graphemes/mirrorImage/logicalReasoning
          // all render through GraphemeExercise's shared plain
          // multiple-choice UI, so restricting each pillar to just one of
          // those makes every tab's first task reliably answerable this way.
          activeExercises: {
            phonemes: false,
            syllables: false,
            graphemes: true,
            auditory: false,
            vocabulary: false,
            scrabble: false,
            lcwc: false,
            context: false,
            dictation: false,
            readAloud: false,
            comprehension: false,
            rhythm: false,
            graphemePhoneme: false,
            clock: false,
            tracking: false,
            mirrorImage: true,
            oddOneOut: false,
            categorization: false,
            sequences: false,
            memorySpan: false,
            logicalReasoning: true,
            rhythmMemory: false,
            melodyMemory: false,
          },
        }),
      );
    });
    await page.goto('/');
    await page.locator('text=/Tylko nauka|Study only/i').click();
    await page.locator('text=/Rozpocznij|Start/i').click();

    // Switching tabs immediately starts a new task in the target pillar —
    // hiding nav again right away — so it has to be freshly revealed before
    // every single nav click below, not just the first.
    const revealNav = async () => {
      if (
        await page
          .locator('nav.justify-around')
          .isVisible()
          .catch(() => false)
      ) {
        return;
      }
      await triggerFeedbackWindow(page);
      await expect(page.locator('nav.justify-around')).toBeVisible();
    };
    const navButtons = page.locator('nav.justify-around button');
    // The feedback window nav reveals in is real but time-bounded (up to
    // extendedTime's 3s on a correct answer) — occasionally it's already
    // closed again by the time a check right after revealNav() runs, on a
    // slow render. Retrying the whole reveal-then-check cycle a couple more
    // times survives that instead of failing on a single unlucky one.
    const revealNavAndExpectCurrent = async (index) => {
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          await revealNav();
          await expect(navButtons.nth(index)).toHaveAttribute(
            'aria-current',
            'page',
            { timeout: 2000 },
          );
          return;
        } catch (err) {
          if (attempt === 2) throw err;
        }
      }
    };

    await revealNavAndExpectCurrent(0);

    await navButtons.nth(1).click();
    await revealNavAndExpectCurrent(1);
    await expect(navButtons.nth(0)).not.toHaveAttribute('aria-current');

    await navButtons.nth(2).click();
    await revealNavAndExpectCurrent(2);
  });
});
