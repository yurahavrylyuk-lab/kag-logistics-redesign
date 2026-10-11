import type { QuoteSubmissionService } from './types';
export type { QuoteSubmissionService } from './types';
export type { QuoteRequest, QuoteSubmissionResult } from './types';
export type QuoteServiceFactory = () => QuoteSubmissionService;
