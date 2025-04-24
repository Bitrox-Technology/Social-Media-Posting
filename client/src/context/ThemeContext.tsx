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

const colorSchemeClasses = {
  default: {
    primary: 'text-indigo-600 dark:text-indigo-400',
    secondary: 'text-amber-500 dark:text-amber-400',
    accent: 'text-emerald-500 dark:text-emerald-400',
  },
  blue: {
    primary: 'text-blue-600 dark:text-blue-400',
    secondary: 'text-sky-500 dark:text-sky-400',
    accent: 'text-cyan-500 dark:text-cyan-400',
  },
  green: {
    primary: 'text-green-600 dark:text-green-400',
    secondary: 'text-emerald-500 dark:text-emerald-400',
    accent: 'text-lime-500 dark:text-lime-400',
  },
  purple: {
    primary: 'text-purple-600 dark:text-purple-400',
    secondary: 'text-fuchsia-500 dark:text-fuchsia-400',
    accent: 'text-pink-500 dark:text-pink-400',
  },
  orange: {
    primary: 'text-orange-600 dark:text-orange-400',
    secondary: 'text-amber-500 dark:text-amber-400',
    accent: 'text-yellow-500 dark:text-yellow-400',
  },
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || savedTheme === 'light'
      ? savedTheme
      : window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
    const savedScheme = localStorage.getItem('colorScheme') as ColorScheme;
    return savedScheme || 'default';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);

    // Log the current theme to debug
    console.log('Applied theme:', theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    // Remove all previous color scheme classes
    Object.values(colorSchemeClasses).forEach(scheme => {
      Object.values(scheme).forEach(className => {
        root.classList.remove(...className.split(' '));
      });
    });
    // Apply new color scheme classes
    const currentClasses = colorSchemeClasses[colorScheme];
    Object.values(currentClasses).forEach(className => {
      root.classList.add(...className.split(' '));
    });
    localStorage.setItem('colorScheme', colorScheme);

    // Log the current color scheme to debug
    console.log('Applied color scheme:', colorScheme, 'Classes:', currentClasses);
  }, [colorScheme]);

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