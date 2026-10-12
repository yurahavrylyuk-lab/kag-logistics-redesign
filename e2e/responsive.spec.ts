import { expect, test } from '@playwright/test';

test('compact mobile view has no horizontal overflow and routes to quote', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('html')).toHaveJSProperty('scrollWidth', 390);
  await page.getByRole('link', { name: 'Get a Quote' }).first().click();
  await expect(page).toHaveURL(/\/quote$/);
});

test('mobile floating Ship Now stays within the viewport and never overlays quote controls', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.locator('#hero').evaluate((hero) => window.scrollTo(0, window.scrollY + hero.getBoundingClientRect().bottom + 1));

  const floating = page.getByRole('link', { name: 'Persistent Ship Now' });
  await expect(floating).toBeVisible();
  const box = await floating.boundingBox();
  expect(box).not.toBeNull();
  expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(390);
  expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(844);

  await page.goto('/quote');
  await expect(page.getByRole('link', { name: 'Persistent Ship Now' })).toHaveCount(0);
});

test('landscape mobile navigation keeps its Ship Now action reachable', async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();

  const shipNow = page.getByRole('dialog', { name: 'Navigation menu' }).getByRole('link', { name: 'Ship Now' });
  await shipNow.evaluate((element) => element.scrollIntoView({ block: 'center' }));
  await expect(shipNow).toBeVisible();
  const box = await shipNow.boundingBox();
  expect((box?.y ?? Infinity) + (box?.height ?? Infinity)).toBeLessThanOrEqual(390);
});
