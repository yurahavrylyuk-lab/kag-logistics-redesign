import { expect, test } from '@playwright/test';

test('extensionless nested URLs serve route-specific content and working destinations without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    for (const [path, heading] of [
      ['/solutions/freight-brokerage', 'Freight Brokerage'],
      ['/industries/chemicals', 'Chemicals'],
      ['/resources/building-supply-chain-control', 'Building a clearer operating picture'],
    ]) {
      const response = await page.goto(`${path}?source=direct-link`);
      expect(response?.ok(), path).toBeTruthy();
      await expect(page).toHaveURL(new RegExp(`${path}\\?source=direct-link$`));
      await expect(page.getByRole('main').getByRole('heading', { level: 1, name: heading, exact: true })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Ship Now', exact: true }).first()).toHaveAttribute('href', 'https://www.kaglogistics.com/ship-now-2/');
      await page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'About', exact: true }).click();
      await expect(page.getByRole('heading', { level: 1, name: 'Built to keep complex supply chains moving.' })).toBeVisible();
    }
  } finally {
    await context.close();
  }
});

test('disabling JavaScript leaves marketing content and a quote fallback available', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Ship Now' }).first()).toHaveAttribute('href', 'https://www.kaglogistics.com/ship-now-2/');
  await expect(page.getByText('For a quote request, call')).toBeVisible();
  await page.goto('/about');
  await expect(page.getByRole('heading', { level: 1, name: /Built to keep complex supply chains moving/i })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Ship Now' }).first()).toHaveAttribute('href', 'https://www.kaglogistics.com/ship-now-2/');
  await page.goto('/quote');
  await expect(page.getByRole('heading', { level: 1, name: 'Request pricing' })).toBeVisible();
  await expect(page.locator('main').getByRole('link', { name: '800.536.3638' })).toHaveAttribute('href', 'tel:+18005363638');
  await context.close();
});
