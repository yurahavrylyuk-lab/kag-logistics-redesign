import { useEffect, useSyncExternalStore } from 'react';
import { QuoteFallback } from './QuoteFallback';
import { QuoteWizard } from './QuoteWizard';

const subscribe = () => () => {};

/** Preserves a usable fallback until the interactive wizard is mounted. */
export function QuoteExperience() {
  const ready = useSyncExternalStore(subscribe, () => true, () => false);
  useEffect(() => {
    document.documentElement.dataset.quoteReady = 'true';
    return () => { delete document.documentElement.dataset.quoteReady; };
  }, []);
  return <div className="quote-experience"><QuoteFallback />{ready ? <QuoteWizard /> : null}</div>;
}
