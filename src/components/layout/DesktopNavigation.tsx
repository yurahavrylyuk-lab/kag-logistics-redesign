import { InternalLink } from '@/components/ui/InternalLink';
import { primaryNavigation } from '@/content/navigation';

export function DesktopNavigation() {
  return <nav aria-label="Primary navigation" className="desktop-nav">
    {primaryNavigation.map((item) => <InternalLink to={item.href} key={item.href}>{item.label}</InternalLink>)}
  </nav>;
}
