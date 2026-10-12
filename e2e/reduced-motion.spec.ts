import { expect, test } from '@playwright/test';

test('reduced-motion homepage remains horizontally contained', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const dimensions = await page.evaluate(() => ({ body: document.body.scrollWidth, viewport: window.innerWidth }));
  expect(dimensions.body).toBeLessThanOrEqual(dimensions.viewport);
  await expect(page.locator('.ambient-cursor')).toHaveCount(0);
  await expect(page.locator('[data-choreography-state="static"]')).not.toHaveCount(0);
  await expect(page.getByLabel('Logistics network from origin to destination')).toBeVisible();
});
