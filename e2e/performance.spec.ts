import { expect, test } from '@playwright/test';

test('homepage stays within the SVG/CSS-first JavaScript transfer budget', async ({ page }) => {
  await page.goto('/');
  const scriptBytes = await page.evaluate(() => performance.getEntriesByType('resource').filter((entry) => entry.name.endsWith('.js')).reduce((total, entry) => total + (entry as PerformanceResourceTiming).transferSize, 0));
  expect(scriptBytes).toBeLessThan(500_000);
});
