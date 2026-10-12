'use client';

import { useEffect } from 'react';

export function SectionChoreography() {
  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>('[data-choreography]')];
    sections.forEach((section) => section.setAttribute('data-choreography-state', 'static'));

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.setAttribute(
          'data-choreography-state',
          entry.isIntersecting ? 'centered' : entry.boundingClientRect.top > 0 ? 'entering' : 'exiting',
        );
      });
    }, { rootMargin: '0px 0px -20% 0px', threshold: 0.35 });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return null;
}
