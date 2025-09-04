import type { DefaultTheme } from "styled-components";
import liteBg from "../assets/img/liteBg.jpg";
import darkBg from "../assets/img/darkBg.jpg";

export const lightTheme: DefaultTheme = {
  mode: "light",
  colors: {
    background: "#fdfbf8",
    surface: "rgba(255,255,255,0.7)",
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
    button: "#3a82f6",
    buttonHover: "#2563eb",
  },
};
