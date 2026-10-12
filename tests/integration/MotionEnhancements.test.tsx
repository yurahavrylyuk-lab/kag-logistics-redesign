import { act, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AmbientCursor } from '@/features/motion/AmbientCursor';
import { SectionChoreography } from '@/features/motion/SectionChoreography';
import { installIntersectionObserverMock, setMediaCapabilities } from '../setup';

describe('progressive motion enhancements', () => {
  it('sets choreography state only from observer entries and cleans up its observer', () => {
    setMediaCapabilities();
    const observers = installIntersectionObserverMock();
    const { getByTestId, unmount } = render(<><section data-choreography data-testid="section" /><SectionChoreography /></>);
    const section = getByTestId('section');

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

  it('does not attach an observer or ambient cursor listener for reduced motion', () => {
    setMediaCapabilities({ reducedMotion: true });
    const observers = installIntersectionObserverMock();
    const addEventListener = vi.spyOn(window, 'addEventListener');
    render(<><section data-choreography /><SectionChoreography /><AmbientCursor /></>);

    expect(observers).toHaveLength(0);
    expect(addEventListener).not.toHaveBeenCalledWith('pointermove', expect.any(Function), expect.anything());
  });

  it('resets observed sections and disconnects when reduced motion is enabled after mount', () => {
    const listeners = new Set<(event: MediaQueryListEvent) => void>();
    vi.stubGlobal('matchMedia', vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: (_event: string, listener: (event: MediaQueryListEvent) => void) => listeners.add(listener),
      removeEventListener: (_event: string, listener: (event: MediaQueryListEvent) => void) => listeners.delete(listener),
    })));
    const observers = installIntersectionObserverMock();
    const { getByTestId } = render(<><section data-choreography data-testid="section" /><SectionChoreography /></>);
    const section = getByTestId('section');

    act(() => observers[0].callback([{ target: section, isIntersecting: true } as unknown as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(section).toHaveAttribute('data-choreography-state', 'centered');

    act(() => listeners.forEach((listener) => listener({ matches: true } as MediaQueryListEvent)));
    expect(observers[0].disconnect).toHaveBeenCalledOnce();
    expect(section).toHaveAttribute('data-choreography-state', 'static');
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
});
