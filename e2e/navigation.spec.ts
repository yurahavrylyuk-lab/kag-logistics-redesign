import { expect, test } from '@playwright/test';

test('static assets and SEO files retain their own response instead of the HTML fallback', async ({ page, request }) => {
  for (const [path, contentType, content] of [
    ['/robots.txt', 'text/plain', 'User-agent: *'],
    ['/sitemap.xml', 'xml', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'],
    ['/logos/kag-dark.svg', 'image/svg+xml', '<svg'],
  ]) {
    const response = await request.get(path);
    expect(response.ok(), path).toBeTruthy();
    expect(response.headers()['content-type']).toContain(contentType);
    expect(await response.text()).toContain(content);
  }
  await page.goto('/solutions/freight-brokerage');
  const entry = await page.locator('script[type="module"][src]').getAttribute('src');
  expect(entry).toMatch(/^\/assets\/.*\.js$/);
  const response = await request.get(entry!);
  expect(response.ok()).toBeTruthy();
  expect(response.headers()['content-type']).toMatch(/javascript/);
});

test('hard refresh retains the requested route and its content on Vite preview', async ({ page }) => {
  for (const [path, heading] of [
    ['/', 'Bring complex supply chains under control.'],
    ['/about', 'Built to keep complex supply chains moving.'],
    ['/technology', 'Operational control at human scale'],
    ['/quote', 'Request pricing'],
    ['/resources/building-supply-chain-control', 'Building a clearer operating picture'],
  ]) {
    await page.goto(path);
    const response = await page.reload();
    expect(response?.ok(), path).toBeTruthy();
    expect(new URL(page.url()).pathname).toBe(path);
    await expect(page.getByRole('main').getByRole('heading', { level: 1, name: heading, exact: true })).toBeVisible();
  }
});

test('mobile navigation supports keyboard opening, focus wrapping, Escape, and route selection', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/about');
  const trigger = page.getByRole('button', { name: 'Open navigation' });
  await trigger.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Navigation menu' });
  await expect(dialog.getByRole('button', { name: 'Close navigation' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.getByLabel('Color theme')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(dialog.getByRole('button', { name: 'Close navigation' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await page.keyboard.press('Enter');
  await dialog.getByRole('link', { name: 'Technology', exact: true }).click();
  await expect(page).toHaveURL(/\/technology$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Operational control at human scale' })).toBeVisible();
  await expect(dialog).toHaveCount(0);
});

test('primary navigation routes resolve without fake destinations', async ({ page }) => {
  await page.goto('/');
  const routes = ['/solutions/freight-brokerage', '/industries/chemicals', '/technology', '/resources/building-supply-chain-control', '/carriers', '/careers', '/about', '/quote'];
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('main')).toBeVisible();
  }
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Ship Now', exact: true })).toHaveAttribute('href', 'https://www.kaglogistics.com/ship-now-2/');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.getByRole('dialog').getByRole('link', { name: /ship now/i })).toHaveAttribute('href', 'https://www.kaglogistics.com/ship-now-2/');
});
