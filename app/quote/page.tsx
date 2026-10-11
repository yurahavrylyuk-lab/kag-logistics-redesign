import { QuoteFallback } from '@/features/quote/QuoteFallback';
import { QuoteWizard } from '@/features/quote/QuoteWizard';
export default function QuotePage() { return <main id="main-content" className="content-section"><h1>Request pricing</h1><noscript><QuoteFallback /></noscript><QuoteWizard /></main>; }
