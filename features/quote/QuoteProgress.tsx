export function QuoteProgress({ step }: { step: number }) { return step <= 4 ? <p aria-live="polite">Step {step} of 4</p> : <p>Review &amp; Submit</p>; }
