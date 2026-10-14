import { RouteMain } from '@/app/RouteMain';
import { createFileRoute } from '@tanstack/react-router';
import { QuoteExperience } from '@/features/quote/QuoteExperience';

export const Route = createFileRoute('/quote')({
  component: QuotePage,
});

function QuotePage() {
  return <RouteMain data-floating-cta-suppress id="main-content" className="content-section"><h1>Request pricing</h1><QuoteExperience /></RouteMain>;
}
