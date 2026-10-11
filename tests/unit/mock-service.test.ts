import { describe, expect, it } from 'vitest';
import { createMockQuoteSubmissionService } from '@/features/quote/mock-service';

describe('mock quote service', () => {
  it('returns a recoverable server result when configured to fail', async () => {
    const service = createMockQuoteSubmissionService('server');
    const result = await service.submit({ freightType: 'Dry Van', origin: { city: 'Cleveland', region: 'OH', country: 'US' }, destination: { city: 'Toronto', region: 'ON', country: 'CA' }, pickup: { flexibility: 'scheduled' }, contact: { firstName: 'A', lastName: 'B', company: 'C', email: 'a@example.com' }, consent: { privacyAccepted: true }, source: { page: '/' } });
    expect(result).toMatchObject({ ok: false, kind: 'server' });
  });
});
