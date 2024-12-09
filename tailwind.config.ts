import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

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

      /* Bottom animation */
      animation: {
        "scale-in-ver-bottom":
          "scale-in-ver-bottom 0.75s cubic-bezier(0.250, 0.460, 0.450, 0.940)   both",
      },
      /* Bottom animation */
      keyframes: {
        "scale-in-ver-bottom": {
          "0%": {
            transform: "scaleY(0)",
            "transform-origin": "0% 100%",
            opacity: "0",
          },
          to: {
            transform: "scaleY(1)",
            "transform-origin": "0% 100%",
            opacity: "1",
          },
        },
      },
    },
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
