import { QuoteExperience } from '@/features/quote/QuoteExperience';
import { createPageMetadata } from '@/lib/metadata';

export const metadata = createPageMetadata({ title: 'Request pricing', description: 'Start a logistics shipment conversation with KAG Logistics.', path: '/quote' });

export default function QuotePage() { return <main data-floating-cta-suppress id="main-content" className="content-section"><h1>Request pricing</h1><QuoteExperience /></main>; }
