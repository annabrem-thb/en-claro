import { expect, test } from '@playwright/test';

import { EXERCISE_PILLARS } from '../src/data/exerciseTypes.js';

// WCAG 2.2 SC 1.4.12 (Text Spacing) + 1.4.10 (Reflow): with the app's maximum
// reading settings (and Bionic Reading on) plus the WCAG text-spacing
// overrides, at 320 CSS px and at desktop width, no text or control may be
// clipped, overlap its container, or force horizontal scrolling.
//
// One browser is enough: the checks are about layout, which does not vary
// per engine here, and 3 languages x 2 viewports x every view is already a
// large matrix.

const LANGS = ['de', 'pl', 'en'];
const VIEWPORTS = [
  { width: 320, height: 866 },
  { width: 1280, height: 800 },
];

// The sliders' maxima (see DEFAULT_SETTINGS in useUserSettings.js) plus the
// "Zusätzlicher Leseabstand" preset and Bionic Reading.
const MAX_SETTINGS = {
  lrs: true,
  bionicReading: true,
  fontSizeUi: 28,
  fontSizeExercise: 32,
  lineHeight: 2.2,
  letterSpacing: 0.24,
  wordSpacing: 0.32,
  paragraphSpacing: 3,
};

// WCAG 1.4.12's required minimums. The app's maxima above already exceed the
// line/letter/word values, so only the paragraph rule changes anything; the
// rest is stated for completeness and must not lower the maxima (hence no
// !important on those three).
const TEXT_SPACING_CSS = `
  * { line-height: max(1.5em, var(--line-height, 1.5)); }
  p { margin-bottom: 2em !important; }
`;

const PILLAR_OF = Object.fromEntries(
  Object.entries(EXERCISE_PILLARS).flatMap(([pillar, keys]) =>
    keys.map((key) => [key, pillar.toLowerCase()]),
  ),
);

async function openPage(context, lang, extraSettings = {}) {
  const page = await context.newPage();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(
    ({ injectedLang, settings }) => {
      window.localStorage.clear();
      window.localStorage.setItem('i18nextLng', injectedLang);
      window.localStorage.setItem('studyModeEnabled', 'false');
      window.localStorage.setItem(
        'cfg_settings',
        JSON.stringify({ language: injectedLang, ...settings }),
      );
    },
    { injectedLang: lang, settings: { ...MAX_SETTINGS, ...extraSettings } },
  );
  return page;
}

// Returns a list of human-readable problems found in the current DOM.
async function findLayoutProblems(page) {
  await page.addStyleTag({ content: TEXT_SPACING_CSS });
  await page.waitForTimeout(400);
  return page.evaluate(() => {
    const problems = [];
    const vw = window.innerWidth;
    const root = document.documentElement;
    if (root.scrollWidth > vw) {
      problems.push(`page scrolls horizontally (${root.scrollWidth} > ${vw})`);
    }

    const describe = (el) => {
      const id = el.id ? `#${el.id}` : '';
      const cls = (el.getAttribute('class') || '')
        .split(/\s+/)
        .slice(0, 3)
        .join('.');
      const text = (el.textContent || '')
        .trim()
        .replace(/\s+/g, ' ')
        .slice(0, 40);
      return `<${el.tagName.toLowerCase()}${id}${cls ? '.' + cls : ''}> "${text}"`;
    };

    const hasOwnText = (el) =>
      [...el.childNodes].some(
        (n) => n.nodeType === 3 && n.textContent.trim().length > 0,
      );

    const isControl = (el) =>
      el.matches('button, input, select, textarea, a[href], [role="button"]');

    const clips = (cs) =>
      ['hidden', 'clip', 'auto', 'scroll'].includes(cs.overflowX);

    for (const el of document.body.querySelectorAll('*')) {
      if (el.closest('.sr-only, [hidden], #vite-error-overlay')) continue;
      const cs = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      if (
        cs.display === 'none' ||
        cs.visibility === 'hidden' ||
        cs.opacity === '0' ||
        rect.width <= 1 ||
        rect.height <= 1
      ) {
        continue;
      }
      // Any box (not only ones with their own text) that hides overflowing
      // content: an exercise card with overflow-hidden clips whatever text
      // its children push past the bottom.
      if (
        ['hidden', 'clip'].includes(cs.overflowY) &&
        el.scrollHeight > el.clientHeight + 1 &&
        el.textContent.trim().length > 0 &&
        !el.matches('textarea, input')
      ) {
        problems.push(
          `hides overflowing content (${el.scrollHeight} > ${el.clientHeight}): ${describe(el)}`,
        );
      }
      const textual = hasOwnText(el);
      if (!textual && !isControl(el)) continue;

      // 1. Own box too small for its content (clipped or spilling over).
      if (
        cs.display !== 'inline' &&
        el.scrollWidth > el.clientWidth + 1 &&
        !(cs.overflowX === 'auto' || cs.overflowX === 'scroll')
      ) {
        problems.push(
          `content wider than its box (${el.scrollWidth} > ${el.clientWidth}): ${describe(el)}`,
        );
      }
      if (
        cs.display !== 'inline' &&
        ['hidden', 'clip'].includes(cs.overflowY) &&
        el.scrollHeight > el.clientHeight + 1
      ) {
        problems.push(
          `content taller than its box (${el.scrollHeight} > ${el.clientHeight}): ${describe(el)}`,
        );
      }
      if (
        cs.textOverflow === 'ellipsis' &&
        el.scrollWidth > el.clientWidth + 1
      ) {
        problems.push(`ellipsis truncation: ${describe(el)}`);
      }
      // line-clamp truncates vertically with an ellipsis.
      if (
        cs.webkitLineClamp &&
        cs.webkitLineClamp !== 'none' &&
        el.scrollHeight > el.clientHeight + 1
      ) {
        problems.push(`line-clamp truncation: ${describe(el)}`);
      }

      // 2. Poking out of an ancestor that clips it, or off the viewport. A
      // wrapped inline element's bounding box spans all its lines, so check
      // each line box (client rect) on its own.
      const rects = [...el.getClientRects()].filter(
        (r) => r.width > 1 && r.height > 1,
      );
      const outside = rects.find((r) => r.right > vw + 1 || r.left < -1);
      if (outside) {
        let scrollable = false;
        for (let a = el.parentElement; a; a = a.parentElement) {
          const acs = getComputedStyle(a);
          if (acs.overflowX === 'auto' || acs.overflowX === 'scroll') {
            scrollable = true;
            break;
          }
        }
        if (!scrollable) {
          problems.push(
            `outside the viewport (${Math.round(outside.left)}..${Math.round(outside.right)} of ${vw}): ${describe(el)}`,
          );
        }
      }
      for (
        let a = el.parentElement;
        a && a !== document.body;
        a = a.parentElement
      ) {
        const acs = getComputedStyle(a);
        if (!clips(acs)) continue;
        const ar = a.getBoundingClientRect();
        if (rects.some((r) => r.left < ar.left - 1 || r.right > ar.right + 1)) {
          problems.push(
            `clipped horizontally by ${describe(a)}: ${describe(el)}`,
          );
          break;
        }
      }
    }
    return [...new Set(problems)];
  });
}

