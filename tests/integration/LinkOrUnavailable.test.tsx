import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LinkOrUnavailable } from '@/components/ui/LinkOrUnavailable';

describe('LinkOrUnavailable', () => {
  it('does not render an anchor for an unavailable external destination', () => {
    render(
      <LinkOrUnavailable destination={{ kind: 'unavailable', message: 'Customer Login is not configured for this prototype.' }}>
        Customer Login
      </LinkOrUnavailable>,
    );

    expect(screen.queryByRole('link', { name: 'Customer Login' })).not.toBeInTheDocument();
    expect(screen.getByText('Customer Login is not configured for this prototype.')).toBeInTheDocument();
  });

  it('renders a configured URL as a real link', () => {
    render(<LinkOrUnavailable destination={{ kind: 'url', href: 'https://example.com' }}>Customer Login</LinkOrUnavailable>);

    expect(screen.getByRole('link', { name: 'Customer Login' })).toHaveAttribute('href', 'https://example.com');
  });
});
