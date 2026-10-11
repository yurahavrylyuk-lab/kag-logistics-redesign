import type { QuoteSubmissionService } from './types';
import { createMockQuoteSubmissionService } from './mock-service';
export type { QuoteSubmissionService } from './types';
export type { QuoteRequest, QuoteSubmissionResult } from './types';
export type QuoteServiceFactory = () => QuoteSubmissionService;

/** Phase-one composition boundary; phase two replaces this with a CRM adapter. */
export function createPrototypeQuoteSubmissionService(): QuoteSubmissionService {
  return createMockQuoteSubmissionService();
}
