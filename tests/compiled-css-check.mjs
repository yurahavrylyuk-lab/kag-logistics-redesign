import { chromium } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import assert from 'node:assert/strict';

const cssPath = readdirSync('dist/assets').find((name) => name.endsWith('.css'));
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.setContent(`<html data-theme="light"><head><style>${readFileSync(`dist/assets/${cssPath}`, 'utf8')}</style></head><body><button class="button button-primary">Continue</button><button class="button button-icon">Icon</button><div style="background:var(--primary)" id="mapped">Mapped shadcn variable</div><input class="form-control" aria-invalid="true" /><div class="sheet-content" data-side="right">Sheet</div></body></html>`);
  const readStyles = () => page.evaluate(() => ({
    background: getComputedStyle(document.body).backgroundColor,
    foreground: getComputedStyle(document.body).color,
    primary: getComputedStyle(document.querySelector('.button-primary')).backgroundColor,
    mapped: getComputedStyle(document.querySelector('#mapped')).backgroundColor,
    targetHeight: getComputedStyle(document.querySelector('.button')).minHeight,
    iconPadding: getComputedStyle(document.querySelector('.button-icon')).padding,
    invalidBorder: getComputedStyle(document.querySelector('input')).borderColor,
    sheetBackground: getComputedStyle(document.querySelector('.sheet-content')).backgroundColor,
  }));
  const light = await readStyles();
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  const dark = await readStyles();
  console.log(JSON.stringify({ light, dark }, null, 2));
  if (light.background !== 'rgb(245, 245, 242)' || dark.background !== 'rgb(16, 21, 20)' || light.primary !== 'rgb(151, 40, 22)' || dark.primary !== 'rgb(192, 77, 58)' || light.primary !== light.mapped || dark.primary !== dark.mapped || light.targetHeight !== '44px' || light.iconPadding !== '8px' || light.invalidBorder !== 'rgb(180, 35, 24)' || dark.invalidBorder !== 'rgb(255, 147, 134)' || light.sheetBackground !== 'rgb(255, 255, 255)' || dark.sheetBackground !== 'rgb(24, 32, 30)') {
    throw new Error('Compiled KAG token/style contract failed');
  }
  // Literal expectations preserve the legacy computed behavior. Some old
  // declarations intentionally inherited because their variables were undefined.
  const typographyFixture = `
    <div class="hero-copy"><p data-copy="hero">Hero copy</p><p class="eyebrow" data-copy="eyebrow">Eyebrow</p></div>
    <span class="unavailable-message" data-copy="unavailable">Unavailable</span>
    <p class="hub-hero-copy" data-copy="hub">Hub copy</p>
    <section class="detail-hero"><p data-copy="detail">Detail copy</p></section>
    <form class="quote-wizard"><fieldset><legend data-copy="legend">Freight</legend></fieldset></form>
    <ul class="capability-list"><li data-copy="capability">Capability</li></ul>
  `;
  for (const theme of ['light', 'dark']) {
    for (const inheritedSize of [16, 24]) {
      await page.setContent(`<html data-theme="${theme}"><head><style>${readFileSync(`dist/assets/${cssPath}`, 'utf8')}</style></head><body><main style="font-size:${inheritedSize}px">${typographyFixture}</main></body></html>`);
      const sizes = await page.evaluate(() => Object.fromEntries(
        [...document.querySelectorAll('[data-copy]')].map((element) => [element.getAttribute('data-copy'), getComputedStyle(element).fontSize]),
      ));
      console.log(JSON.stringify({ theme, inheritedSize, sizes }));
      assert.deepEqual(sizes, {
        hero: '20px',
        eyebrow: '14px',
        unavailable: `${inheritedSize}px`,
        hub: `${inheritedSize}px`,
        detail: `${inheritedSize}px`,
        legend: `${inheritedSize}px`,
        capability: `${inheritedSize}px`,
      }, `KAG typography must preserve fallbacks and inheritance (${theme}, ${inheritedSize}px parent)`);
    }
  }
} finally {
  await browser.close();
}
