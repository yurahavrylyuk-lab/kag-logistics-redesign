import type { QuoteSubmissionService } from './types';
import { createMailtoQuoteSubmissionService } from './mailto-service';
export type { QuoteSubmissionService } from './types';
export type { QuoteRequest, QuoteSubmissionResult } from './types';
export type QuoteServiceFactory = () => QuoteSubmissionService;

export function createPrototypeQuoteSubmissionService(): QuoteSubmissionService {
  return createMailtoQuoteSubmissionService();
}
