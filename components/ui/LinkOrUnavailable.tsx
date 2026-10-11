import type { ReactNode } from 'react';
import type { ExternalDestination } from '@/content/destinations';

type LinkOrUnavailableProps = {
  children: ReactNode;
  destination: ExternalDestination;
};

export function LinkOrUnavailable({ children, destination }: LinkOrUnavailableProps) {
  if (destination.kind === 'url') {
    return <a href={destination.href}>{children}</a>;
  }

  return (
    <span aria-label={destination.message} role="status">
      <span aria-hidden="true">{children}</span>
      <span className="sr-only">{destination.message}</span>
    </span>
  );
}
