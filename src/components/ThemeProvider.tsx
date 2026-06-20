'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'dark' | 'light' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
  resolvedTheme: 'dark' | 'light';
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
  resolvedTheme: 'dark',
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');

  // Resolve "system" → actual OS preference
  function resolve(t: Theme): 'dark' | 'light' {
    if (t === 'system') {
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    return t;
  }

  function applyTheme(t: Theme) {
    const resolved = resolve(t);
    setResolvedTheme(resolved);
    if (resolved === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  function setTheme(t: Theme) {
    setThemeState(t);
    localStorage.setItem('crm-theme', t);
    applyTheme(t);
  }

  // On mount: restore saved theme
  useEffect(() => {
    const saved = (localStorage.getItem('crm-theme') as Theme) || 'dark';
    setThemeState(saved);
    applyTheme(saved);

    // Listen for OS preference changes when "system" is selected
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const handler = () => {
      if (saved === 'system') applyTheme('system');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []); // eslint-disable-line

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
