import { render, screen, waitFor } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { AppProviders } from '@/app/providers';
import { ThemeBootstrapScript } from '@/features/theme/ThemeScript';
import { ThemeToggle } from '@/features/theme/ThemeToggle';
import { AmbientCursor } from '@/features/motion/AmbientCursor';

describe('AppProviders', () => {
  it('renders content without reading browser APIs during static rendering', () => {
    const media = vi.spyOn(window, 'matchMedia');
    const storage = vi.spyOn(Storage.prototype, 'getItem');

    expect(renderToStaticMarkup(<AppProviders><span>content</span><AmbientCursor /></AppProviders>)).toContain('content');
    expect(media).not.toHaveBeenCalled();
    expect(storage).not.toHaveBeenCalled();
  });

  it('renders without browser globals during static rendering', () => {
    vi.stubGlobal('window', undefined);
    vi.stubGlobal('document', undefined);
    expect(renderToStaticMarkup(<AppProviders><span>content</span><AmbientCursor /></AppProviders>)).toBe('<span>content</span>');
  });

  it('restores the saved preference after mounting the shell', async () => {
    localStorage.setItem('kag-theme-preference', 'dark');
    render(<AppProviders><ThemeToggle /></AppProviders>);
    await waitFor(() => expect(screen.getByLabelText('Color theme')).toHaveValue('dark'));
    expect(document.documentElement.dataset.theme).toBe('dark');
    localStorage.clear();
  });
});

describe('ThemeBootstrapScript', () => {
  it.each([
    ['system', true, 'dark'],
    ['system', false, 'light'],
    ['light', true, 'light'],
    ['dark', false, 'dark'],
    ['invalid', true, 'dark'],
  ])('applies %s with OS dark=%s before app effects', (stored, systemDark, expected) => {
    localStorage.setItem('kag-theme-preference', stored);
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: systemDark })));
    const html = renderToStaticMarkup(<ThemeBootstrapScript />);
    const script = new DOMParser().parseFromString(html, 'text/html').querySelector('script')!;
    window.eval(script.textContent!);
    expect(document.documentElement.dataset.theme).toBe(expected);
    expect(document.documentElement.style.colorScheme).toBe(expected);
    localStorage.clear();
  });

  it('keeps the bootstrap non-blocking when storage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('storage unavailable'); });
    const html = renderToStaticMarkup(<ThemeBootstrapScript />);
    const script = new DOMParser().parseFromString(html, 'text/html').querySelector('script')!;
    expect(() => window.eval(script.textContent!)).not.toThrow();
  });
});
