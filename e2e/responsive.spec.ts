import { expect, test } from '@playwright/test';

test('compact mobile view has no horizontal overflow and routes to quote', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('html')).toHaveJSProperty('scrollWidth', 390);
  await page.getByRole('link', { name: 'Get a Quote' }).first().click();
  await expect(page).toHaveURL(/\/quote$/);
});
