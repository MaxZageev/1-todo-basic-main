/**
 * Провайдер тем оформления: объединяет Styled Components и MUI, хранит выбор светлой/тёмной темы.
 * Здесь же лежит контекст `useColorMode`, позволяющий переключать тему из любых компонентов.
 */
import React, { createContext, useContext, useMemo, useRef, useState, useEffect } from "react";
import { ThemeProvider as SCThemeProvider } from "styled-components";
import { ThemeProvider as MUIThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { GlobalStyles } from "./GlobalStyles";
import { lightTheme, darkTheme } from "./themes";
import { loadTheme, saveTheme } from "../utils/localStorage";
import type { ColorModeContext } from "../types/styles";

// Контекст даёт доступ к текущему режиму и функции переключения
const ColorModeCtx = createContext<ColorModeContext | null>(null);

export const useColorMode = () => {
  const ctx = useContext(ColorModeCtx);
  if (!ctx) throw new Error("useColorMode must be used within AppThemeProvider");
  return ctx;
};

export const AppThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  // Храним выбранный режим в состоянии, инициализируем его из localStorage
  const [mode, setMode] = useState<"light" | "dark">(() => loadTheme());

  // Предзагружаем фоновые картинки однажды, чтобы они оказались в кэше браузера до смены темы
  const backgroundsPreloaded = useRef(false);
  useEffect(() => {
    if (backgroundsPreloaded.current) return;
    if (typeof window === 'undefined') return;

    const sources = [lightTheme.colors.backgroundImage, darkTheme.colors.backgroundImage];

    sources.forEach((src) => {
      if (!src) return;

      const selector = `link[rel="preload"][href="${src}"]`;
      // Ставим preload, чтобы браузер заранее запросил изображение, даже если тема пока не активна
      if (!document.head.querySelector(selector)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      }

      // Дополнительно создаём экземпляр Image, чтобы гарантировать попадание в кэш
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
    });

    backgroundsPreloaded.current = true;
  }, []);

  // При каждом переключении темы синхронизируем значение с localStorage
  useEffect(() => {
    saveTheme(mode);
  }, [mode]);

  const toggle = () => setMode((m) => (m === "light" ? "dark" : "light"));

  // Styled Components тема: используется для глобальных стилей и CSS-переменных
  const scTheme = mode === "light" ? lightTheme : darkTheme;

  // Создаём тему MUI и прокидываем цвета из Styled Components, чтобы они совпадали
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
