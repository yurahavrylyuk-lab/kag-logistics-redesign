import type { QuoteRequest, QuoteSubmissionService } from './types';

export const QUOTE_EMAIL_RECIPIENT = 'delta.qoralis@gmail.com';

function routeLabel(location: QuoteRequest['origin']) {
  return [location.city, location.region, location.postalCode, location.country]
    .filter(Boolean)
    .join(', ')
    .replace(', ' + location.postalCode + ',', location.postalCode ? ` ${location.postalCode},` : ',');
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function buildQuoteMailto(request: QuoteRequest) {
  const originShort = `${request.origin.city}, ${request.origin.region}`;
  const destinationShort = `${request.destination.city}, ${request.destination.region}`;
  const subject = `KAG Logistics Quote Request — ${request.contact.company} — ${originShort} to ${destinationShort}`;
  const body = [
    'KAG Logistics Quote Request',
    '',
    `Freight type: ${request.freightType}`,
    `Origin: ${routeLabel(request.origin)}`,
    `Destination: ${routeLabel(request.destination)}`,
    `Pickup timing: ${titleCase(request.pickup.flexibility)}`,
    `Requested pickup date: ${request.pickup.date || 'Not specified'}`,
    '',
    `Contact: ${request.contact.firstName} ${request.contact.lastName}`,
    `Company: ${request.contact.company}`,
    `Business email: ${request.contact.email}`,
    `Business phone: ${request.contact.phone || 'Not provided'}`,
    '',
    'Shipment notes:',
    request.notes || 'None provided.',
  ].join('\n');

  return `mailto:${QUOTE_EMAIL_RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function createMailtoQuoteSubmissionService(
  openMailto: (href: string) => void = (href) => {
    window.location.href = href;
  },
): QuoteSubmissionService {
  return {
    async submit(request) {
      try {
        openMailto(buildQuoteMailto(request));
        return { ok: true, referenceId: 'EMAIL-DRAFT' };
      } catch {
        return {
          ok: false,
          kind: 'server',
          message: 'We could not open your email app. Please try again or contact us directly.',
        };
      }
    },
  };
}
