import Link from 'next/link';
import { primaryNavigation } from '@/content/navigation';

export function DesktopNavigation() {
  return <nav aria-label="Primary navigation" className="desktop-nav">
    {primaryNavigation.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
  </nav>;
}
