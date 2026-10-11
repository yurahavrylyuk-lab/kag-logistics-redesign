import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ThemeProvider } from '@/features/theme/ThemeProvider';
import { ThemeScript } from '@/features/theme/ThemeScript';
import './globals.css';

export const metadata: Metadata = {
  title: 'KAG Logistics',
  description: 'North American logistics and transportation management.',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <meta content="#f5f5f2" name="theme-color" />
      </head>
      <body><ThemeProvider>{children}</ThemeProvider></body>
    </html>
  );
}
