'use client';

import { useEffect, useState } from 'react';
import { ShipNowLink } from '@/components/ui/ShipNowLink';

export function FloatingShipNow() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById('hero') ?? document.getElementById('floating-cta-top-sentinel');
    if (!target || !('IntersectionObserver' in window)) return undefined;

    let pastTop = false;
    let focusedSuppression = false;
    const activeSuppressions = new Set<Element>();
    const update = () => setVisible(pastTop && activeSuppressions.size === 0 && !focusedSuppression);
    const topObserver = new IntersectionObserver(([entry]) => {
      pastTop = !entry.isIntersecting;
      update();
    });
    const suppressionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting ? activeSuppressions.add(entry.target) : activeSuppressions.delete(entry.target));
      update();
    });
    const isInSuppressionRegion = (node: EventTarget | null) => node instanceof Element && Boolean(node.closest('[data-floating-cta-suppress]'));
    const onFocusIn = (event: FocusEvent) => {
      focusedSuppression = isInSuppressionRegion(event.target);
      update();
    };
    const onFocusOut = () => queueMicrotask(() => {
      focusedSuppression = isInSuppressionRegion(document.activeElement);
      update();
    });

    topObserver.observe(target);
    document.querySelectorAll('[data-floating-cta-suppress]').forEach((node) => suppressionObserver.observe(node));
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);
    return () => {
      topObserver.disconnect();
      suppressionObserver.disconnect();
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
    };
  }, []);

  return <div className="floating-ship-now" data-visible={visible}>{visible ? <ShipNowLink persistent /> : null}</div>;
}
