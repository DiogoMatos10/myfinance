'use client';

import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type ThemeName =
  | 'theme-default'
  | 'theme-emerald'
  | 'theme-ocean'
  | 'theme-sunset';

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const DEFAULT_THEME: ThemeName = 'theme-default';

const getStoredTheme = (): ThemeName | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const stored = window.localStorage.getItem('theme');
  if (
    stored === 'theme-default' ||
    stored === 'theme-emerald' ||
    stored === 'theme-ocean' ||
    stored === 'theme-sunset'
  ) {
    return stored;
  }

  return null;
};

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<ThemeName>(
    () => getStoredTheme() ?? DEFAULT_THEME
  );

  useEffect(() => {
    window.localStorage.setItem('theme', theme);
    document.documentElement.classList.remove(
      'theme-default',
      'theme-emerald',
      'theme-ocean',
      'theme-sunset'
    );
    document.documentElement.classList.add(theme);
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
