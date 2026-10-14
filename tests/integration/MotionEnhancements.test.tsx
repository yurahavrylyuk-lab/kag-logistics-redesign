import { act, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AmbientCursor } from '@/features/motion/AmbientCursor';
import { SectionChoreography } from '@/features/motion/SectionChoreography';
import { installIntersectionObserverMock, setMediaCapabilities } from '../setup';
import { renderWithRouter } from '../test-router';

describe('progressive motion enhancements', () => {
  it('sets choreography state only from observer entries and cleans up its observer', async () => {
    setMediaCapabilities();
    const observers = installIntersectionObserverMock();
    const { unmount } = renderWithRouter(<><section data-choreography data-testid="section" /><SectionChoreography /></>);
    const section = await screen.findByTestId('section');
    await waitFor(() => expect(observers).toHaveLength(1));

    expect(section).toHaveAttribute('data-choreography-state', 'static');
    observers[0].callback([{ target: section, isIntersecting: false, boundingClientRect: { top: 20 } } as unknown as IntersectionObserverEntry], {} as IntersectionObserver);
    expect(section).toHaveAttribute('data-choreography-state', 'entering');
    observers[0].callback([{ target: section, isIntersecting: true } as unknown as IntersectionObserverEntry], {} as IntersectionObserver);
    expect(section).toHaveAttribute('data-choreography-state', 'centered');
    observers[0].callback([{ target: section, isIntersecting: false, boundingClientRect: { top: -20 } } as unknown as IntersectionObserverEntry], {} as IntersectionObserver);
    expect(section).toHaveAttribute('data-choreography-state', 'exiting');

    unmount();
    expect(observers[0].disconnect).toHaveBeenCalledOnce();
  });

  it('does not attach an observer or ambient cursor listener for reduced motion', async () => {
    setMediaCapabilities({ reducedMotion: true });
    const observers = installIntersectionObserverMock();
    const addEventListener = vi.spyOn(window, 'addEventListener');
    renderWithRouter(<><section data-choreography data-testid="section" /><SectionChoreography /><AmbientCursor /></>);
    await screen.findByTestId('section');

    expect(observers).toHaveLength(0);
    expect(addEventListener).not.toHaveBeenCalledWith('pointermove', expect.any(Function), expect.anything());
  });

  it('resets observed sections and disconnects when reduced motion is enabled after mount', async () => {
    const listeners = new Set<(event: MediaQueryListEvent) => void>();
    let reducedMotion = false;
    vi.stubGlobal('matchMedia', vi.fn().mockImplementation(() => ({
      get matches() { return reducedMotion; },
      addEventListener: (_event: string, listener: (event: MediaQueryListEvent) => void) => listeners.add(listener),
      removeEventListener: (_event: string, listener: (event: MediaQueryListEvent) => void) => listeners.delete(listener),
    })));
    const observers = installIntersectionObserverMock();
    renderWithRouter(<><section data-choreography data-testid="section" /><SectionChoreography /></>);
    const section = await screen.findByTestId('section');
    await waitFor(() => expect(observers).toHaveLength(1));

    act(() => observers[0].callback([{ target: section, isIntersecting: true } as unknown as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(section).toHaveAttribute('data-choreography-state', 'centered');

    reducedMotion = true;
    act(() => listeners.forEach((listener) => listener({ matches: true } as MediaQueryListEvent)));
    expect(observers[0].disconnect).toHaveBeenCalledOnce();
    expect(section).toHaveAttribute('data-choreography-state', 'static');
    expect(observers).toHaveLength(1);
  });

  it('disconnects and re-observes sections after a router pathname change', async () => {
    setMediaCapabilities();
    const observers = installIntersectionObserverMock();
    const { router } = renderWithRouter(<><section data-choreography data-testid="section" /><SectionChoreography /></>);
    const section = await screen.findByTestId('section');
    await waitFor(() => expect(observers).toHaveLength(1));
    observers[0].callback([{ target: section, isIntersecting: true } as unknown as IntersectionObserverEntry], {} as IntersectionObserver);
    expect(section).toHaveAttribute('data-choreography-state', 'centered');

    await act(async () => { router.history.push('/about'); });
    await waitFor(() => expect(observers).toHaveLength(2));
    expect(observers[0].disconnect).toHaveBeenCalledOnce();
    expect(observers[1].observed).toContain(section);
    expect(section).toHaveAttribute('data-choreography-state', 'static');
  });

  it('leaves sections static when IntersectionObserver is unavailable', async () => {
    setMediaCapabilities();
    const original = Object.getOwnPropertyDescriptor(window, 'IntersectionObserver');
    Reflect.deleteProperty(window, 'IntersectionObserver');
    try {
      renderWithRouter(<><section data-choreography data-testid="section" /><SectionChoreography /></>);
      const section = await screen.findByTestId('section');
      await waitFor(() => expect(section).toHaveAttribute('data-choreography-state', 'static'));
    } finally {
      if (original) Object.defineProperty(window, 'IntersectionObserver', original);
      else Reflect.deleteProperty(window, 'IntersectionObserver');
    }
  });

  it('does not mount or start the cursor loop for a coarse pointer', () => {
    setMediaCapabilities({ coarsePointer: true, finePointer: false });
    const addEventListener = vi.spyOn(window, 'addEventListener');
    const { container } = render(<AmbientCursor />);

    expect(container.querySelector('.ambient-cursor')).not.toBeInTheDocument();
    expect(addEventListener).not.toHaveBeenCalledWith('pointermove', expect.any(Function), expect.anything());
  });

  it('cancels its pending frame and removes the cursor listener on cleanup', () => {
    setMediaCapabilities();
    const requestFrame = vi.fn(() => 7);
    const cancelFrame = vi.fn();
    vi.stubGlobal('requestAnimationFrame', requestFrame);
    vi.stubGlobal('cancelAnimationFrame', cancelFrame);
    const removeEventListener = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(<AmbientCursor />);

    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 20, clientY: 30 }));
    expect(requestFrame).toHaveBeenCalledOnce();

    unmount();
    expect(cancelFrame).toHaveBeenCalledWith(7);
    expect(removeEventListener).toHaveBeenCalledWith('pointermove', expect.any(Function));
  });

  it('coalesces pointer moves into one pending frame and writes eased CSS coordinates', () => {
    setMediaCapabilities();
    let callback: FrameRequestCallback | undefined;
    const requestFrame = vi.fn((next: FrameRequestCallback) => { callback = next; return 7; });
    vi.stubGlobal('requestAnimationFrame', requestFrame);
    render(<AmbientCursor />);
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 10, clientY: 10 }));
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 100, clientY: 50 }));
    expect(requestFrame).toHaveBeenCalledOnce();
    callback!(0);
    expect(document.documentElement.style.getPropertyValue('--cursor-x')).toBe('18px');
    expect(document.documentElement.style.getPropertyValue('--cursor-y')).toBe('9px');
    expect(requestFrame).toHaveBeenCalledTimes(2);
  });

  it('cancels and restarts the cursor frame when motion is disabled and re-enabled', () => {
    let reducedMotion = false;
    const listeners = new Set<() => void>();
    vi.stubGlobal('matchMedia', vi.fn((query: string) => ({
      get matches() { return query.includes('pointer: fine') || reducedMotion; },
      media: query,
      onchange: null,
      addEventListener: (_event: string, listener: () => void) => listeners.add(listener),
      removeEventListener: (_event: string, listener: () => void) => listeners.delete(listener),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })));
    const requestFrame = vi.fn(() => 7);
    const cancelFrame = vi.fn();
    vi.stubGlobal('requestAnimationFrame', requestFrame);
    vi.stubGlobal('cancelAnimationFrame', cancelFrame);
    const { container } = render(<AmbientCursor />);
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 20, clientY: 30 }));
    reducedMotion = true;
    act(() => listeners.forEach((listener) => listener()));
    expect(container.querySelector('.ambient-cursor')).not.toBeInTheDocument();
    expect(cancelFrame).toHaveBeenCalledWith(7);
    reducedMotion = false;
    act(() => listeners.forEach((listener) => listener()));
    expect(container.querySelector('.ambient-cursor')).toBeInTheDocument();
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 40, clientY: 50 }));
    expect(requestFrame).toHaveBeenCalledTimes(2);
  });
});
