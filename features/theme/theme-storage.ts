import { THEME_STORAGE_KEY, type ThemePreference } from './types';

export function readThemePreference(): ThemePreference {
  if (typeof window === 'undefined') {
    return 'system';
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
}

export function writeThemePreference(preference: ThemePreference): void {
  window.localStorage.setItem(THEME_STORAGE_KEY, preference);
}
