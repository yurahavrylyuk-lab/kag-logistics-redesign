import { describe, expect, it } from 'vitest';
import { quoteSchema } from '@/features/quote/schema';

describe('quoteSchema', () => {
  it('rejects a request without the required contact email', () => {
    const result = quoteSchema.safeParse({ freightType: 'Dry Van', origin: {}, destination: {}, pickup: { flexibility: 'scheduled' }, contact: { firstName: 'A', lastName: 'B', company: 'C', email: '' }, consent: { privacyAccepted: true }, source: { page: '/' } });
    expect(result.success).toBe(false);
  });
});
