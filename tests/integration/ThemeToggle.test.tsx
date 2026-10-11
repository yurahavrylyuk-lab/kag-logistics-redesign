import { render, screen } from '@testing-library/react';
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

    const select = screen.getByLabelText('Color theme');
    expect(document.documentElement.dataset.theme).toBe('dark');

    await user.selectOptions(select, 'light');

    expect(localStorage.getItem('kag-theme-preference')).toBe('light');
    expect(document.documentElement.dataset.theme).toBe('light');

    listener?.({ matches: true } as MediaQueryListEvent);

    expect(document.documentElement.dataset.theme).toBe('light');
  });
});
