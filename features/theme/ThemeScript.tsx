import { THEME_STORAGE_KEY } from './types';

const bootstrap = `
(() => {
  try {
    document.documentElement.classList.add('js');
    const preference = localStorage.getItem('${THEME_STORAGE_KEY}') || 'system';
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch {}
})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: bootstrap }} />;
}
