import { useTheme } from './ThemeProvider';
import type { ThemePreference } from './types';

export function ThemeToggle() {
  const { preference, setPreference } = useTheme();

  return (
    <label>
      <span className="sr-only">Color theme</span>
      <select
        aria-label="Color theme"
        className="theme-toggle"
        onChange={(event) => setPreference(event.target.value as ThemePreference)}
        value={preference}
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  );
}
