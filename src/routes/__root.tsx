import { createRootRoute, Outlet } from '@tanstack/react-router';
import { PageNotFound } from './$404';
import '@/styles/globals.css';

export const Route = createRootRoute({
  component: RootRoute,
  notFoundComponent: PageNotFound,
});

function RootRoute() {
  return <Outlet />;
}
