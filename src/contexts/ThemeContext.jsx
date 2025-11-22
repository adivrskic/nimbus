import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // LIGHT / DARK THEME
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;

    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemPrefersDark ? 'dark' : 'light';
  });

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);


  // STYLE THEME (minimal, brutalist, gradient, elegant, retro)
  const [selectedStyleTheme, setSelectedStyleTheme] = useState(() => {
    return localStorage.getItem('styleTheme') || 'minimal';
  });

  const setStyleTheme = (styleId) => {
    setSelectedStyleTheme(styleId);
    localStorage.setItem('styleTheme', styleId);
  };


  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme,
      selectedStyleTheme,
      setStyleTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
}


export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside a ThemeProvider");
  }
  return ctx;
}
