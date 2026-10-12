import Link from 'next/link';
import { externalDestinations } from '@/content/destinations';
import { DesktopNavigation } from './DesktopNavigation';
import { MobileNavigation } from './MobileNavigation';
import { LinkOrUnavailable } from '@/components/ui/LinkOrUnavailable';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/features/theme/ThemeToggle';
import { ShipNowLink } from '@/components/ui/ShipNowLink';

export function SiteHeader() {
  return <header className="site-header">
    <Link aria-label="KAG Logistics home" href="/"><Logo /></Link>
    <DesktopNavigation />
    <div className="header-actions">
      <LinkOrUnavailable destination={externalDestinations.customerLogin}>Customer Login</LinkOrUnavailable>
      <ThemeToggle />
      <Link className="button button-primary" href="/quote">Get a Quote</Link>
      <ShipNowLink />
    </div>
    <MobileNavigation />
  </header>;
}
