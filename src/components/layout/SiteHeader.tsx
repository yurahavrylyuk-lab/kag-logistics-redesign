import { Link } from '@tanstack/react-router';
import { externalDestinations } from '@/content/destinations';
import { DesktopNavigation } from './DesktopNavigation';
import { MobileNavigation } from './MobileNavigation';
import { LinkOrUnavailable } from '@/components/ui/LinkOrUnavailable';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/features/theme/ThemeToggle';
import { ShipNowLink } from '@/components/ui/ShipNowLink';

export function SiteHeader() {
  return <header className="site-header">
    <div className="header-banner">
      <p className="header-banner-copy">
        <span aria-hidden="true" className="header-live" />
        <span className="header-banner-track">
          <span>Live dispatch · 24/7 North American coverage · Multimodal freight</span>
          <span aria-hidden="true">Live dispatch · 24/7 North American coverage · Multimodal freight</span>
        </span>
      </p>
      <div className="header-banner-tools">
        <LinkOrUnavailable destination={externalDestinations.customerLogin}>Customer Login</LinkOrUnavailable>
        <ThemeToggle />
      </div>
    </div>
    <div className="header-bar">
      <Link aria-label="KAG Logistics home" to="/"><Logo /></Link>
      <DesktopNavigation />
      <div className="header-actions">
        <Link className="button button-primary" to="/quote">Get a Quote</Link>
        <ShipNowLink />
      </div>
      <MobileNavigation />
    </div>
    <div aria-hidden="true" className="header-route" />
  </header>;
}
