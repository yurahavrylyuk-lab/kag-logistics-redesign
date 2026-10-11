import type { QuoteRequest } from './types';
export function QuoteReview({ request }: { request: QuoteRequest }) { return <dl><dt>Freight</dt><dd>{request.freightType}</dd><dt>Route</dt><dd>{request.origin.city || 'Origin'} → {request.destination.city || 'Destination'}</dd><dt>Contact</dt><dd>{request.contact.email || 'Email required'}</dd></dl>; }
