import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const wordmarks = [
  'public/logos/kag-light.svg',
  'public/logos/kag-dark.svg',
  'public/logos/kag-mono-light.svg',
  'public/logos/kag-mono-dark.svg',
];

describe('KAG wordmark assets', () => {
  it('uses the shared conceptual KAG wordmark geometry in every theme variant', () => {
    wordmarks.forEach((path) => {
      const svg = readFileSync(path, 'utf8');
      expect(svg).toContain('id="kag-wordmark"');
      expect(svg).toContain('<title id="title">KAG Logistics</title>');
      expect(svg).toMatch(/data-letter="K"[\s\S]*data-letter="A"[\s\S]*data-letter="G"/);
      expect(svg).toMatch(/>LOGISTICS<\/text>/);
    });
  });
});
