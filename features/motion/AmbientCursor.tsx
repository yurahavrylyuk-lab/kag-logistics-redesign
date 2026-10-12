'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';

function supportsAmbientCursor() {
  return window.matchMedia('(pointer: fine)').matches
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function subscribeToAmbientCapability(onChange: () => void) {
  const pointer = window.matchMedia('(pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  pointer.addEventListener('change', onChange);
  reducedMotion.addEventListener('change', onChange);
  return () => {
    pointer.removeEventListener('change', onChange);
    reducedMotion.removeEventListener('change', onChange);
  };
}

export function AmbientCursor() {
  const enabled = useSyncExternalStore(subscribeToAmbientCapability, supportsAmbientCursor, () => false);
  const frame = useRef<number | null>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return undefined;

    const renderFrame = () => {
      frame.current = null;
      current.current.x += (target.current.x - current.current.x) * 0.18;
      current.current.y += (target.current.y - current.current.y) * 0.18;
      document.documentElement.style.setProperty('--cursor-x', `${current.current.x}px`);
      document.documentElement.style.setProperty('--cursor-y', `${current.current.y}px`);

      if (Math.abs(target.current.x - current.current.x) > 0.5 || Math.abs(target.current.y - current.current.y) > 0.5) {
        frame.current = window.requestAnimationFrame(renderFrame);
      }
    };
    const move = (event: PointerEvent) => {
      target.current = { x: event.clientX, y: event.clientY };
      if (frame.current === null) frame.current = window.requestAnimationFrame(renderFrame);
    };

    window.addEventListener('pointermove', move, { passive: true });
    return () => {
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
      window.removeEventListener('pointermove', move);
    };
  }, [enabled]);

  return enabled ? <div aria-hidden="true" className="ambient-cursor" /> : null;
}
