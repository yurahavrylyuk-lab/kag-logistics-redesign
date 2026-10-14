import { useTheme } from './ThemeProvider';
import type { ThemePreference } from './types';

const options: { preference: ThemePreference; label: string; icon: 'sun' | 'moon' | 'system' }[] = [
  { preference: 'light', label: 'Light theme', icon: 'sun' },
  { preference: 'dark', label: 'Dark theme', icon: 'moon' },
  { preference: 'system', label: 'System theme', icon: 'system' },
];

export function ThemeToggle() {
  const { preference, setPreference } = useTheme();

  return (
    <div aria-label="Color theme" className="theme-toggle" role="group">
      <span className="theme-toggle-label">Theme</span>
      {options.map((option) => (
        <button
          aria-label={option.label}
          aria-pressed={preference === option.preference}
          key={option.preference}
          onClick={() => setPreference(option.preference)}
          type="button"
        >
          <ThemeIcon name={option.icon} />
        </button>
      ))}
    </div>
  );
}

function ThemeIcon({ name }: { name: 'sun' | 'moon' | 'system' }) {
  if (name === 'sun') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.1 5.1l1.8 1.8M17.1 17.1l1.8 1.8M18.9 5.1l-1.8 1.8M6.9 17.1l-1.8 1.8" />
      </svg>
    );
  }

  if (name === 'moon') {
    return (
      <svg aria-hidden="true" className="theme-icon-moon" viewBox="0 0 24 24">
        <path d="M16.5 3.2A8.2 8.2 0 1 0 20.8 14 6.4 6.4 0 0 1 16.5 3.2Z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <rect height="14" rx="2" width="18" x="3" y="4" />
      <path d="M8 21h8M12 18v3" />
    </svg>
  );
}
