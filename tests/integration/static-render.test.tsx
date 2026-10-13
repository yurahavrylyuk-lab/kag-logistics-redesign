// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { renderStaticRoute } from '@/app/static-render';
import { staticRouteManifest } from '@/app/route-manifest';

describe('static route rendering', () => {
  it('renders the About route with its canonical metadata and complete shared shell without browser globals', async () => {
    expect(typeof window).toBe('undefined');
    expect(typeof document).toBe('undefined');
    const result = await renderStaticRoute('/about');
    expect(result.html).toContain('Built to keep complex supply chains moving.');
    expect(result.html).toContain('<header');
    expect(result.html).toContain('<main id="main-content"');
    expect(result.html).toContain('<footer');
    expect(result.metadata).toMatchObject({
      title: 'About KAG Logistics | KAG Logistics',
      canonicalPath: '/about',
    });
  });

  it('resolves every known route including detail loaders to meaningful, deterministic HTML', async () => {
    for (const { path } of staticRouteManifest) {
      const first = await renderStaticRoute(path);
      expect(first.html, path).toContain('<h1');
      expect(first.html, path).not.toContain('Page not found');
      expect(first.html, path).not.toContain('Something went wrong');
      expect((await renderStaticRoute(path)).html, path).toBe(first.html);
    }
    expect((await renderStaticRoute('/solutions/freight-brokerage')).html).toContain('Access a managed carrier network');
  });

  it('provides a usable quote contact instead of a form that requires JavaScript', async () => {
    const { html } = await renderStaticRoute('/quote');
    expect(html).toContain('For a quote request, call');
    expect(html).toContain('href="tel:');
    expect(html).not.toContain('<form');
  });

  it('refuses to generate a document for an unknown route', async () => {
    await expect(renderStaticRoute('/solutions/not-real')).rejects.toThrow('Unknown static route');
  });
});
