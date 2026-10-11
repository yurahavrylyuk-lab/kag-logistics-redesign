import { describe, expect, it, vi } from 'vitest';
import { track } from '@/features/analytics/track';

describe('analytics boundary', () => {
  it('does not include contact or freight payload values in analytics events', () => {
    const send = vi.fn();
    track('quote_submitted', { source: 'quote-page', email: 'person@example.com', freightType: 'Dry Van' }, { track: send });
    expect(send).toHaveBeenCalledWith({ name: 'quote_submitted', properties: { source: 'quote-page', freightType: 'Dry Van' } });
  });

  it('retains the approved funnel properties without accepting sensitive values', () => {
    const send = vi.fn();
    track('quote_step_completed', { source: 'quote-page', step: 2, elapsedMs: 1250, validationErrorCount: 1, email: 'person@example.com' }, { track: send });
    expect(send).toHaveBeenCalledWith({ name: 'quote_step_completed', properties: { source: 'quote-page', step: 2, elapsedMs: 1250, validationErrorCount: 1 } });
  });

  it('accepts the non-sensitive theme event contract', () => {
    const send = vi.fn();
    track('theme_changed', { theme: 'dark', source: 'theme-toggle' }, { track: send });
    expect(send).toHaveBeenCalledWith({ name: 'theme_changed', properties: { theme: 'dark', source: 'theme-toggle' } });
  });
});
