import { Link } from '@tanstack/react-router';
import type { ComponentProps } from 'react';

type RouterLinkProps = ComponentProps<typeof Link>;
type InternalLinkProps = Omit<RouterLinkProps, 'to'> & { to: string };

export function InternalLink({ to, ...props }: InternalLinkProps) {
  // Task 5 registers the public routes. Remove this temporary type escape when
  // that route tree exists; runtime navigation already uses TanStack Link.
  return <Link {...props} to={to as RouterLinkProps['to']} />;
}
