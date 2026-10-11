import { describe, expect, it, vi } from 'vitest';
import { track } from '@/features/analytics/track';

describe('analytics boundary', () => {
  it('does not include contact or freight payload values in analytics events', () => {
    const send = vi.fn();
    track('quote_submitted', { placement: 'quote-page', email: 'person@example.com', freightType: 'Dry Van' }, { track: send });
    expect(send).toHaveBeenCalledWith({ name: 'quote_submitted', properties: { placement: 'quote-page' } });
  });
});
