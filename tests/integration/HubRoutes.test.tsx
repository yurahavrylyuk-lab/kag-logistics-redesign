import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CarriersPage from '@/app/carriers/page';
import CareersPage from '@/app/careers/page';
import TechnologyPage from '@/app/technology/page';

describe('focused KAG hub routes', () => {
  it('renders a Technology hub with an illustrative-data disclosure', () => {
    render(<TechnologyPage />);
    expect(screen.getByRole('heading', { name: /operational control/i })).toBeInTheDocument();
    expect(screen.getByText(/illustrative data.*not connected to live KAG systems/i)).toBeInTheDocument();
  });

  it('exposes accessible Carriers and Careers primary routes', () => {
    const { unmount } = render(<CarriersPage />);
    expect(screen.getByRole('heading', { name: /move with a network/i })).toBeInTheDocument();
    expect(screen.getByText(/carrier registration is not configured/i)).toBeInTheDocument();
    unmount();
    render(<CareersPage />);
    expect(screen.getByRole('heading', { name: /build what moves industry/i })).toBeInTheDocument();
    expect(screen.getByText(/job-search destination is not configured/i)).toBeInTheDocument();
  });
});
