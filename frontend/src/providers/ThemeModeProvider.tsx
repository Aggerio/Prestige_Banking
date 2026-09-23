import { CssBaseline, PaletteMode, ThemeProvider } from '@mui/material';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { createAppTheme } from 'theme/theme';

type ThemeModeContextValue = {
  mode: PaletteMode;
  setMode: (mode: PaletteMode) => void;
};

const ThemeModeContext = createContext<ThemeModeContextValue | undefined>(undefined);

export const ThemeModeProvider = ({ children }: PropsWithChildren) => {
  const [mode, setMode] = useState<PaletteMode>(() =>
    localStorage.getItem('prestige-theme') === 'dark' ? 'dark' : 'light',
  );
  const theme = useMemo(() => createAppTheme(mode), [mode]);

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    localStorage.setItem('prestige-theme', mode);
  }, [mode]);

  return (
    <ThemeModeContext.Provider value={{ mode, setMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = () => {
  const context = useContext(ThemeModeContext);
  if (!context) throw new Error('useThemeMode must be used inside ThemeModeProvider');
  return context;
};
