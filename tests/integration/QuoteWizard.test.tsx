import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { QuoteWizard } from '@/features/quote/QuoteWizard';
import { createMockQuoteSubmissionService } from '@/features/quote/mock-service';

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

  it('shows confirmation after a valid mock submission', async () => {
    const user = userEvent.setup();
    render(<QuoteWizard />);
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
    expect(await screen.findByRole('heading', { name: 'Request received' })).toBeInTheDocument();
  });
});
