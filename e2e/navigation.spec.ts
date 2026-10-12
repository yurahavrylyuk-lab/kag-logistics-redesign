import { expect, test } from '@playwright/test';

test('primary navigation routes resolve without fake destinations', async ({ page }) => {
  await page.goto('/');
  const routes = ['/solutions/freight-brokerage', '/industries/chemicals', '/technology', '/resources/building-supply-chain-control', '/carriers', '/careers', '/about', '/quote'];
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('main')).toBeVisible();
  }
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Ship Now', exact: true })).toHaveAttribute('href', 'https://www.kaglogistics.com/ship-now-2/');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.getByRole('dialog').getByRole('link', { name: /ship now/i })).toHaveAttribute('href', 'https://www.kaglogistics.com/ship-now-2/');
});
