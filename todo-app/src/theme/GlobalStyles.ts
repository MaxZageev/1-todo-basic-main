/**
 * Глобальные стили приложения.
 * Используют цвета и фон из активной темы для оформления всего интерфейса.
 */
import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  :root { color-scheme: ${({ theme }) => theme.mode}; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    /* Общий фон и картинка берутся из темы, чтобы синхронно менять оформление */
    background: ${({ theme }) => theme.colors.background} url(${({ theme }) =>
      theme.colors.backgroundImage}) no-repeat center center fixed;
    background-size: cover;
    font-family: -apple-system, Arial;
    transition: background 0.5s ease-in-out, color 0.3s ease-in-out;

    --surface: ${({ theme }) => theme.colors.surface};
    --text: ${({ theme }) => theme.colors.text};
    --border: ${({ theme }) => theme.colors.border};
    --button: ${({ theme }) => theme.colors.button};
    --button-hover: ${({ theme }) => theme.colors.buttonHover};
  }

  body, input, button {
    color: var(--text);
  }
`;
