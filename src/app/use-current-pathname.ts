import { useRouterState } from '@tanstack/react-router';

export function useCurrentPathname() {
  return useRouterState({
    // Keep shell behavior on the displayed page until the destination tree has
    // rendered, including when a loader first presents a pending fallback.
    select: (state) => state.resolvedLocation?.pathname ?? state.location.pathname,
  });
}
