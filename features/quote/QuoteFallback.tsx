import { contact } from '@/content/contact';
export function QuoteFallback() { return <p>For a quote request, call <a href={contact.phoneHref}>{contact.phoneDisplay}</a>.</p>; }
