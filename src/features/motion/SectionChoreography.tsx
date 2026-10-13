import { useEffect } from 'react';
import { useCurrentPathname } from '@/app/use-current-pathname';

export function SectionChoreography() {
  const pathname = useCurrentPathname();

  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>('[data-choreography]')];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer: IntersectionObserver | undefined;
    const reset = () => sections.forEach((section) => section.setAttribute('data-choreography-state', 'static'));
    const connect = () => {
      observer?.disconnect();
      reset();

      if (reducedMotion.matches || !('IntersectionObserver' in window)) return;

      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          entry.target.setAttribute(
            'data-choreography-state',
            entry.isIntersecting ? 'centered' : entry.boundingClientRect.top > 0 ? 'entering' : 'exiting',
          );
        });
      }, { rootMargin: '0px 0px -20% 0px', threshold: 0.35 });

      sections.forEach((section) => observer?.observe(section));
    };
    const onPreferenceChange = () => connect();

    connect();
    reducedMotion.addEventListener('change', onPreferenceChange);
    return () => {
      observer?.disconnect();
      reducedMotion.removeEventListener('change', onPreferenceChange);
    };
  }, [pathname]);

  return null;
}
