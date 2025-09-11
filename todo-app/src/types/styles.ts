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

export type ColorModeContext = {
  mode: "light" | "dark";
  toggle: () => void;
};