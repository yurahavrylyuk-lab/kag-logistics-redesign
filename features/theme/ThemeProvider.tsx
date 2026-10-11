'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { resolveTheme } from './resolve-theme';
import { readThemePreference, writeThemePreference } from './theme-storage';
import type { ResolvedTheme, ThemePreference } from './types';

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
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');

  useEffect(() => {
    const initialPreference = readThemePreference();
    const mediaQuery = getMediaQuery();
    setPreferenceState(initialPreference);
    setResolvedTheme(resolveTheme(initialPreference, mediaQuery.matches));
  }, []);

  useEffect(() => {
    const mediaQuery = getMediaQuery();
    const applyResolvedTheme = (theme: ResolvedTheme) => {
      setResolvedTheme(theme);
      applyTheme(theme);
    };

    applyResolvedTheme(resolveTheme(preference, mediaQuery.matches));

    if (preference !== 'system') {
      return undefined;
    }

    const handleChange = (event: MediaQueryListEvent) => {
      applyResolvedTheme(resolveTheme('system', event.matches));
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [preference]);

  const value = useMemo<ThemeContextValue>(() => ({
    preference,
    resolvedTheme,
    setPreference: (nextPreference) => {
      writeThemePreference(nextPreference);
      setPreferenceState(nextPreference);
    },
  }), [preference, resolvedTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return value;
}
