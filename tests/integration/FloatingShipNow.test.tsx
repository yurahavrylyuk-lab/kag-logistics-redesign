import { act, screen, waitFor } from '@testing-library/react';
import { renderWithRouter } from '../test-router';
import { useCurrentPathname } from '@/app/use-current-pathname';
import { describe, expect, it, vi } from 'vitest';
import { FloatingShipNow } from '@/components/layout/FloatingShipNow';
import { installIntersectionObserverMock } from '../setup';

describe('FloatingShipNow', () => {
  it('reveals the configured accessible Ship Now action only after its opening sentinel exits', async () => {
    const observers = installIntersectionObserverMock();
    const addEventListener = vi.spyOn(window, 'addEventListener');
    const { unmount } = renderWithRouter(<><div id="floating-cta-top-sentinel" /><footer data-floating-cta-suppress /><FloatingShipNow /></>);
    await waitFor(() => expect(observers).toHaveLength(2));
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

  it('cleans up and rebinds observers to the global sentinel after client navigation', async () => {
    const observers = installIntersectionObserverMock();
    function Shell() {
      const pathname = useCurrentPathname();
      return <><div id="floating-cta-top-sentinel" />{pathname === '/' ? <section id="hero" /> : <main>About</main>}<footer data-floating-cta-suppress /><FloatingShipNow /></>;
    }
    const { router } = renderWithRouter(<Shell />);
    await waitFor(() => expect(observers).toHaveLength(2));
    expect(observers[0].observed).toEqual([document.getElementById('hero')]);
    act(() => observers[0].callback([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(screen.getByRole('link', { name: /persistent ship now/i })).toBeInTheDocument();

    await act(async () => { router.history.push('/about'); });
    await waitFor(() => expect(observers).toHaveLength(4));
    expect(observers[0].disconnect).toHaveBeenCalledOnce();
    expect(observers[1].disconnect).toHaveBeenCalledOnce();
    expect(observers[2].observed).toEqual([document.getElementById('floating-cta-top-sentinel')]);
    expect(observers[3].observed).toEqual([document.querySelector('footer')]);
    expect(screen.queryByRole('link', { name: /persistent ship now/i })).not.toBeInTheDocument();
    act(() => observers[2].callback([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(screen.getByRole('link', { name: /persistent ship now/i })).toBeInTheDocument();
  });
});
