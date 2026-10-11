import type { QuoteSubmissionService } from './types';

export function createMockQuoteSubmissionService(outcome: 'success' | 'server' = 'success', latencyMs = 80): QuoteSubmissionService {
  return {
    async submit() {
      await new Promise((resolve) => setTimeout(resolve, latencyMs));
      return outcome === 'server'
        ? { ok: false, kind: 'server', message: 'We could not prepare this prototype request. Please try again.' }
        : { ok: true, referenceId: 'KAG-DEMO-1042' };
    },
  };
}
