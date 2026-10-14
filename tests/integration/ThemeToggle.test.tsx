import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '@/features/theme/ThemeProvider';
import { ThemeToggle } from '@/features/theme/ThemeToggle';

type Listener = (event: MediaQueryListEvent) => void;

let listener: Listener | undefined;
let systemDark = true;

function installMatchMedia() {
  vi.stubGlobal('matchMedia', vi.fn().mockImplementation(() => ({
    get matches() {
      return systemDark;
    },
    media: '(prefers-color-scheme: dark)',
    onchange: null,
    addEventListener: (_event: 'change', callback: Listener) => {
      listener = callback;
    },
    removeEventListener: (_event: 'change', callback: Listener) => {
      if (listener === callback) {
        listener = undefined;
      }
    },
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })));
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    systemDark = true;
    listener = undefined;
    installMatchMedia();
  });

  afterEach(() => vi.unstubAllGlobals());

  it('persists an explicit choice and does not let subsequent OS changes override it', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    expect(screen.getByRole('group', { name: 'Color theme' })).toBeInTheDocument();
    expect(screen.getByText('Theme')).toBeInTheDocument();
    expect(document.documentElement.dataset.theme).toBe('dark');

    await user.click(screen.getByRole('button', { name: 'Light theme' }));

    expect(localStorage.getItem('kag-theme-preference')).toBe('light');
    expect(document.documentElement.dataset.theme).toBe('light');

    listener?.({ matches: true } as MediaQueryListEvent);

    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('uses the current OS value when the preference returns to system', async () => {
    const user = userEvent.setup();
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>);
    await user.click(screen.getByRole('button', { name: 'Light theme' }));
    systemDark = false;
    await user.click(screen.getByRole('button', { name: 'Dark theme' }));
    systemDark = true;
    await user.click(screen.getByRole('button', { name: 'System theme' }));

    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('follows system changes while system is selected and releases its listener on unmount', () => {
    const { unmount } = render(<ThemeProvider><ThemeToggle /></ThemeProvider>);
    expect(listener).toBeDefined();
    act(() => listener?.({ matches: false } as MediaQueryListEvent));
    expect(document.documentElement.dataset.theme).toBe('light');
    unmount();
    expect(listener).toBeUndefined();
  });

  it('initializes and changes theme when storage access fails', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    const user = userEvent.setup();
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>);
    expect(document.documentElement.dataset.theme).toBe('dark');
    await user.click(screen.getByRole('button', { name: 'Light theme' }));
    expect(document.documentElement.dataset.theme).toBe('light');
  });
});
