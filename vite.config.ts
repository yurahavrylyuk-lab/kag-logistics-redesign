import { fileURLToPath } from 'node:url';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { staticPreview } from './scripts/static-preview.ts';

export default defineConfig({
  base: '/',
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      // This file supplies the root not-found boundary, not a path parameter.
      routeFileIgnorePattern: '^\\$404\\.tsx$',
    }),
    react(),
    tailwindcss(),
    staticPreview(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
