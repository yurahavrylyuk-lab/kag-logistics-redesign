import { expect, test } from '@playwright/test';

for (const route of ['/', '/about', '/technology']) {
  test(`persistent Ship Now uses the configured destination after the opening area on ${route}`, async ({ page }) => {
    await page.goto(route);
    const sentinel = route === '/' ? '#hero' : '#floating-cta-top-sentinel';
    await page.locator(sentinel).evaluate((element) => window.scrollTo(0, window.scrollY + element.getBoundingClientRect().bottom + 1));

    await expect(page.getByRole('link', { name: 'Persistent Ship Now' })).toHaveAttribute('href', 'https://www.kaglogistics.com/ship-now-2/');
  });
}
