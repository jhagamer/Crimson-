
'use client';

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Theme = 'crimson-light' | 'dark' | 'theme-peach' | 'theme-lavender' | 'theme-blush-pink';

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('app-theme') as Theme | null;
      if (storedTheme) {
        return storedTheme;
      }
      // Default theme if nothing in localStorage and not checking system preference here
    }
    return 'crimson-light'; // Default theme
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all possible theme classes
    root.classList.remove('dark', 'theme-peach', 'theme-lavender', 'theme-blush-pink');
    // 'crimson-light' is the default (no class or specific class if we choose)
    // For this setup, 'crimson-light' means no specific theme class, relying on :root

    if (theme !== 'crimson-light') {
      root.classList.add(theme);
    }
    
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
