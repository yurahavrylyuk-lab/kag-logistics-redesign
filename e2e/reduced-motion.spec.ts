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

test('reduced motion keeps About choreography static after client navigation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'About', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Built to keep complex supply chains moving.' })).toBeVisible();
  const sections = page.locator('[data-choreography]');
  expect(await sections.count()).toBeGreaterThan(0);
  for (const section of await sections.all()) {
    await expect(section).toHaveAttribute('data-choreography-state', 'static');
  }
  await expect(page.locator('.ambient-cursor')).toHaveCount(0);
});
