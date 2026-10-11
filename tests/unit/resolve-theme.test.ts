import { describe, expect, it } from 'vitest';
import { resolveTheme } from '@/features/theme/resolve-theme';

describe('resolveTheme', () => {
  it('uses the current operating-system scheme for a system preference', () => {
    expect(resolveTheme('system', true)).toBe('dark');
    expect(resolveTheme('system', false)).toBe('light');
  });

  it('keeps an explicit preference when the operating-system scheme differs', () => {
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
  });
});
