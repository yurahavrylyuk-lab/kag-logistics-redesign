import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { QuoteWizard } from '@/features/quote/QuoteWizard';
import { createMockQuoteSubmissionService } from '@/features/quote/mock-service';

// Radix scrolls focused options into view; jsdom has no layout/scrolling API.
const scrollIntoView = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollIntoView');
beforeAll(() => Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { configurable: true, value: () => undefined }));
afterAll(() => {
  if (scrollIntoView) Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', scrollIntoView);
  else Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView');
});

describe('QuoteWizard', () => {
  it('uses four numbered data-entry steps before an unnumbered review state', async () => {
    const user = userEvent.setup();
    render(<QuoteWizard />);
    expect(screen.getByText('Step 1 of 4')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Dry Van' }));
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('Step 2 of 4')).toBeInTheDocument();
  });

  it('shows field-specific validation before advancing', async () => {
    const user = userEvent.setup();
    render(<QuoteWizard />);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Select a freight type.');
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  it('uses a native form and associates a route validation error with its invalid field', async () => {
    const user = userEvent.setup();
    render(<QuoteWizard />);

    expect(screen.getByRole('form', { name: 'Request pricing' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Dry Van' }));
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await user.click(screen.getByRole('button', { name: 'Next' }));

    const originCity = screen.getByLabelText('Origin city');
    expect(originCity).toHaveAttribute('aria-invalid', 'true');
    expect(originCity).toHaveAttribute('aria-describedby', expect.stringContaining('origin-city-error'));
    expect(screen.getByText('Enter an origin city.')).toHaveAttribute('id', 'origin-city-error');
    expect(originCity).toHaveFocus();
  });

  it('captures the complete route and contact contract and presents it in review', async () => {
    const user = userEvent.setup();
    render(<QuoteWizard />);
    await user.click(screen.getByRole('button', { name: 'Dry Van' }));
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await user.type(screen.getByLabelText('Origin city'), 'Toronto');
    await user.type(screen.getByLabelText('Origin state or province'), 'ON');
    await user.type(screen.getByLabelText('Origin postal code'), 'M5V 1E3');
    screen.getByRole('combobox', { name: 'Origin country' }).focus();
    await user.keyboard('{Enter}');
    await user.keyboard('{End}{Enter}');
    expect(screen.getByRole('combobox', { name: 'Origin country' })).toHaveTextContent('Canada');
    await user.type(screen.getByLabelText('Destination city'), 'Cleveland');
    await user.type(screen.getByLabelText('Destination state or province'), 'OH');
    await user.type(screen.getByLabelText('Destination postal code'), '44114');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByRole('combobox', { name: 'Pickup timing' })).toHaveTextContent('Scheduled');
    screen.getByRole('combobox', { name: 'Pickup timing' }).focus();
    await user.keyboard('{Enter}{End}{Enter}');
    expect(screen.getByRole('combobox', { name: 'Pickup timing' })).toHaveTextContent('Urgent');
    await user.type(screen.getByLabelText(/Requested pickup date/), '2026-10-20');
    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByRole('combobox', { name: 'Origin country' })).toHaveTextContent('Canada');
    expect(screen.getByLabelText('Origin city')).toHaveValue('Toronto');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByRole('combobox', { name: 'Pickup timing' })).toHaveTextContent('Urgent');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await user.type(screen.getByLabelText('First name'), 'Taylor');
    await user.type(screen.getByLabelText('Last name'), 'Smith');
    await user.type(screen.getByLabelText('Company'), 'Acme');
    await user.type(screen.getByLabelText('Business email'), 'taylor@example.com');
    await user.type(screen.getByLabelText(/Business phone/), '555-0100');
    await user.type(screen.getByLabelText(/Shipment notes/), 'Dock appointment preferred.');
    await user.click(screen.getByRole('checkbox', { name: /prepare this quote request/i }));
    await user.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByText('Toronto, ON, M5V 1E3, Canada')).toBeInTheDocument();
    expect(screen.getByText('urgent — 2026-10-20')).toBeInTheDocument();
    expect(screen.getByText('555-0100')).toBeInTheDocument();
    expect(screen.getByText('Dock appointment preferred.')).toBeInTheDocument();
  });

  it('preserves entered freight after a recoverable submission error', async () => {
    const user = userEvent.setup();
    render(<QuoteWizard service={createMockQuoteSubmissionService('server')} />);
    await user.click(screen.getByRole('button', { name: 'Dry Van' }));
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await user.type(screen.getByLabelText('Origin city'), 'Cleveland');
    await user.type(screen.getByLabelText('Origin state or province'), 'OH');
    await user.type(screen.getByLabelText('Destination city'), 'Columbus');
    await user.type(screen.getByLabelText('Destination state or province'), 'OH');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await user.type(screen.getByLabelText('First name'), 'Taylor');
    await user.type(screen.getByLabelText('Last name'), 'Smith');
    await user.type(screen.getByLabelText('Company'), 'Acme');
    await user.type(screen.getByLabelText('Business email'), 'taylor@example.com');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await user.click(screen.getByRole('button', { name: 'Request Pricing' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Please try again.');
    expect(screen.getByText('Dry Van')).toBeInTheDocument();
  });

  it('shows accurate confirmation after preparing a quote email', async () => {
    const user = userEvent.setup();
    render(<QuoteWizard service={createMockQuoteSubmissionService()} />);
    await user.click(screen.getByRole('button', { name: 'Dry Van' }));
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await user.type(screen.getByLabelText('Origin city'), 'Cleveland');
    await user.type(screen.getByLabelText('Origin state or province'), 'OH');
    await user.type(screen.getByLabelText('Destination city'), 'Columbus');
    await user.type(screen.getByLabelText('Destination state or province'), 'OH');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await user.type(screen.getByLabelText('First name'), 'Taylor');
    await user.type(screen.getByLabelText('Last name'), 'Smith');
    await user.type(screen.getByLabelText('Company'), 'Acme');
    await user.type(screen.getByLabelText('Business email'), 'taylor@example.com');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await user.click(screen.getByRole('button', { name: 'Request Pricing' }));
    expect(await screen.findByRole('heading', { name: 'Your quote email is ready to send' })).toBeInTheDocument();
    expect(screen.getByText(/send it from your email client to complete the request/i)).toBeInTheDocument();
  });

  it('maps a rejected service promise to a recoverable retry state', async () => {
    const user = userEvent.setup();
    const service = { submit: async () => { throw new Error('offline'); } };
    render(<QuoteWizard service={service} />);
    await user.click(screen.getByRole('button', { name: 'Dry Van' }));
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await user.type(screen.getByLabelText('Origin city'), 'Cleveland');
    await user.type(screen.getByLabelText('Origin state or province'), 'OH');
    await user.type(screen.getByLabelText('Destination city'), 'Columbus');
    await user.type(screen.getByLabelText('Destination state or province'), 'OH');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await user.type(screen.getByLabelText('First name'), 'Taylor');
    await user.type(screen.getByLabelText('Last name'), 'Smith');
    await user.type(screen.getByLabelText('Company'), 'Acme');
    await user.type(screen.getByLabelText('Business email'), 'taylor@example.com');
    await user.click(screen.getByRole('checkbox', { name: /prepare this quote request/i }));
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await user.click(screen.getByRole('button', { name: 'Request Pricing' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('network problem');
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });
});
