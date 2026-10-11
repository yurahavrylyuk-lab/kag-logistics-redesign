'use client';

import { useState } from 'react';
import { type DeepPartial, type FieldPath, useForm, useWatch } from 'react-hook-form';
import { createMockQuoteSubmissionService } from './mock-service';
import { QuoteProgress } from './QuoteProgress';
import { QuoteReview } from './QuoteReview';
import { quoteSchema } from './schema';
import type { QuoteRequest, QuoteSubmissionService } from './types';
import { track } from '@/features/analytics/track';

const defaults: QuoteRequest = {
  freightType: '',
  origin: { city: '', region: '', country: 'US' },
  destination: { city: '', region: '', country: 'US' },
  pickup: { flexibility: 'scheduled' },
  contact: { firstName: '', lastName: '', company: '', email: '' },
  consent: { privacyAccepted: false },
  source: { page: '/' },
};

const fieldsByStep: Record<number, FieldPath<QuoteRequest>[]> = {
  1: ['freightType'],
  2: ['origin.city', 'origin.region', 'destination.city', 'destination.region'],
  3: ['pickup.flexibility'],
  4: ['contact.firstName', 'contact.lastName', 'contact.company', 'contact.email', 'consent.privacyAccepted'],
};

function mergeWithDefaults(value: DeepPartial<QuoteRequest>): QuoteRequest {
  return {
    ...defaults,
    ...value,
    origin: { ...defaults.origin, ...value.origin },
    destination: { ...defaults.destination, ...value.destination },
    pickup: { ...defaults.pickup, ...value.pickup },
    contact: { ...defaults.contact, ...value.contact },
    consent: { ...defaults.consent, ...value.consent },
    source: { ...defaults.source, ...value.source },
  };
}

export function QuoteWizard({ service = createMockQuoteSubmissionService() }: { service?: QuoteSubmissionService }) {
  const {
    control,
    getValues,
    register,
    setFocus,
    setValue,
  } = useForm<QuoteRequest>({
    defaultValues: defaults,
    mode: 'onTouched',
  });
  const [step, setStep] = useState(1);
  const [state, setState] = useState<'editing' | 'submitting' | 'success' | 'error'>('editing');
  const [stepError, setStepError] = useState<string | null>(null);
  const watchedRequest = useWatch({ control });
  const request = mergeWithDefaults(watchedRequest);

  const advance = async () => {
    const fields = fieldsByStep[step];
    const parsed = quoteSchema.safeParse(getValues());
    const issue = parsed.success ? undefined : parsed.error.issues.find((candidate) => fields.includes(candidate.path.join('.') as FieldPath<QuoteRequest>));
    if (issue) {
      setStepError(issue.message);
      setFocus(fields[0]);
      return;
    }
    setStepError(null);
    setState('editing');
    setStep((current) => current + 1);
  };

  const submit = async () => {
    const parsed = quoteSchema.safeParse(getValues());
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      const firstStep = Object.entries(fieldsByStep).find(([, fields]) => fields.includes(firstIssue.path.join('.') as FieldPath<QuoteRequest>));
      setStep(Number(firstStep?.[0] ?? 4));
      setStepError(firstIssue.message);
      setFocus((firstIssue.path.join('.') || 'contact.firstName') as FieldPath<QuoteRequest>);
      return;
    }
    setState('submitting');
    const result = await service.submit(getValues());
    track('quote_submitted', { placement: 'quote-wizard', outcome: result.ok ? 'success' : 'error' });
    setState(result.ok ? 'success' : 'error');
  };

  if (state === 'success') {
    return (
      <section aria-live="polite" className="quote-result">
        <h2>Request received</h2>
        <p>Our logistics team will be in touch. Your reference is KAG-DEMO-1042.</p>
        <button onClick={() => { setStep(1); setState('editing'); }} type="button">Start another request</button>
      </section>
    );
  }

  return (
    <section aria-labelledby="quote-wizard-heading" className="quote-wizard">
      <h2 className="sr-only" id="quote-wizard-heading">Request pricing</h2>
      <QuoteProgress step={step} />
      {state === 'error' ? <p aria-live="assertive" className="form-error" role="alert">We could not submit this request. Please try again. Your details have been retained.</p> : null}
      {step === 1 ? (
        <fieldset>
          <legend>What are you shipping?</legend>
          <input type="hidden" {...register('freightType')} />
          <p id="freight-help">Choose the equipment or service that most closely fits this shipment.</p>
          <div aria-describedby="freight-help freight-error" className="freight-options" role="group">
            {['Liquid Bulk', 'Dry Bulk', 'Dry Van', 'Refrigerated', 'Flatbed', 'Container', 'Expedited', 'Other / Not Sure'].map((type) => (
              <button aria-pressed={request.freightType === type} key={type} onClick={() => { setStepError(null); setValue('freightType', type); }} type="button">{type}</button>
            ))}
          </div>
          {stepError ? <p className="form-error" id="freight-error" role="alert">{stepError}</p> : null}
        </fieldset>
      ) : null}
      {step === 2 ? (
        <fieldset>
          <legend>Origin and destination</legend>
          <div className="form-grid">
            <label>Origin city<input aria-describedby="origin-city-error" autoComplete="address-level2" {...register('origin.city')} /></label>
            <label>Origin state or province<input aria-describedby="origin-region-error" autoComplete="address-level1" {...register('origin.region')} /></label>
            <label>Destination city<input aria-describedby="destination-city-error" autoComplete="address-level2" {...register('destination.city')} /></label>
            <label>Destination state or province<input aria-describedby="destination-region-error" autoComplete="address-level1" {...register('destination.region')} /></label>
          </div>
          {stepError ? <p className="form-error" role="alert">{stepError}</p> : null}
        </fieldset>
      ) : null}
      {step === 3 ? (
        <fieldset>
          <legend>Pickup timing</legend>
          <label>Pickup timing<select {...register('pickup.flexibility')}><option value="scheduled">Scheduled</option><option value="flexible">Flexible</option><option value="urgent">Urgent</option></select></label>
          <label>Requested pickup date <span aria-hidden="true">(optional)</span><input type="date" {...register('pickup.date')} /></label>
        </fieldset>
      ) : null}
      {step === 4 ? (
        <fieldset>
          <legend>Contact details</legend>
          <div className="form-grid">
            <label>First name<input autoComplete="given-name" aria-describedby="first-name-error" {...register('contact.firstName')} /></label>
            <label>Last name<input autoComplete="family-name" aria-describedby="last-name-error" {...register('contact.lastName')} /></label>
            <label>Company<input autoComplete="organization" aria-describedby="company-error" {...register('contact.company')} /></label>
            <label>Business email<input autoComplete="email" aria-describedby="email-error" type="email" {...register('contact.email')} /></label>
          </div>
          <label className="checkbox-label"><input aria-describedby="privacy-error" type="checkbox" {...register('consent.privacyAccepted')} />I accept the privacy notice</label>
          {stepError ? <p className="form-error" role="alert">{stepError}</p> : null}
        </fieldset>
      ) : null}
      {step === 5 ? <QuoteReview request={request} /> : null}
      <div className="wizard-actions">
        {step > 1 ? <button onClick={() => { setState('editing'); setStepError(null); setStep((current) => current - 1); }} type="button">Back</button> : null}
        {step < 5 ? <button onClick={advance} type="button">Next</button> : <button disabled={state === 'submitting'} onClick={submit} type="button">{state === 'submitting' ? 'Submitting…' : state === 'error' ? 'Try again' : 'Request Pricing'}</button>}
      </div>
    </section>
  );
}
