'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { primaryNavigation } from '@/content/navigation';

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) triggerRef.current?.focus();
  }, [isOpen]);

  return <div className="mobile-nav">
    <button aria-controls="mobile-navigation" aria-expanded={isOpen} aria-label="Open navigation" onClick={() => setIsOpen(true)} ref={triggerRef} type="button">Menu</button>
    {isOpen ? <div aria-label="Navigation menu" className="mobile-drawer" id="mobile-navigation" role="dialog">
      <nav aria-label="Mobile navigation">
        {primaryNavigation.map((item) => <Link href={item.href} key={item.href} onClick={() => setIsOpen(false)}>{item.label}</Link>)}
        <Link href="/quote" onClick={() => setIsOpen(false)}>Get a Quote</Link>
      </nav>
    </div> : null}
  </div>;
}
