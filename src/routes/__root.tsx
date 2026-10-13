import { createRootRoute, Outlet } from '@tanstack/react-router';
import { PageNotFound } from './$404';
import { AppProviders } from '@/app/providers';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { FloatingShipNow } from '@/components/layout/FloatingShipNow';
import { SectionChoreography } from '@/features/motion/SectionChoreography';
import { AmbientCursor } from '@/features/motion/AmbientCursor';
import '@/styles/globals.css';

export const Route = createRootRoute({
  component: AppShell,
  notFoundComponent: PageNotFound,
});

export function AppShell() {
  return <AppProviders>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <SiteHeader />
    <div aria-hidden="true" id="floating-cta-top-sentinel" />
    <Outlet />
    <SectionChoreography />
    <AmbientCursor />
    <FloatingShipNow />
    <SiteFooter />
  </AppProviders>;
}
