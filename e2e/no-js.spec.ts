import { expect, test } from '@playwright/test';

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
