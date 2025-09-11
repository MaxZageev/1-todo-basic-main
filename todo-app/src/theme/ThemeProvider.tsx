import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { ThemeProvider as SCThemeProvider } from "styled-components";
import { ThemeProvider as MUIThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { GlobalStyles } from "./GlobalStyles";
import { lightTheme, darkTheme } from "./themes";
import { loadTheme, saveTheme } from "../utils/localStorage";
import type { ColorModeContext } from "../types/styles";


const ColorModeCtx = createContext<ColorModeContext | null>(null);

export const useColorMode = () => {
  const ctx = useContext(ColorModeCtx);
  if (!ctx) throw new Error("useColorMode must be used within AppThemeProvider");
  return ctx;
};

export const AppThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [mode, setMode] = useState<"light" | "dark">(() => loadTheme());

  useEffect(() => {
    saveTheme(mode);
  }, [mode]);

  const toggle = () => setMode((m) => (m === "light" ? "dark" : "light"));

  const scTheme = mode === "light" ? lightTheme : darkTheme;

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          background: {
            default: scTheme.colors.background,
            paper: scTheme.colors.surface,
          },
          text: { primary: scTheme.colors.text },
          primary: { main: scTheme.colors.button },
        },
        shape: { borderRadius: 15 },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backdropFilter: "blur(5px)",
                border: "1px solid var(--border)",
                transition: "all 0.4s ease-in-out",
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                textTransform: "none",
                fontWeight: 500,
                transition: "background-color 0.3s ease, color 0.3s ease",
                backgroundColor: "var(--button)",
                "&:hover": { backgroundColor: "var(--button-hover)" },
              },
            },
          },
        },
      }),
    [mode]
  );

  const value = useMemo(() => ({ mode, toggle }), [mode]);

  return (
    <ColorModeCtx.Provider value={value}>
      <MUIThemeProvider theme={muiTheme}>
        <SCThemeProvider theme={scTheme}>
          <CssBaseline />
          <GlobalStyles />
          {children}
        </SCThemeProvider>
      </MUIThemeProvider>
    </ColorModeCtx.Provider>
  );
};
