import { InternalLink } from '@/components/ui/InternalLink';
import { externalDestinations } from '@/content/destinations';
import { DesktopNavigation } from './DesktopNavigation';
import { MobileNavigation } from './MobileNavigation';
import { LinkOrUnavailable } from '@/components/ui/LinkOrUnavailable';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/features/theme/ThemeToggle';
import { ShipNowLink } from '@/components/ui/ShipNowLink';

export function SiteHeader() {
  return <header className="site-header">
    <InternalLink aria-label="KAG Logistics home" to="/"><Logo /></InternalLink>
    <DesktopNavigation />
    <div className="header-actions">
      <LinkOrUnavailable destination={externalDestinations.customerLogin}>Customer Login</LinkOrUnavailable>
      <ThemeToggle />
      <InternalLink className="button button-primary" to="/quote">Get a Quote</InternalLink>
      <ShipNowLink />
    </div>
    <MobileNavigation />
  </header>;
}
