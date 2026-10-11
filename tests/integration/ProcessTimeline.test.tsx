import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProcessTimeline } from '@/components/sections/ProcessTimeline';

describe('ProcessTimeline', () => {
  it('uses ordered-list semantics for the five-step KAG operating model', () => {
    render(<ProcessTimeline />);

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getByRole('listitem', { name: /01 Understand/i })).toBeInTheDocument();
    expect(screen.getByRole('listitem', { name: /05 Optimize/i })).toBeInTheDocument();
  });
});
