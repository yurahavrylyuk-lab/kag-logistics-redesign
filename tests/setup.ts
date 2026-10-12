import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => cleanup());

export type ObserverRecord = {
  callback: IntersectionObserverCallback;
  disconnect: ReturnType<typeof vi.fn>;
  observed: Element[];
};

export function installIntersectionObserverMock() {
  const records: ObserverRecord[] = [];

  class MockIntersectionObserver {
    callback: IntersectionObserverCallback;
    disconnect = vi.fn();
    observed: Element[] = [];

    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback;
      records.push(this);
    }

    observe = (element: Element) => this.observed.push(element);
    unobserve = vi.fn();
    takeRecords = () => [];
    root = null;
    rootMargin = '0px';
    thresholds = [0];
  }

  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  return records;
}

export function setMediaCapabilities({ coarsePointer = false, finePointer = true, reducedMotion = false } = {}) {
  vi.stubGlobal('matchMedia', vi.fn().mockImplementation((query: string) => ({
    matches: query.includes('pointer: coarse') ? coarsePointer : query.includes('pointer: fine') ? finePointer : reducedMotion,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })));
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
}
