'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import {
  defaultSettings,
  resetSettings as resetStoredSettings,
  toggleTheme,
  updateSettings as updateStoredSettings,
  useSettingsSnapshot,
  useThemeSnapshot,
  type Settings,
  type Theme,
} from '@/lib/storage';

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside AppProviders');
  return context;
}

type SettingsContextValue = {
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
  resetSettings: () => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used inside AppProviders');
  return context;
}

export function AppProviders({ children }: { children: ReactNode }) {
  const theme = useThemeSnapshot();
  const settings = useSettingsSnapshot();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    updateStoredSettings(patch);
  }, []);

  const resetSettings = useCallback(() => {
    resetStoredSettings();
  }, []);

  const themeValue = useMemo(() => ({ theme, toggleTheme }), [theme]);
  const settingsValue = useMemo(
    () => ({
      settings: settings ?? defaultSettings,
      updateSettings,
      resetSettings,
    }),
    [settings, updateSettings, resetSettings],
  );

  return (
    <ThemeContext.Provider value={themeValue}>
      <SettingsContext.Provider value={settingsValue}>{children}</SettingsContext.Provider>
    </ThemeContext.Provider>
  );
}
