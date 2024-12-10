import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import { animista } from "./app/const/animasta";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        archivo: ["Archivo Black", "sans-serif"],
      },
    },
    animation: animista.animation,
    keyframes: animista.keyframes,
    screens: {
      "my-sm": "720px",
      "my-md": "880px",
      "my-lg": "960px",
      "lg-2": "1080px",
      "xl-2": "1340px",
      "xl-3": "1420px",
      "my-2xl": "1510px",
      ...defaultTheme.screens,
    },
  },
  plugins: [],
} satisfies Config;
