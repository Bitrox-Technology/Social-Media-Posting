import React, { createContext, useContext, useEffect, useState } from 'react';

type ColorScheme = 'default' | 'blue' | 'green' | 'purple' | 'orange';
type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  colorScheme: ColorScheme;
  toggleTheme: () => void;
  setColorScheme: (scheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const colorSchemes: Record<ColorScheme, { primary: string; secondary: string; accent: string }> = {
  default: {
    primary: '#4f46e5', // indigo-600
    secondary: '#f59e0b', // amber-500
    accent: '#10b981', // emerald-500
  },
  blue: {
    primary: '#2563eb', // blue-600
    secondary: '#0ea5e9', // sky-500
    accent: '#06b6d4', // cyan-500
  },
  green: {
    primary: '#16a34a', // green-600
    secondary: '#10b981', // emerald-500
    accent: '#84cc16', // lime-500
  },
  purple: {
    primary: '#9333ea', // purple-600
    secondary: '#d946ef', // fuchsia-500
    accent: '#ec4899', // pink-500
  },
  orange: {
    primary: '#ea580c', // orange-600
    secondary: '#f59e0b', // amber-500
    accent: '#eab308', // yellow-500
  },
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light';
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || savedTheme === 'light'
      ? savedTheme
      : window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
    if (typeof window === 'undefined') return 'default';
    const savedScheme = localStorage.getItem('colorScheme') as ColorScheme;
    return savedScheme || 'default';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);

    // Apply color scheme as CSS variables
    const colors = colorSchemes[colorScheme];
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);

    console.log('Applied theme:', theme, 'Color scheme:', colorScheme, 'Colors:', colors);
  }, [theme, colorScheme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, colorScheme, toggleTheme, setColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};