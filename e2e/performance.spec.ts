import { expect, test } from '@playwright/test';

test('homepage stays within the SVG/CSS-first JavaScript transfer budget', async ({ page }, testInfo) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { level: 1, name: 'Bring complex supply chains under control.' })).toBeVisible();
  const scriptBytes = await page.evaluate(() => performance.getEntriesByType('resource').filter((entry) => entry.name.endsWith('.js')).reduce((total, entry) => total + (entry as PerformanceResourceTiming).transferSize, 0));
  await testInfo.attach('homepage-script-transfer-bytes', { body: String(scriptBytes), contentType: 'text/plain' });
  expect(scriptBytes).toBeGreaterThan(0);
  expect(scriptBytes).toBeLessThan(500_000);
});
