import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { resolveTheme } from './resolve-theme';
import { readThemePreference, writeThemePreference } from './theme-storage';
import type { ResolvedTheme, ThemePreference } from './types';
import { track } from '@/features/analytics/track';

type ThemeContextValue = {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getMediaQuery() {
  return window.matchMedia('(prefers-color-scheme: dark)');
}

function applyTheme(theme: ResolvedTheme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;

  const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  themeColor?.setAttribute('content', theme === 'dark' ? '#101514' : '#f5f5f2');
}

export function ThemeProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [state, setState] = useState<{
    preference: ThemePreference;
    systemDark: boolean;
    ready: boolean;
  }>({ preference: 'system', systemDark: false, ready: false });
  const { preference, systemDark, ready } = state;
  const resolvedTheme = resolveTheme(preference, systemDark);

  useEffect(() => {
    const savedPreference = readThemePreference();
    const currentSystemDark = getMediaQuery().matches;
    applyTheme(resolveTheme(savedPreference, currentSystemDark));
    // This snapshot comes from browser APIs and must be read after static rendering.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ preference: savedPreference, systemDark: currentSystemDark, ready: true });
  }, []);

  useEffect(() => {
    if (ready) applyTheme(resolvedTheme);
  }, [ready, resolvedTheme]);

  useEffect(() => {
    if (!ready || preference !== 'system') {
      return undefined;
    }

    const mediaQuery = getMediaQuery();
    const handleChange = (event: MediaQueryListEvent) => {
      setState((current) => ({ ...current, systemDark: event.matches }));
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [preference, ready]);

  const value = useMemo<ThemeContextValue>(() => ({
    preference,
    resolvedTheme,
    setPreference: (nextPreference) => {
      writeThemePreference(nextPreference);
      track('theme_changed', { theme: nextPreference, source: 'theme-toggle' });
      const currentSystemDark = nextPreference === 'system' ? getMediaQuery().matches : systemDark;
      setState({ preference: nextPreference, systemDark: currentSystemDark, ready: true });
    },
  }), [preference, resolvedTheme, systemDark]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return value;
}
