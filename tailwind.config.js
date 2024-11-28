/** @type {import('tailwindcss').Config} */
import { gray as _gray } from "tailwindcss/colors";

export const content = [
  "./index.html",
  "./src/**/*.{scss,js,ts,jsx,tsx}",
  "node_modules/@frostui/tailwindcss/dist/*.js",
];
export const darkMode = ["class", '[data-mode="dark"]'];
export const theme = {
  container: {
    center: true,
    // Padding can be added here if needed
    padding: {
      DEFAULT: "1rem",
      sm: "2rem",
      lg: "3rem",
      xl: "4rem",
    },
  },
  fontFamily: {
    sans: ["Figtree", "sans-serif"],
  },
  extend: {
    colors: {
      primary: "#3e60d5",
      secondary: "#6c757d",
      success: "#47ad77",
      info: "#16a7e9",
      warning: "#ffc35a",
      danger: "#f15776",
      light: "#f2f2f7",
      dark: "#212529",
      gray: {
        ..._gray,
        800: "#313a46",
      },
    },
    keyframes: {
      load: {
        "0%": { width: "0%" },
        "100%": { width: "100%" },
      },
    },
    minWidth: (theme) => ({
      ...theme("width"),
    }),
    maxWidth: (theme) => ({
      ...theme("width"),
    }),
    minHeight: (theme) => ({
      ...theme("height"),
    }),
    maxHeight: (theme) => ({
      ...theme("height"),
    }),
  },
};
export const plugins = [
  // eslint-disable-next-line no-undef
  require("@frostui/tailwindcss/plugin"),
  // eslint-disable-next-line no-undef
  require("@tailwindcss/forms"),
  // eslint-disable-next-line no-undef
  require("@tailwindcss/typography"),
  // eslint-disable-next-line no-undef
  require("@tailwindcss/aspect-ratio"),
];
