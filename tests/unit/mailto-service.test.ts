import { describe, expect, it } from 'vitest';
import { buildQuoteMailto } from '@/features/quote/mailto-service';
import type { QuoteRequest } from '@/features/quote/types';

const request: QuoteRequest = {
  freightType: 'Dry Van',
  origin: { city: 'Chicago', region: 'IL', postalCode: '60601', country: 'US' },
  destination: { city: 'Detroit', region: 'MI', postalCode: '48201', country: 'US' },
  pickup: { date: '2026-10-20', flexibility: 'scheduled' },
  contact: {
    firstName: 'Alex',
    lastName: 'Morgan',
    company: 'Northstar Manufacturing',
    email: 'alex@example.com',
    phone: '+1 555 0100',
  },
  notes: 'Dock appointment required.',
  consent: { privacyAccepted: true },
  source: { page: '/quote' },
};

describe('buildQuoteMailto', () => {
  it('targets the temporary Delta Qoralis inbox with a useful subject', () => {
    const mailto = buildQuoteMailto(request);
    expect(mailto).toContain('mailto:delta.qoralis@gmail.com?');
    expect(decodeURIComponent(mailto)).toContain('KAG Logistics Quote Request — Northstar Manufacturing — Chicago, IL to Detroit, MI');
  });

  it('includes the complete shipment and contact details in the email body', () => {
    const decoded = decodeURIComponent(buildQuoteMailto(request));
    expect(decoded).toContain('Freight type: Dry Van');
    expect(decoded).toContain('Origin: Chicago, IL 60601, US');
    expect(decoded).toContain('Destination: Detroit, MI 48201, US');
    expect(decoded).toContain('Pickup timing: Scheduled');
    expect(decoded).toContain('Requested pickup date: 2026-10-20');
    expect(decoded).toContain('Contact: Alex Morgan');
    expect(decoded).toContain('Company: Northstar Manufacturing');
    expect(decoded).toContain('Business email: alex@example.com');
    expect(decoded).toContain('Business phone: +1 555 0100');
    expect(decoded).toContain('Shipment notes:\nDock appointment required.');
  });
});
