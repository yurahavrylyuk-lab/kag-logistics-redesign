import { Link } from '@tanstack/react-router';
import { contact } from '@/content/contact';
import { footerNavigation } from '@/content/navigation';
import { Logo } from '@/components/ui/Logo';

export function SiteFooter() {
  return <footer className="site-footer" data-floating-cta-suppress>
    <Logo />
    <nav aria-label="Footer navigation">{footerNavigation.map((item) => <Link to={item.href} key={item.href}>{item.label}</Link>)}</nav>
    <address>{contact.address.map((line) => <span key={line}>{line}<br /></span>)}<a href={contact.phoneHref}>{contact.phoneDisplay}</a></address>
    <p>{contact.securityNotice}</p>
  </footer>;
}
