import { contact } from '@/content/contact';
export function QuoteFallback() { return <p className="quote-fallback">For a quote request, call <a href={contact.phoneHref}>{contact.phoneDisplay}</a>.</p>; }
