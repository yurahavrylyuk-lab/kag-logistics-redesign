import { useRouterState } from '@tanstack/react-router';

export function useCurrentPathname() {
  return useRouterState({ select: (state) => state.location.pathname });
}
