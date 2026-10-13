import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

async function expectAccessibleQuote(page: Page) {
  const results = await new AxeBuilder({ page }).include('#main-content').analyze();
  expect(results.violations.filter((violation) => ['critical', 'serious'].includes(violation.impact ?? ''))).toEqual([]);
}

test('quote wizard validates, completes four data-entry steps, and prepares an email', async ({ page }) => {
  await page.goto('/quote');
  await expect(page.getByText('Step 1 of 4')).toBeVisible();
  await expectAccessibleQuote(page);
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByText('Select a freight type.')).toBeVisible();
  await page.getByRole('button', { name: 'Dry Van' }).click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByText('Step 2 of 4')).toBeVisible();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByLabel('Origin city')).toBeFocused();
  await expect(page.getByLabel('Origin city')).toHaveAttribute('aria-describedby', 'route-help origin-city-error');
  await expectAccessibleQuote(page);
  await page.getByRole('combobox', { name: 'Origin country' }).click();
  await page.getByRole('option', { name: 'Canada', exact: true }).click();
  await page.getByLabel('Origin city').fill('Cleveland');
  await page.getByLabel('Origin state or province').fill('OH');
  await page.getByLabel('Destination city').fill('Columbus');
  await page.getByLabel('Destination state or province').fill('OH');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByText('Step 3 of 4')).toBeVisible();
  await page.getByRole('combobox', { name: 'Pickup timing' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('listbox')).toBeVisible();
  await page.keyboard.press('End');
  await expect(page.getByRole('option', { name: 'Urgent', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('combobox', { name: 'Pickup timing' })).toHaveText('Urgent');
  await expectAccessibleQuote(page);
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByText('Step 4 of 4')).toBeVisible();
  await page.getByLabel('First name').fill('Taylor');
  await page.getByLabel('Last name').fill('Smith');
  await page.getByLabel('Company').fill('Acme');
  await page.getByLabel('Business email').fill('taylor@example.com');
  await page.getByRole('checkbox').check();
  await expectAccessibleQuote(page);
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByText('Review & Submit')).toBeVisible();
  await expect(page.getByText('Cleveland, OH, Canada')).toBeVisible();
  await expect(page.getByText('urgent', { exact: true })).toBeVisible();
  await expect(page.getByText('Step 5 of 4')).toHaveCount(0);
  await page.getByRole('button', { name: 'Request Pricing' }).click();
  await expect(page.getByRole('heading', { name: 'Your quote email is ready to send' })).toBeVisible();
  await expect(page.getByText(/send it from your email client to complete the request/i)).toBeVisible();
});
