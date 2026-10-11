import { QuoteWizard } from '@/features/quote/QuoteWizard';
import { QuoteFallback } from '@/features/quote/QuoteFallback';

export function QuoteSection() {
  return <section className="content-section" id="quote"><p className="eyebrow">Request pricing</p><h2>Let’s start with the shipment.</h2><QuoteFallback /><QuoteWizard /></section>;
}
