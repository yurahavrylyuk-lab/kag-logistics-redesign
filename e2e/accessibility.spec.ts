import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('homepage has no critical automated accessibility violations in both themes', async ({ page }) => {
  for (const theme of ['light', 'dark'] as const) {
    await page.goto('/');
    await page.getByLabel('Color theme').selectOption(theme);
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    const results = await new AxeBuilder({ page }).analyze();
    const blocking = results.violations.filter((violation) => ['critical', 'serious'].includes(violation.impact ?? ''));
    expect(blocking).toEqual([]);
  }
});
