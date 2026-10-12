'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { primaryNavigation } from '@/content/navigation';
import { ThemeToggle } from '@/features/theme/ThemeToggle';
import { ShipNowLink } from '@/components/ui/ShipNowLink';

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return undefined;
    wasOpenRef.current = true;
    const firstFocusable = drawerRef.current?.querySelector<HTMLElement>('button, a, select');
    firstFocusable?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen && wasOpenRef.current) triggerRef.current?.focus();
  }, [isOpen]);

  const trapFocus = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return;
    const focusable = [...(drawerRef.current?.querySelectorAll<HTMLElement>('button, a, select') ?? [])];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return <div className="mobile-nav">
    <ShipNowLink className="mobile-header-ship-now" />
    <button aria-controls="mobile-navigation" aria-expanded={isOpen} aria-label="Open navigation" onClick={() => setIsOpen(true)} ref={triggerRef} type="button">Menu</button>
    {isOpen ? <div aria-label="Navigation menu" aria-modal="true" className="mobile-drawer" id="mobile-navigation" onKeyDown={trapFocus} ref={drawerRef} role="dialog">
      <button aria-label="Close navigation" onClick={() => setIsOpen(false)} type="button">Close</button>
      <nav aria-label="Mobile navigation">
        {primaryNavigation.map((item) => <Link href={item.href} key={item.href} onClick={() => setIsOpen(false)}>{item.label}</Link>)}
        <Link href="/quote" onClick={() => setIsOpen(false)}>Get a Quote</Link>
        <ShipNowLink />
      </nav>
      <ThemeToggle />
    </div> : null}
  </div>;
}
