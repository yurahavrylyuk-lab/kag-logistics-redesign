'use client';

import { useEffect } from 'react';
import { QuoteFallback } from './QuoteFallback';
import { QuoteWizard } from './QuoteWizard';

/** Preserves a usable fallback until the interactive wizard is mounted. */
export function QuoteExperience() {
  useEffect(() => {
    document.documentElement.dataset.quoteReady = 'true';
    return () => { delete document.documentElement.dataset.quoteReady; };
  }, []);
  return <div className="quote-experience"><QuoteFallback /><QuoteWizard /></div>;
}
