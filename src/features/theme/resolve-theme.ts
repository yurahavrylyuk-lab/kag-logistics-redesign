import type { ResolvedTheme, ThemePreference } from './types';

export function resolveTheme(preference: ThemePreference, systemDark: boolean): ResolvedTheme {
  if (preference === 'system') {
    return systemDark ? 'dark' : 'light';
  }

  return preference;
}
