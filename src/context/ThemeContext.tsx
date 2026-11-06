import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ThemeConfig {
  brandName: string;
  brandTagline: string;
  primaryColor: string;
  accentColor: string;
  goldColor: string;
  ivoryBg: string;
  fontSerif: string;
  fontSans: string;
}

const DEFAULT_THEME: ThemeConfig = {
  brandName: 'SONY FEEDING KURTIS',
  brandTagline: 'Maternity & Ethnic Boutique',
  primaryColor: '#7A2832', // Direction A: Elegant Wine / Burgundy
  accentColor: '#C87D7D',  // Muted Rose
  goldColor: '#C5A059',    // Antique Gold
  ivoryBg: '#FDFBF7',      // Warm Ivory
  fontSerif: '"Playfair Display", Georgia, serif',
  fontSans: '"Plus Jakarta Sans", Inter, system-ui, sans-serif',
};

interface ThemeContextType {
  theme: ThemeConfig;
  updateTheme: (partial: Partial<ThemeConfig>) => void;
  resetTheme: () => void;
}

const THEME_STORAGE_KEY = 'sony_theme_config';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      return saved ? { ...DEFAULT_THEME, ...JSON.parse(saved) } : DEFAULT_THEME;
    } catch {
      return DEFAULT_THEME;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--brand-primary', theme.primaryColor);
    root.style.setProperty('--brand-700', theme.primaryColor);
    root.style.setProperty('--brand-accent', theme.accentColor);
    root.style.setProperty('--brand-gold', theme.goldColor);
    root.style.setProperty('--ivory-bg', theme.ivoryBg);
    
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
    } catch {
      // ignore
    }
  }, [theme]);

  const updateTheme = (partial: Partial<ThemeConfig>) => {
    setTheme((prev) => ({ ...prev, ...partial }));
  };

  const resetTheme = () => {
    setTheme(DEFAULT_THEME);
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

