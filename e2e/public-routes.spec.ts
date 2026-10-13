import { expect, test } from '@playwright/test';

test('all public URLs resolve directly to their matching page', async ({ page }) => {
  const pages = [
    ['/', 'Bring complex supply chains under control.'],
    ['/about', 'Built to keep complex supply chains moving.'],
    ['/technology', 'Operational control at human scale'],
    ['/carriers', 'Move with a network that values the work'],
    ['/careers', 'Build what moves industry'],
    ['/quote', 'Request pricing'],
    ['/solutions', 'Solutions'],
    ['/industries', 'Industries'],
    ['/resources', 'Resources'],
    ['/solutions/transportation-management', 'Transportation Management'],
    ['/solutions/freight-brokerage', 'Freight Brokerage'],
    ['/solutions/dedicated-transportation', 'Dedicated Transportation'],
    ['/industries/chemicals', 'Chemicals'],
    ['/industries/energy-renewables', 'Energy & Renewables'],
    ['/industries/food-beverage', 'Food & Beverage'],
    ['/resources/building-supply-chain-control', 'Building a clearer operating picture'],
    ['/resources/transportation-management-pattern', 'A transportation management pattern'],
    ['/resources/visibility-exceptions', 'Visibility beyond a status update'],
  ];
  for (const [path, title] of pages) {
    const response = await page.goto(path);
    expect(response?.ok()).toBeTruthy();
    await expect(page.getByRole('heading', { level: 1, name: title, exact: true })).toBeVisible();
    await expect(page.getByRole('main')).toHaveAttribute('id', 'main-content');
  }
});

test('invalid content slugs show the accessible boundary and permit navigation home', async ({ page }) => {
  for (const path of ['/solutions/not-real', '/industries/freight-brokerage', '/resources/not-real', '/missing']) {
    await page.goto(path);
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
    await expect(page.getByRole('main')).toHaveAttribute('id', 'main-content');
    await page.getByRole('link', { name: 'KAG Logistics home' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Bring complex supply chains under control.' })).toBeVisible();
  }
});

test('typed category links navigate without reload and browser history restores routes', async ({ page }) => {
  await page.goto('/solutions');
  await page.evaluate(() => { document.documentElement.dataset.routeTest = 'same-document'; });
  await page.getByRole('main').getByRole('link', { name: /Freight Brokerage/ }).click();
  await expect(page).toHaveURL(/\/solutions\/freight-brokerage$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Freight Brokerage' })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-route-test', 'same-document');
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1, name: 'Solutions', exact: true })).toBeVisible();
  await page.goForward();
  await expect(page.getByRole('heading', { level: 1, name: 'Freight Brokerage' })).toBeVisible();
});
