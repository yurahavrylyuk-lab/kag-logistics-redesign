import type { ReactNode } from 'react';
import { ThemeProvider } from '@/features/theme/ThemeProvider';

export function AppProviders({ children }: Readonly<{ children: ReactNode }>) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
