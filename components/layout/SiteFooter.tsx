import Link from 'next/link';
import { contact } from '@/content/contact';
import { primaryNavigation } from '@/content/navigation';
import { Logo } from '@/components/ui/Logo';

export function SiteFooter() {
  return <footer className="site-footer">
    <Logo />
    <nav aria-label="Footer navigation">{primaryNavigation.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}</nav>
    <address>{contact.address.map((line) => <span key={line}>{line}<br /></span>)}<a href={contact.phoneHref}>{contact.phoneDisplay}</a></address>
    <p>{contact.securityNotice}</p>
  </footer>;
}
