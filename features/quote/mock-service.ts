import type { QuoteSubmissionService } from './types';

export function createMockQuoteSubmissionService(outcome: 'success' | 'server' = 'success'): QuoteSubmissionService {
  return { async submit() { return outcome === 'server' ? { ok: false, kind: 'server', message: 'We could not submit this request. Please try again.' } : { ok: true, referenceId: 'KAG-DEMO-1042' }; } };
}
