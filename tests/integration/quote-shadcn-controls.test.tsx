import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { QuoteWizard } from '@/features/quote/QuoteWizard';
import { buildQuoteMailto, createMailtoQuoteSubmissionService } from '@/features/quote/mailto-service';
import type { QuoteRequest, QuoteSubmissionResult } from '@/features/quote/types';

const validRequest: QuoteRequest = {
  freightType: 'Dry Van',
  origin: { city: 'Toronto', region: 'ON', country: 'CA' },
  destination: { city: 'Cleveland', region: 'OH', country: 'US' },
  pickup: { flexibility: 'scheduled' },
  contact: { firstName: 'Taylor', lastName: 'Smith', company: 'Acme', email: 'taylor@example.com' },
  consent: { privacyAccepted: true },
  source: { page: '/' },
};

async function completeRequest(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Dry Van' }));
  await user.click(screen.getByRole('button', { name: 'Next' }));
  await user.type(screen.getByLabelText('Origin city'), 'Toronto');
  await user.type(screen.getByLabelText('Origin state or province'), 'ON');
  await user.type(screen.getByLabelText('Destination city'), 'Cleveland');
  await user.type(screen.getByLabelText('Destination state or province'), 'OH');
  await user.click(screen.getByRole('button', { name: 'Next' }));
  expect(screen.getByText('Step 3 of 4')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Next' }));
  expect(screen.getByText('Step 4 of 4')).toBeInTheDocument();
  await user.type(screen.getByLabelText('First name'), 'Taylor');
  await user.type(screen.getByLabelText('Last name'), 'Smith');
  await user.type(screen.getByLabelText('Company'), 'Acme');
  await user.type(screen.getByLabelText('Business email'), 'taylor@example.com');
  await user.click(screen.getByRole('checkbox'));
  await user.click(screen.getByRole('button', { name: 'Next' }));
}

describe('shadcn quote controls', () => {
  it('keeps a validation error associated with the focused shadcn input', async () => {
    const user = userEvent.setup();
    render(<QuoteWizard />);
    await user.click(screen.getByRole('button', { name: 'Dry Van' }));
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await user.click(screen.getByRole('button', { name: 'Next' }));
    const input = screen.getByLabelText('Origin city');
    expect(input).toHaveAttribute('data-slot', 'input');
    expect(input).toHaveFocus();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'route-help origin-city-error');
    expect(input).toHaveAccessibleDescription(/Enter an origin city/);
    expect(screen.getByText('Enter an origin city.')).toHaveAttribute('data-slot', 'field-error');
  });

  it('presents named country selects with the existing defaults', async () => {
    const user = userEvent.setup();
    render(<QuoteWizard />);
    await user.click(screen.getByRole('button', { name: 'Dry Van' }));
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByRole('combobox', { name: 'Origin country' })).toHaveAttribute('data-slot', 'select-trigger');
    expect(screen.getByRole('combobox', { name: 'Origin country' })).toHaveTextContent('United States');
    expect(screen.getByRole('combobox', { name: 'Destination country' })).toHaveTextContent('United States');
  });

  it('keeps route error layout stable on blur until Next validates the corrected fields', async () => {
    const user = userEvent.setup();
    render(<QuoteWizard />);
    await user.click(screen.getByRole('button', { name: 'Dry Van' }));
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await user.type(screen.getByLabelText('Origin city'), 'Cleveland');
    await user.type(screen.getByLabelText('Origin state or province'), 'OH');
    await user.type(screen.getByLabelText('Destination city'), 'Columbus');
    await user.type(screen.getByLabelText('Destination state or province'), 'OH');
    await user.tab();
    expect(screen.getByText('Enter a destination state or province.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('Step 3 of 4')).toBeInTheDocument();
  });

  it('retains the complete review while preparing and allows a new request after success', async () => {
    const user = userEvent.setup();
    let finish!: (result: QuoteSubmissionResult) => void;
    render(<QuoteWizard service={{ submit: () => new Promise((resolve) => { finish = resolve; }) }} />);
    await completeRequest(user);
    expect(screen.getByRole('heading', { name: 'Review & Submit' })).toBeInTheDocument();
    expect(screen.queryByText(/Step 5/)).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Request Pricing' }));
    const preparing = screen.getByRole('button', { name: 'Preparing…' });
    expect(preparing).toHaveAttribute('data-slot', 'button');
    expect(preparing).toBeDisabled();
    expect(screen.getByText('Dry Van')).toBeInTheDocument();
    await act(async () => { finish({ ok: true, referenceId: 'EMAIL-DRAFT' }); });
    await user.click(screen.getByRole('button', { name: 'Start another request' }));
    expect(screen.getByText('Step 1 of 4')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dry Van' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('still produces and opens a mailto request for the fixed recipient', async () => {
    expect(buildQuoteMailto(validRequest)).toMatch(/^mailto:delta\.qoralis@gmail\.com\?/);
    let opened = '';
    const service = createMailtoQuoteSubmissionService((href) => { opened = href; });
    expect(await service.submit(validRequest)).toEqual({ ok: true, referenceId: 'EMAIL-DRAFT' });
    expect(opened).toMatch(/^mailto:delta\.qoralis@gmail\.com\?/);
    expect(decodeURIComponent(opened)).toContain('Contact: Taylor Smith');
  });
});
