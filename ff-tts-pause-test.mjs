import { firefox } from '@playwright/test';

const browser = await firefox.launch();
const context = await browser.newContext();
const page = await context.newPage();

await page.addInitScript(() => {
  Object.defineProperty(window.speechSynthesis, 'getVoices', {
    value: () => [],
    configurable: true,
  });
  // Speed up the test: pretend consent was already granted so we skip
  // straight to loading, and pre-seed nothing else (model still has to load
  // for real, to prove the whole pipeline).
  localStorage.setItem('localTTSConsent', 'granted');
});

page.on('console', (msg) => console.log(`[console:${msg.type()}]`, msg.text()));
page.on('pageerror', (err) => console.log('[pageerror]', err.message));

await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await page.getByRole('button', { name: 'Start' }).click();
await page.waitForTimeout(2000);

await page.getByRole('button', { name: /Read aloud/i }).click();
await page.waitForTimeout(1000);
await page.screenshot({ path: 'ff-tts-pause-debug.png', fullPage: true });
console.log(
  'localTTSConsent in localStorage:',
  await page.evaluate(() => localStorage.getItem('localTTSConsent')),
);

// Wait until it's actually speaking (label becomes "Pause").
let speaking = false;
for (let i = 0; i < 40; i++) {
  await page.waitForTimeout(3000);
  const label = await page
    .locator('button[aria-label]')
    .filter({ hasText: '' })
    .first()
    .getAttribute('aria-label')
    .catch(() => null);
  const btn = page.getByRole('button', { name: /Read aloud|Pause|Resume/i });
  const currentLabel = await btn.getAttribute('aria-label').catch(() => null);
  console.log(`t+${(i + 1) * 3}s label=${currentLabel}`);
  if (currentLabel && /pause/i.test(currentLabel)) {
    speaking = true;
    break;
  }
}

if (!speaking) {
  console.log('never reached speaking state');
  await browser.close();
  process.exit(1);
}

console.log('--- clicking to pause ---');
await page.getByRole('button', { name: /Pause/i }).click();
await page.waitForTimeout(500);
const afterPause = await page
  .getByRole('button', { name: /Resume|Pause|Read aloud/i })
  .getAttribute('aria-label');
console.log('label after pause click:', afterPause);

console.log('--- clicking to resume ---');
await page.getByRole('button', { name: /Resume/i }).click();
await page.waitForTimeout(500);
const afterResume = await page
  .getByRole('button', { name: /Resume|Pause|Read aloud/i })
  .getAttribute('aria-label');
console.log('label after resume click:', afterResume);

await browser.close();
