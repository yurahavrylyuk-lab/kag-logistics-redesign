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
    <span className="unavailable-action" role="status">
      <span>{children}</span>
      <span className="unavailable-message">{destination.message}</span>
    </span>
  );
}
