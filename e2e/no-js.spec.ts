import { expect, test } from '@playwright/test';

test('disabling JavaScript leaves marketing content and a quote fallback available', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByText('For a quote request, call')).toBeVisible();
  await page.goto('/quote');
  await expect(page.getByRole('heading', { level: 1, name: 'Request pricing' })).toBeVisible();
  await expect(page.locator('main').getByRole('link', { name: '800.536.3638' })).toHaveAttribute('href', 'tel:+18005363638');
  await context.close();
});
