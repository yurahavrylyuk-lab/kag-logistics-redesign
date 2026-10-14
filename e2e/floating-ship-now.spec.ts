import { expect, test } from '@playwright/test';

for (const route of ['/', '/about', '/technology']) {
  test(`persistent Ship Now uses the configured destination after the opening area on ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'networkidle' });
    const sentinel = route === '/' ? '#hero' : '#floating-cta-top-sentinel';
    await page.locator(sentinel).evaluate((element) => window.scrollTo(0, window.scrollY + element.getBoundingClientRect().bottom + 1));

    await expect(page.getByRole('link', { name: 'Persistent Ship Now' })).toHaveAttribute('href', 'https://www.kaglogistics.com/ship-now-2/');
  });
}

test('quote suppresses the persistent Ship Now action after scrolling its controls', async ({ page }) => {
  await page.goto('/quote');
  await expect(page.getByText('Step 1 of 4')).toBeVisible();
  await page.locator('#floating-cta-top-sentinel').evaluate((element) => window.scrollTo(0, window.scrollY + element.getBoundingClientRect().bottom + 1));
  await expect(page.getByRole('link', { name: 'Persistent Ship Now' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeVisible();
});

test('client-side route changes rebind the floating CTA and section choreography to the new page', async ({ page }) => {
  // Initial router hydration resets scroll; exercise the enhanced page after it settles.
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.locator('#hero').evaluate((element) => window.scrollTo(0, window.scrollY + element.getBoundingClientRect().bottom + 1));
  await expect(page.getByRole('link', { name: 'Persistent Ship Now' })).toBeVisible();

  await page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'About' }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole('link', { name: 'Persistent Ship Now' })).toHaveCount(0);
  await expect(page.locator('[data-choreography-state]')).not.toHaveCount(0);

  await page.getByRole('link', { name: 'KAG Logistics home' }).click();
  await page.getByRole('link', { name: 'Get a Quote' }).first().click();
  await expect(page).toHaveURL(/\/quote$/);
  await expect(page.getByRole('link', { name: 'Persistent Ship Now' })).toHaveCount(0);
});
