import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FloatingShipNow } from '@/components/layout/FloatingShipNow';
import { installIntersectionObserverMock } from '../setup';

describe('FloatingShipNow', () => {
  it('reveals the configured accessible Ship Now action only after its opening sentinel exits', () => {
    const observers = installIntersectionObserverMock();
    const addEventListener = vi.spyOn(window, 'addEventListener');
    const { unmount } = render(<><div id="floating-cta-top-sentinel" /><footer data-floating-cta-suppress /><FloatingShipNow /></>);
    const sentinel = document.getElementById('floating-cta-top-sentinel')!;

    expect(screen.queryByRole('link', { name: /persistent ship now/i })).not.toBeInTheDocument();
    expect(addEventListener).not.toHaveBeenCalledWith('scroll', expect.any(Function), expect.anything());
    act(() => observers[0].callback([{ target: sentinel, isIntersecting: false } as unknown as IntersectionObserverEntry], {} as IntersectionObserver));
    const shipNow = screen.getByRole('link', { name: /persistent ship now/i });
    expect(shipNow).toHaveAttribute('href', 'https://www.kaglogistics.com/ship-now-2/');
    expect(shipNow).toHaveClass('ship-now');

    const footer = document.querySelector('footer')!;
    act(() => observers[1].callback([{ target: footer, isIntersecting: true } as unknown as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(screen.queryByRole('link', { name: /persistent ship now/i })).not.toBeInTheDocument();
    act(() => observers[1].callback([{ target: footer, isIntersecting: false } as unknown as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(screen.getByRole('link', { name: /persistent ship now/i })).toBeInTheDocument();

    unmount();
    expect(observers[0].disconnect).toHaveBeenCalledOnce();
    expect(observers[1].disconnect).toHaveBeenCalledOnce();
  });
});
