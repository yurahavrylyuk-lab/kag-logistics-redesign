import { Link } from '@tanstack/react-router';
import { primaryNavigation } from '@/content/navigation';

export function DesktopNavigation() {
  return <nav aria-label="Primary navigation" className="desktop-nav">
    {primaryNavigation.map((item) => (
      <Link activeOptions={{ exact: false }} activeProps={{ className: 'is-active' }} key={item.href} to={item.href}>{item.label}</Link>
    ))}
  </nav>;
}
