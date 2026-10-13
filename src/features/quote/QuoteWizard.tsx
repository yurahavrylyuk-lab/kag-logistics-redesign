import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Controller, type Control, type DeepPartial, type FieldPath, useForm, useWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuoteProgress } from './QuoteProgress';
import { QuoteReview } from './QuoteReview';
import { quoteSchema } from './schema';
import { createPrototypeQuoteSubmissionService, type QuoteSubmissionService } from './service';
import type { QuoteRequest } from './types';
import { track } from '@/features/analytics/track';

const defaults: QuoteRequest = {
  freightType: '',
  origin: { city: '', region: '', postalCode: '', country: 'US' },
  destination: { city: '', region: '', postalCode: '', country: 'US' },
  pickup: { flexibility: 'scheduled' },
  contact: { firstName: '', lastName: '', company: '', email: '', phone: '' },
  notes: '',
  consent: { privacyAccepted: false },
  source: { page: '/' },
};

const fieldsByStep: Record<number, FieldPath<QuoteRequest>[]> = {
  1: ['freightType'],
  2: ['origin.city', 'origin.region', 'origin.postalCode', 'origin.country', 'destination.city', 'destination.region', 'destination.postalCode', 'destination.country'],
  3: ['pickup.flexibility'],
  4: ['contact.firstName', 'contact.lastName', 'contact.company', 'contact.email', 'contact.phone', 'notes', 'consent.privacyAccepted'],
};

function mergeWithDefaults(value: DeepPartial<QuoteRequest>): QuoteRequest {
  return { ...defaults, ...value, origin: { ...defaults.origin, ...value.origin }, destination: { ...defaults.destination, ...value.destination }, pickup: { ...defaults.pickup, ...value.pickup }, contact: { ...defaults.contact, ...value.contact }, consent: { ...defaults.consent, ...value.consent }, source: { ...defaults.source, ...value.source } };
}

function errorId(path: string) { return `${path.replaceAll('.', '-')}-error`; }

