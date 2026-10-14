import { THEME_STORAGE_KEY } from './types';

const bootstrap = `
(() => {
  try {
    const stored = localStorage.getItem('${THEME_STORAGE_KEY}');
    const preference = stored === 'light' || stored === 'dark' ? stored : 'system';
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch {}
})();`;

export function ThemeBootstrapScript() {
  return <script dangerouslySetInnerHTML={{ __html: bootstrap }} />;
}
