import { QuoteFallback } from '@/features/quote/QuoteFallback';
import { QuoteWizard } from '@/features/quote/QuoteWizard';
import { createPageMetadata } from '@/lib/metadata';

export const metadata = createPageMetadata({ title: 'Request pricing', description: 'Start a logistics shipment conversation with KAG Logistics.', path: '/quote' });

export default function QuotePage() { return <main id="main-content" className="content-section"><h1>Request pricing</h1><QuoteFallback /><QuoteWizard /></main>; }
