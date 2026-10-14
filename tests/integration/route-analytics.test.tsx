import { act, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useCurrentPathname } from '@/app/use-current-pathname';
import { RouteAnalytics } from '@/features/analytics/RouteAnalytics';
import { noopAnalyticsAdapter } from '@/features/analytics/noop-adapter';
import { renderWithRouter } from '../test-router';

function CurrentPathname() {
  return <output>{useCurrentPathname()}</output>;
}

describe('router-aware analytics', () => {
  it('selects the pathname and tracks again after real router navigation', async () => {
    const send = vi.spyOn(noopAnalyticsAdapter, 'track');
    const properties = { solutionId: 'bulk', email: 'private@example.com' };
    const { router } = renderWithRouter(<><CurrentPathname /><RouteAnalytics event="solution_viewed" properties={properties} /></>);
    await screen.findByText('/');
    await waitFor(() => expect(send).toHaveBeenCalledWith({ name: 'solution_viewed', properties: { solutionId: 'bulk' } }));
    expect(send).toHaveBeenCalledTimes(1);

    await act(async () => { router.history.push('/about?view=overview'); });
    await screen.findByText('/about');
    await waitFor(() => expect(send).toHaveBeenCalledTimes(2));

    await act(async () => { router.history.push('/about?view=details'); });
    expect(send).toHaveBeenCalledTimes(2);
  });
});
