import { existsSync } from 'node:fs';
import { extname, resolve, sep } from 'node:path';
import type { Plugin } from 'vite';

/** Preview the generated directory documents at their canonical public URLs. */
export function staticPreview(): Plugin {
  return {
    name: 'kag-static-preview',
    configurePreviewServer(server) {
      const outputDirectory = resolve(server.config.root, server.config.build.outDir);
      server.middlewares.use((request, _response, next) => {
        if (request.method !== 'GET' && request.method !== 'HEAD') return next();
        try {
          const url = new URL(request.url ?? '/', 'http://preview.local');
          const pathname = decodeURIComponent(url.pathname);
          if (pathname.endsWith('/') || extname(pathname)) return next();
          const document = resolve(outputDirectory, `.${pathname}`, 'index.html');
          if (document.startsWith(`${outputDirectory}${sep}`) && existsSync(document)) {
            request.url = `${url.pathname}/index.html${url.search}`;
          }
        } catch {
          // Leave malformed URLs to Vite's normal request handling.
        }
        next();
      });
    },
  };
}
