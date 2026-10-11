import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SolutionsPage from '@/app/solutions/page';
import IndustriesPage from '@/app/industries/page';
import ResourcesPage from '@/app/resources/page';

describe('category index pages', () => {
  it('gives primary navigation labels a focused representative index', () => {
    const { unmount } = render(<SolutionsPage />);
    expect(screen.getByRole('heading', { name: 'Solutions' })).toBeInTheDocument();
    unmount();
    render(<IndustriesPage />);
    expect(screen.getByRole('heading', { name: 'Industries' })).toBeInTheDocument();
    unmount();
    render(<ResourcesPage />);
    expect(screen.getByRole('heading', { name: 'Resources' })).toBeInTheDocument();
  });
});