export function QuoteWizard({ service }: { service?: QuoteSubmissionService }) {
  const submissionService = useMemo(() => service ?? createPrototypeQuoteSubmissionService(), [service]);
  // Zod validates each step on Next. Keep its errors stable through blur so the
  // submit button cannot move between pointer down and pointer up.
  const { control, getFieldState, getValues, register, reset, setError, setFocus, setValue, clearErrors, formState: { errors } } = useForm<QuoteRequest>({ defaultValues: defaults, mode: 'onSubmit' });
  const [step, setStep] = useState(1);
  const [state, setState] = useState<'editing' | 'submitting' | 'success' | 'error'>('editing');
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const startedAt = useRef<number | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const priorStep = useRef(step);
  const request = mergeWithDefaults(useWatch({ control }));

  useEffect(() => {
    if (priorStep.current !== step) headingRef.current?.focus();
    priorStep.current = step;
  }, [step]);

  const fieldError = (path: FieldPath<QuoteRequest>) => getFieldState(path).error?.message;
  const descriptor = (path: FieldPath<QuoteRequest>, help?: string) => [help, fieldError(path) ? errorId(path) : undefined].filter(Boolean).join(' ') || undefined;

  const startQuote = (freightType: string) => {
    setValue('freightType', freightType, { shouldTouch: true });
    if (!started) {
      setStarted(true);
      startedAt.current = Date.now();
      track('quote_started', { source: 'quote-wizard', entryPoint: 'quote-wizard', freightType });
    }
  };

  const validateStep = (currentStep: number) => {
    const parsed = quoteSchema.safeParse(getValues());
    const fields = fieldsByStep[currentStep];
    clearErrors(fields);
    if (parsed.success) return true;
    const issues = parsed.error.issues.filter((issue) => fields.includes(issue.path.join('.') as FieldPath<QuoteRequest>));
    issues.forEach((issue) => setError(issue.path.join('.') as FieldPath<QuoteRequest>, { type: 'validation', message: issue.message }));
    const first = issues[0];
    if (first) setFocus(first.path.join('.') as FieldPath<QuoteRequest>);
    return !first;
  };

  const submitRequest = async () => {
    const parsed = quoteSchema.safeParse(getValues());
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      const firstStep = Object.entries(fieldsByStep).find(([, fields]) => fields.includes(first.path.join('.') as FieldPath<QuoteRequest>));
      setStep(Number(firstStep?.[0] ?? 4));
      setError(first.path.join('.') as FieldPath<QuoteRequest>, { type: 'validation', message: first.message });
      return;
    }
    setState('submitting');
    setSubmissionError(null);
    try {
      const result = await submissionService.submit(parsed.data);
      if (result.ok) {
        track('quote_submitted', { source: 'quote-wizard', referenceId: result.referenceId });
        setState('success');
        return;
      }
      Object.entries(result.fieldErrors ?? {}).forEach(([path, message]) => setError(path as FieldPath<QuoteRequest>, { type: 'server', message }));
      setSubmissionError(result.message);
      track('quote_failed', { step, failureKind: result.kind });
      setState('error');
    } catch {
      setSubmissionError('A network problem prevented your quote email from being prepared. Please try again.');
      track('quote_failed', { step, failureKind: 'network' });
      setState('error');
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state === 'submitting') return;
    if (step < 5) {
      if (!validateStep(step)) return;
      track('quote_step_completed', { step, elapsedMs: Date.now() - (startedAt.current ?? Date.now()), validationErrorCount: Object.keys(errors).length });
      setState('editing');
      setStep((current) => current + 1);
      return;
    }
    await submitRequest();
  };

  if (state === 'success') return <section aria-live="polite" className="quote-result"><h2>Your quote email is ready to send</h2><p>Please send it from your email client to complete the request.</p><Button onClick={() => { reset(defaults); setStarted(false); setState('editing'); setStep(1); }} type="button">Start another request</Button></section>;

  return <form aria-labelledby="quote-wizard-heading" className="quote-wizard" noValidate onSubmit={handleSubmit}>
    <h2 className="sr-only" id="quote-wizard-heading">Request pricing</h2>
    {step < 5 ? <QuoteProgress step={step} /> : null}
    <div aria-live="assertive">{state === 'error' && submissionError ? <FieldError>{submissionError} Your details have been retained.</FieldError> : null}</div>
    <h3 className="sr-only" ref={headingRef} tabIndex={-1}>{step === 5 ? 'Review and submit' : `Quote step ${step}`}</h3>
    {step === 1 ? <FreightStep descriptor={descriptor} error={fieldError('freightType')} onSelect={startQuote} request={request} /> : null}
    {step === 2 ? <RouteStep control={control} descriptor={descriptor} error={fieldError} register={register} /> : null}
    {step === 3 ? <fieldset><legend>Pickup timing</legend><QuoteSelect control={control} name="pickup.flexibility" label="Pickup timing" options={timingOptions} /><Field><FieldLabel htmlFor="pickup-date">Requested pickup date <span aria-hidden="true">(optional)</span></FieldLabel><Input id="pickup-date" type="date" {...register('pickup.date')} /></Field></fieldset> : null}
    {step === 4 ? <ContactStep descriptor={descriptor} error={fieldError} register={register} /> : null}
    {step === 5 ? <QuoteReview request={request} /> : null}
    <div className="wizard-actions">{step > 1 ? <Button variant="outline" onClick={() => { setState('editing'); setSubmissionError(null); setStep((current) => current - 1); }} type="button">Back</Button> : null}<Button disabled={state === 'submitting'} type="submit">{step < 5 ? 'Next' : state === 'submitting' ? 'Preparing…' : state === 'error' ? 'Try again' : 'Request Pricing'}</Button></div>
  </form>;
}

type Descriptor = (path: FieldPath<QuoteRequest>, help?: string) => string | undefined;
type ErrorFor = (path: FieldPath<QuoteRequest>) => string | undefined;
type Register = ReturnType<typeof useForm<QuoteRequest>>['register'];

function FreightStep({ descriptor, error, onSelect, request }: { descriptor: Descriptor; error?: string; onSelect: (freightType: string) => void; request: QuoteRequest }) {
  return <fieldset><legend>What are you shipping?</legend><FieldDescription id="freight-help">Choose the equipment or service that most closely fits this shipment.</FieldDescription><div aria-describedby={descriptor('freightType', 'freight-help')} className="freight-options" role="group">{['Liquid Bulk', 'Dry Bulk', 'Dry Van', 'Refrigerated', 'Flatbed', 'Container', 'Expedited', 'Other / Not Sure'].map((type) => <Button variant="outline" aria-pressed={request.freightType === type} key={type} onClick={() => onSelect(type)} type="button">{type}</Button>)}</div>{error ? <FieldError id={errorId('freightType')}>{error}</FieldError> : null}</fieldset>;
}

const countryOptions = [{ value: 'US', label: 'United States' }, { value: 'CA', label: 'Canada' }];
const timingOptions = [{ value: 'scheduled', label: 'Scheduled' }, { value: 'flexible', label: 'Flexible' }, { value: 'urgent', label: 'Urgent' }];

