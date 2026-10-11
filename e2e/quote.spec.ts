import { expect, test } from '@playwright/test';

test('quote wizard validates, completes four data-entry steps, and prepares an email', async ({ page }) => {
  await page.goto('/quote');
  await expect(page.getByText('Step 1 of 4')).toBeVisible();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByText('Select a freight type.')).toBeVisible();
  await page.getByRole('button', { name: 'Dry Van' }).click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByText('Step 2 of 4')).toBeVisible();
  await page.getByLabel('Origin city').fill('Cleveland');
  await page.getByLabel('Origin state or province').fill('OH');
  await page.getByLabel('Destination city').fill('Columbus');
  await page.getByLabel('Destination state or province').fill('OH');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByLabel('First name').fill('Taylor');
  await page.getByLabel('Last name').fill('Smith');
  await page.getByLabel('Company').fill('Acme');
  await page.getByLabel('Business email').fill('taylor@example.com');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByText('Review & Submit')).toBeVisible();
  await page.getByRole('button', { name: 'Request Pricing' }).click();
  await expect(page.getByRole('heading', { name: 'Your quote email is ready to send' })).toBeVisible();
  await expect(page.getByText(/send it from your email client to complete the request/i)).toBeVisible();
});
