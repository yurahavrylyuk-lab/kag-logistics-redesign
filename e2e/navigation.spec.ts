import { expect, test } from '@playwright/test';

test('primary navigation routes resolve without fake destinations', async ({ page }) => {
  await page.goto('/');
  const routes = ['/solutions/freight-brokerage', '/industries/chemicals', '/technology', '/resources/building-supply-chain-control', '/carriers', '/careers', '/quote'];
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('main')).toBeVisible();
  }
});
