import { firefox } from '@playwright/test';

const browser = await firefox.launch();
const context = await browser.newContext();
const page = await context.newPage();

// Simulate zero installed TTS voices, the exact scenario reported.
await page.addInitScript(() => {
  Object.defineProperty(window.speechSynthesis, 'getVoices', {
    value: () => [],
    configurable: true,
  });
});

page.on('console', (msg) => {
  const t = msg.text();
  if (t.includes('useLocalTTS') || t.toLowerCase().includes('error')) {
    console.log(`[${new Date().toISOString()}] [console:${msg.type()}]`, t);
  }
});
page.on('pageerror', (err) => console.log('[pageerror]', err.message));

await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await page.getByRole('button', { name: 'Start' }).click();
await page.waitForTimeout(2000);

console.log(`[${new Date().toISOString()}] clicking read-aloud button`);
await page.getByRole('button', { name: /Read aloud/i }).click();
await page.waitForTimeout(1000);
await page.screenshot({ path: 'ff-tts-consent.png', fullPage: true });

console.log(`[${new Date().toISOString()}] clicking Download`);
await page.getByRole('button', { name: /Download/ }).click();

for (let i = 0; i < 40; i++) {
  await page.waitForTimeout(3000);
  const statusText = await page
    .locator('p[role="status"]')
    .allTextContents()
    .catch(() => []);
  const label = await page
    .getByRole('button', { name: /Read aloud|Pause|Resume/i })
    .getAttribute('aria-label')
    .catch(() => null);
  console.log(
    `[${new Date().toISOString()}] t+${(i + 1) * 3}s label=${label} status=${JSON.stringify(statusText)}`,
  );
  if (label && /pause/i.test(label)) {
    console.log('>>> reached speaking state, checking audio context <<<');
    break;
  }
}

await page.screenshot({ path: 'ff-tts-final.png', fullPage: true });
await browser.close();
