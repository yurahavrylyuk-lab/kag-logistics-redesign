import type { QuoteRequest } from './types';


function locationLabel(location: QuoteRequest['origin']) {
  const country = location.country === 'CA' ? 'Canada' : location.country === 'US' ? 'United States' : location.country;
  return [location.city, location.region, location.postalCode, country].filter(Boolean).join(', ');
}

export function QuoteReview({ request }: { request: QuoteRequest }) {
  return <section aria-labelledby="quote-review-heading" className="quote-review"><h3 id="quote-review-heading">Review &amp; Submit</h3><p>Confirm the request below before preparing it.</p><dl><dt>Freight</dt><dd>{request.freightType}</dd><dt>Origin</dt><dd>{locationLabel(request.origin)}</dd><dt>Destination</dt><dd>{locationLabel(request.destination)}</dd><dt>Timing</dt><dd>{request.pickup.flexibility}{request.pickup.date ? ` — ${request.pickup.date}` : ''}</dd><dt>Contact</dt><dd>{request.contact.firstName} {request.contact.lastName}, {request.contact.company}</dd><dt>Email</dt><dd>{request.contact.email}</dd>{request.contact.phone ? <><dt>Phone</dt><dd>{request.contact.phone}</dd></> : null}{request.notes ? <><dt>Notes</dt><dd>{request.notes}</dd></> : null}</dl></section>;
}
