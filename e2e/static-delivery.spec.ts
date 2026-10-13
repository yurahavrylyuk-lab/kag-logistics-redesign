import { expect, test } from '@playwright/test';
import { staticRouteManifest } from '../src/app/route-manifest';

test('every canonical public URL serves its own static document without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    for (const { path, metadata } of staticRouteManifest) {
      const response = await page.goto(path);
      expect(response?.ok(), path).toBeTruthy();
      await expect(page).toHaveTitle(metadata.title);
      await expect(page.getByRole('main').getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();
    }
    await page.goto('/quote');
    await expect(page.getByRole('main').getByRole('link', { name: '800.536.3638' })).toHaveAttribute('href', 'tel:+18005363638');
    await expect(page.locator('form')).toHaveCount(0);
  } finally {
    await context.close();
  }
});

test('hydrates the static nodes and updates metadata during navigation without browser errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  let release!: () => void;
  const entry = new Promise<void>(resolve => { release = resolve; });
  await page.route(/\/assets\/index-[^/]+\.js$/, async route => {
    await entry;
    await route.continue();
  });
  try {
    await page.goto('/about', { waitUntil: 'commit' });
    await expect(page).toHaveTitle('About KAG Logistics | KAG Logistics');
    const heading = await page.getByRole('heading', { level: 1, name: 'Built to keep complex supply chains moving.' }).elementHandle();
    const header = await page.locator('header').elementHandle();
    const canonical = await page.locator('link[rel="canonical"]').count()
      ? await page.locator('link[rel="canonical"]').getAttribute('href') : null;
    release();
    await page.waitForLoadState('networkidle');
    expect(await heading!.evaluate(node => node === document.querySelector('main h1'))).toBe(true);
    expect(await header!.evaluate(node => node === document.querySelector('header'))).toBe(true);
    await expect(page.locator('[data-choreography]').first()).toHaveAttribute('data-choreography-state', /static|entering|centered|exiting/);
    await page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Solutions', exact: true }).click();
    await expect(page).toHaveTitle('Solutions | KAG Logistics');
    await page.getByRole('main').getByRole('link', { name: /Freight Brokerage/ }).click();
    await expect(page).toHaveTitle('Freight Brokerage | KAG Logistics');
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Freight Brokerage | KAG Logistics');
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', 'Freight Brokerage | KAG Logistics');
    if (canonical) {
      const destination = `${new URL(canonical).origin}/solutions/freight-brokerage`;
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', destination);
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', destination);
    } else {
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
      await expect(page.locator('meta[property="og:url"]')).toHaveCount(0);
    }
    expect(errors).toEqual([]);
  } finally {
    release();
  }
});
