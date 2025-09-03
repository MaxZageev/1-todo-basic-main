import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { ThemeProvider as SCThemeProvider, createGlobalStyle} from 'styled-components';
import type { DefaultTheme} from 'styled-components';
import { ThemeProvider as MUIThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { loadTheme, saveTheme } from '../utils/localStorage';

declare module 'styled-components' {
  export interface DefaultTheme {
    mode: 'light' | 'dark';
    colors: {
      background: string;
      surface: string;
      text: string;
      border: string;
    };
  }
}

const lightTheme: DefaultTheme = {
  mode: 'light',
  colors: {
    background: '#91fbffff',
    surface: '#defcffff',
    text: '#16191aff',
    border: '#447974ff',
  },
};

const darkTheme: DefaultTheme = {
  mode: 'dark',
  colors: {
    background: '#32003bff',
    surface: '#2b0641ff',
    text: '#e7d3f0ff',
    border: '#33223aff',
  },
};

const Global = createGlobalStyle`
  :root { color-scheme: ${({ theme }) => theme.mode}; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, "Helvetica Neue", Arial, "Apple Color Emoji","Segoe UI Emoji";
  }
`;

type ColorModeContext = {
  mode: 'light' | 'dark';
  toggle: () => void;
};

const ColorModeCtx = createContext<ColorModeContext | null>(null);

export const useColorMode = () => {
  const ctx = useContext(ColorModeCtx);
  if (!ctx) throw new Error('useColorMode must be used within AppThemeProvider');
  return ctx;
};

export const AppThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>(() => loadTheme());

  useEffect(() => { saveTheme(mode); }, [mode]);
  const toggle = () => setMode(m => (m === 'light' ? 'dark' : 'light'));

  const scTheme = mode === 'light' ? lightTheme : darkTheme;

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? { background: { default: lightTheme.colors.background, paper: lightTheme.colors.surface } }
            : { background: { default: darkTheme.colors.background, paper: darkTheme.colors.surface } }),
        },
        shape: { borderRadius: 10 },
      }),
    [mode]
  );

  const value = useMemo(() => ({ mode, toggle }), [mode]);

  return (
    <ColorModeCtx.Provider value={value}>
      <MUIThemeProvider theme={muiTheme}>
        <SCThemeProvider theme={scTheme}>
          <CssBaseline />
          <Global />
          {children}
        </SCThemeProvider>
      </MUIThemeProvider>
    </ColorModeCtx.Provider>
  );
};
