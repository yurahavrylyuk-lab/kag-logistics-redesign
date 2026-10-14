export type QuoteRequest = {
  freightType: string;
  origin: { city: string; region: string; postalCode?: string; country: string };
  destination: { city: string; region: string; postalCode?: string; country: string };
  pickup: { date?: string; flexibility: 'scheduled' | 'flexible' | 'urgent' };
  contact: { firstName: string; lastName: string; company: string; email: string; phone?: string };
  notes?: string;
  consent: { privacyAccepted: boolean; marketingOptIn?: boolean };
  source: { page: string; campaign?: string };
};

export type QuoteSubmissionResult = { ok: true; referenceId: string } | { ok: false; kind: 'validation' | 'server' | 'network'; message: string; fieldErrors?: Record<string, string> };
export interface QuoteSubmissionService { submit(request: QuoteRequest): Promise<QuoteSubmissionResult>; }
