/**
 * Расширяем декларацию styled-components, чтобы тема знала о своих полях.
 */
declare module "styled-components" {
  export interface DefaultTheme {
    mode: "light" | "dark";
    colors: {
      background: string;
      surface: string;
      text: string;
      border: string;
      backgroundImage: string;
      button: string;
      buttonHover: string;
    };
  }
}

/**
 * Контекст смены темы: пара значений для провайдера AppThemeProvider.
 */
export type ColorModeContext = {
  mode: "light" | "dark";
  toggle: () => void;
};

// Типы для описания темы оформления и контекста смены темы.
// Используются для типизации ThemeProvider и Styled Components.
