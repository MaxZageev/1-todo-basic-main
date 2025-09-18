import type { DefaultTheme } from "styled-components";
import liteBg from "../assets/img/liteBg.jpg";
import darkBg from "../assets/img/darkBg.jpg";

/**
 * Описания светлой и тёмной тем: храним базовые цвета и фоновые изображения.
 * Эти объекты попадают в Styled Components и через CSS-переменные используются по всему приложению.
 */
export const lightTheme: DefaultTheme = {
  mode: "light",
  colors: {
    background: "#f5feffd8",
    surface: "rgba(255, 255, 255, 0.54)",
    text: "#3a2f25",
    border: "rgba(120,100,80,0.3)",
    backgroundImage: liteBg,
    button: "#d4a373",
    buttonHover: "#b5835a",
  },
};

export const darkTheme: DefaultTheme = {
  mode: "dark",
  colors: {
    background: "#0e141b",
    surface: "rgba(20,30,45,0.6)",
    text: "#f0f4f9",
    border: "rgba(200,220,255,0.2)",
    backgroundImage: darkBg,
    button: "#8c3af6ff",
    buttonHover: "#8c3af6d8",
  },
};
