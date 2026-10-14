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

test('process timeline counts maintain accessible contrast in both themes', async ({ page }) => {
  for (const theme of ['light', 'dark'] as const) {
    await page.goto('/');
    await page.getByLabel('Color theme').selectOption(theme);

    const results = await new AxeBuilder({ page })
      .include('.process-timeline')
      .withRules(['color-contrast'])
      .analyze();

    expect(results.violations).toEqual([]);
  }
});

test('About, Technology, and the post-hero Ship Now state have no blocking accessibility violations', async ({ page }) => {
  for (const path of ['/about', '/technology']) {
    for (const theme of ['light', 'dark']) {
      await page.goto(path);
      await page.getByLabel('Color theme').selectOption(theme);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations.filter((violation) => ['critical', 'serious'].includes(violation.impact ?? ''))).toEqual([]);
    }
  }

  await page.goto('/', { waitUntil: 'networkidle' });
  await page.locator('#hero').evaluate((hero) => window.scrollTo(0, window.scrollY + hero.getBoundingClientRect().bottom + 1));
  await expect(page.getByRole('link', { name: 'Persistent Ship Now' })).toBeVisible();
  const postHeroResults = await new AxeBuilder({ page }).analyze();
  expect(postHeroResults.violations.filter((violation) => ['critical', 'serious'].includes(violation.impact ?? ''))).toEqual([]);
});

test('About KAG contrast remains accessible in both themes', async ({ page }) => {
  for (const theme of ['light', 'dark'] as const) {
    await page.goto('/');
    await page.getByLabel('Color theme').selectOption(theme);
    const results = await new AxeBuilder({ page }).include('.about-kag').withRules(['color-contrast']).analyze();
    expect(results.violations).toEqual([]);
  }
});

test('About KAG uses an opaque surface behind its contrast-critical copy', async ({ page }) => {
  await page.goto('/');
  const background = await page.locator('.about-kag').evaluate((element) => getComputedStyle(element).backgroundColor);
  expect(background).not.toBe('rgba(0, 0, 0, 0)');
});
