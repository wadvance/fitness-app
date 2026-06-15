import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';

export const lightColors = {
  primary: '#6C63FF',
  primaryDark: '#5A52D5',
  primaryLight: '#8B85FF',
  secondary: '#FF6B6B',
  accent: '#FFD93D',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',

  background: '#F8F9FE',
  surface: '#FFFFFF',
  surfaceAlt: '#F0F0F5',
  card: '#FFFFFF',

  text: '#1A1A2E',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',

  border: '#E5E7EB',
  divider: '#F0F0F0',

  white: '#FFFFFF',
  black: '#000000',
};

export const darkColors = {
  primary: '#6C63FF',
  primaryDark: '#5A52D5',
  primaryLight: '#8B85FF',
  secondary: '#FF6B6B',
  accent: '#FFD93D',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',

  background: '#0D0D1A',
  surface: '#1A1A2E',
  surfaceAlt: '#252540',
  card: '#1A1A2E',

  text: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textLight: '#6B7280',

  border: '#2D2D45',
  divider: '#252540',

  white: '#FFFFFF',
  black: '#000000',
};

export const spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
};

export const fontSize = {
  xs: 12, sm: 14, md: 16, lg: 18, xl: 22, xxl: 28, title: 34,
};

export const borderRadius = {
  sm: 8, md: 12, lg: 16, xl: 24, full: 999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
};

interface ThemeContextType {
  colors: typeof lightColors;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  colors: lightColors,
  isDark: false,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => setIsDark(p => !p);
  const colors = useMemo(() => (isDark ? darkColors : lightColors), [isDark]);

  return (
    <ThemeContext.Provider value={{ colors, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
