import { externalDestinations } from '@/content/destinations';

export function ShipNowLink({ className = '', persistent = false }: { className?: string; persistent?: boolean }) {
  const destination = externalDestinations.shipNow;
  if (destination.kind !== 'url') return null;
  return <a aria-label={persistent ? 'Persistent Ship Now' : 'Ship Now'} className={`ship-now ${className}`.trim()} href={destination.href} rel="noreferrer" target="_blank">SHIP NOW <span aria-hidden="true">→</span></a>;
}