function expectNoProblems(problems, label) {
  expect(problems, `${label}:\n  ${problems.join('\n  ')}`).toEqual([]);
}

for (const viewport of VIEWPORTS) {
  for (const lang of LANGS) {
    test.describe(`Text spacing ${viewport.width}px [${lang.toUpperCase()}]`, () => {
      test.skip(
        ({ browserName }) => browserName !== 'chromium',
        'layout checks run once, in Chromium',
      );
      test.use({ viewport });

      test('welcome screens, steps 1 and 2', async ({ context }) => {
        const page = await openPage(context, lang);
        await page.goto('/');
        await page.locator(`button[lang="${lang}"]`).click();
        expectNoProblems(await findLayoutProblems(page), 'welcome step 1');

        await page.locator('text=/Weiter|Next|Dalej/i').click();
        await expect(
          page.locator('text=/Tylko nauka|Study only|Nur lernen/i'),
        ).toBeVisible();
        expectNoProblems(await findLayoutProblems(page), 'welcome step 2');
      });

      test('navigation, garden, settings and survey', async ({ context }) => {
        const page = await openPage(context, lang);

        await page.goto('/#/literacy');
        await expect(page.locator('main section')).toBeVisible();
        expectNoProblems(await findLayoutProblems(page), 'literacy + nav');

        await page.goto('/#/garden');
        await expect(page.locator('main')).toBeVisible();
        expectNoProblems(await findLayoutProblems(page), 'garden');

        await page.goto('/#/settings');
        await expect(page.locator('[role="dialog"]')).toBeVisible();
        expectNoProblems(await findLayoutProblems(page), 'settings');

        // The nav is unmounted while a task is being worked on, so open the
        // survey from the Garden, where it is always present.
        await page.goto('/#/garden');
        await expect(page.locator('main')).toBeVisible();
        await page
          .locator('button[aria-keyshortcuts="Control+s"]:visible')
          .first()
          .click();
        await expect(page.locator('#survey-title')).toBeVisible();
        expectNoProblems(await findLayoutProblems(page), 'survey');
      });

      test('one task of every exercise type', async ({ context }) => {
        test.setTimeout(240000);
        const all = [];
        for (const [key, pillar] of Object.entries(PILLAR_OF)) {
          // Only this exercise type stays in the pillar's task pool.
          const activeExercises = Object.fromEntries(
            Object.keys(PILLAR_OF).map((k) => [k, k === key]),
          );
          const page = await openPage(context, lang, { activeExercises });
          await page.goto(`/#/${pillar}`);
          await expect(page.locator('main section')).toBeVisible();
          await page
            .locator('main section [tabindex="-1"]')
            .first()
            .waitFor({
              timeout: 10000,
            })
            .catch(() => {});
          const problems = await findLayoutProblems(page);
          all.push(...problems.map((p) => `[${key}] ${p}`));
          await page.close();
        }
        expectNoProblems(all, 'exercise types');
      });
    });
  }
}