function QuoteSelect({ control, name, label, options }: { control: Control<QuoteRequest>; name: 'origin.country' | 'destination.country' | 'pickup.flexibility'; label: string; options: { value: string; label: string }[] }) {
  const id = name.replaceAll('.', '-');
  return <Controller control={control} name={name} render={({ field }) => <Field><FieldLabel htmlFor={id}>{label}</FieldLabel><Select name={field.name} value={field.value} onValueChange={field.onChange}><SelectTrigger id={id} ref={field.ref} onBlur={field.onBlur}><SelectValue /></SelectTrigger><SelectContent>{options.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select></Field>} />;
}

function RouteStep({ control, descriptor, error, register }: { control: Control<QuoteRequest>; descriptor: Descriptor; error: ErrorFor; register: Register }) {
  const textField = (label: string, path: 'origin.city' | 'origin.region' | 'destination.city' | 'destination.region', autoComplete: string) => {
    const id = path.replaceAll('.', '-');
    return <Field><FieldLabel htmlFor={id}>{label}</FieldLabel><Input id={id} aria-describedby={descriptor(path, path.endsWith('.city') ? 'route-help' : undefined)} aria-invalid={Boolean(error(path))} autoComplete={autoComplete} required {...register(path)} />{error(path) ? <FieldError id={errorId(path)}>{error(path)}</FieldError> : null}</Field>;
  };
  return <fieldset><legend>Origin and destination</legend><FieldDescription id="route-help">Use city, state or province, and country. Postal codes help refine the request.</FieldDescription><FieldGroup className="form-grid">{textField('Origin city', 'origin.city', 'address-level2')}{textField('Origin state or province', 'origin.region', 'address-level1')}<Field><FieldLabel htmlFor="origin-postalCode">Origin postal code</FieldLabel><Input id="origin-postalCode" autoComplete="postal-code" {...register('origin.postalCode')} /></Field><QuoteSelect control={control} name="origin.country" label="Origin country" options={countryOptions} />{textField('Destination city', 'destination.city', 'address-level2')}{textField('Destination state or province', 'destination.region', 'address-level1')}<Field><FieldLabel htmlFor="destination-postalCode">Destination postal code</FieldLabel><Input id="destination-postalCode" autoComplete="postal-code" {...register('destination.postalCode')} /></Field><QuoteSelect control={control} name="destination.country" label="Destination country" options={countryOptions} /></FieldGroup></fieldset>;
}

function ContactStep({ descriptor, error, register }: { descriptor: Descriptor; error: ErrorFor; register: Register }) {
  const textField = (label: string, path: 'contact.firstName' | 'contact.lastName' | 'contact.company' | 'contact.email', autoComplete: string, type?: 'email') => {
    const id = path.replaceAll('.', '-');
    return <Field><FieldLabel htmlFor={id}>{label}</FieldLabel><Input id={id} aria-describedby={descriptor(path)} aria-invalid={Boolean(error(path))} autoComplete={autoComplete} required type={type} {...register(path)} />{error(path) ? <FieldError id={errorId(path)}>{error(path)}</FieldError> : null}</Field>;
  };
  return <fieldset><legend>Contact details</legend><FieldGroup className="form-grid">{textField('First name', 'contact.firstName', 'given-name')}{textField('Last name', 'contact.lastName', 'family-name')}{textField('Company', 'contact.company', 'organization')}{textField('Business email', 'contact.email', 'email', 'email')}<Field><FieldLabel htmlFor="contact-phone">Business phone <span aria-hidden="true">(optional)</span></FieldLabel><Input id="contact-phone" autoComplete="tel" {...register('contact.phone')} /></Field><Field><FieldLabel htmlFor="notes">Shipment notes <span aria-hidden="true">(optional)</span></FieldLabel><Textarea id="notes" {...register('notes')} /></Field></FieldGroup><Field><FieldLabel className="checkbox-label" htmlFor="consent-privacyAccepted"><Input id="consent-privacyAccepted" aria-describedby={descriptor('consent.privacyAccepted')} aria-invalid={Boolean(error('consent.privacyAccepted'))} required type="checkbox" {...register('consent.privacyAccepted')} />I agree to prepare this quote request in my email client for sending.</FieldLabel>{error('consent.privacyAccepted') ? <FieldError id={errorId('consent.privacyAccepted')}>{error('consent.privacyAccepted')}</FieldError> : null}</Field></fieldset>;
}
