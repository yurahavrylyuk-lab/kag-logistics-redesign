'use client';
import { useEffect, useState } from 'react';
import { ShipNowLink } from '@/components/ui/ShipNowLink';
export function FloatingShipNow() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const target = document.getElementById('hero') ?? document.getElementById('floating-cta-top-sentinel');
    if (!target || !('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting));
    observer.observe(target);
    return () => observer.disconnect();
  }, []);
  return <div className="floating-ship-now" data-visible={visible}><ShipNowLink persistent /></div>;
}
