import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { staticRouteManifest } from '@/app/route-manifest';

const fixtures: string[] = [];
afterEach(() => fixtures.splice(0).forEach(path => rmSync(path, { recursive: true, force: true })));

function runPrerenderFixture(origin?: string) {
  const output = mkdtempSync(join(tmpdir(), 'kag-static-output-'));
  fixtures.push(output);
  writeFileSync(join(output, 'index.html'), '<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>KAG Logistics</title><!--app-head--><script type="module" src="/assets/app.js"></script><link rel="stylesheet" href="/assets/app.css"></head><body><div id="root"><!--app-html--></div></body></html>');
  const environment = { ...process.env };
  if (origin === undefined) delete environment.VITE_SITE_URL;
  else environment.VITE_SITE_URL = origin;
  execFileSync(process.execPath, ['--import', 'tsx', 'scripts/prerender.tsx', output], {
    cwd: resolve('.'),
    env: environment,
    stdio: 'pipe',
  });
  return output;
}

describe('static build output', () => {
  it('writes all manifest routes with metadata, full content, early theme bootstrap, and absolute assets', () => {
    const output = runPrerenderFixture(' https://logistics.example/deployment/?ignored=yes#fragment ');
    for (const { path, metadata } of staticRouteManifest) {
      const html = readFileSync(join(output, path, 'index.html'), 'utf8');
      const document = new DOMParser().parseFromString(html, 'text/html');
      expect(document.documentElement.lang, path).toBe('en');
      expect(document.querySelector('#root main h1')?.textContent, path).toBeTruthy();
      expect(document.querySelector('header'), path).not.toBeNull();
      expect(document.querySelector('footer'), path).not.toBeNull();
      expect(document.head.querySelectorAll('title'), path).toHaveLength(1);
      expect(document.title, path).toBe(metadata.title);
      expect(document.querySelector('meta[name="description"]')?.getAttribute('content'), path).toBe(metadata.description);
      expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href'), path).toBe(`https://logistics.example${path}`);
      expect(document.querySelector('meta[property="og:url"]')?.getAttribute('content'), path).toBe(`https://logistics.example${path}`);
      expect(document.querySelector('meta[name="twitter:card"]')?.getAttribute('content'), path).toBe('summary');
      expect(document.querySelector('meta[name="theme-color"]')?.getAttribute('content'), path).toBe('#f5f5f2');
      const theme = document.head.querySelector('script:not([src])');
      expect(theme?.textContent, path).toContain('localStorage.getItem');
      expect(html.indexOf(theme!.outerHTML), path).toBeLessThan(html.indexOf('src="/assets/app.js"'));
      expect(html.indexOf(theme!.outerHTML), path).toBeLessThan(html.indexOf('href="/assets/app.css"'));
      expect(document.querySelector('script[type="module"]')?.getAttribute('src'), path).toBe('/assets/app.js');
      expect(document.querySelector('link[rel="stylesheet"]')?.getAttribute('href'), path).toBe('/assets/app.css');
      for (const asset of document.querySelectorAll('img[src], script[src], link[rel="preload"][href]')) {
        expect(asset.getAttribute('src') ?? asset.getAttribute('href'), path).toMatch(/^\//);
      }
      expect(html, path).not.toContain('<!--app-');
    }
    const about = readFileSync(join(output, 'about/index.html'), 'utf8');
    expect(about).toContain('Built to keep complex supply chains moving.');
    expect(about).toContain('<title>About KAG Logistics | KAG Logistics</title>');
    const quote = readFileSync(join(output, 'quote/index.html'), 'utf8');
    expect(quote).toContain('For a quote request, call');
    expect(quote).not.toContain('<form');
    const sitemap = readFileSync(join(output, 'sitemap.xml'), 'utf8');
    const sitemapDocument = new DOMParser().parseFromString(sitemap, 'application/xml');
    const locations = [...sitemapDocument.querySelectorAll('loc')].map(node => node.textContent);
    expect(locations).toHaveLength(18);
    expect(new Set(locations).size).toBe(18);
    for (const { path } of staticRouteManifest) expect(locations).toContain(`https://logistics.example${path}`);
    expect(locations).toContain('https://logistics.example/solutions/freight-brokerage');
    expect(readFileSync(join(output, 'robots.txt'), 'utf8')).toBe('User-agent: *\nAllow: /\nSitemap: https://logistics.example/sitemap.xml\n');
  }, 30_000);

  it.each([undefined, ''])('omits origin-dependent SEO links when the site origin is %s', (origin) => {
    const output = runPrerenderFixture(origin);
    const document = new DOMParser().parseFromString(readFileSync(join(output, 'about/index.html'), 'utf8'), 'text/html');
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
    expect(document.querySelector('meta[property="og:url"]')).toBeNull();
    expect(document.title).toBe('About KAG Logistics | KAG Logistics');
    expect(readFileSync(join(output, 'robots.txt'), 'utf8')).toBe('User-agent: *\nAllow: /\n');
    expect(readFileSync(join(output, 'sitemap.xml'), 'utf8')).not.toContain('<loc>');
  }, 30_000);
});
