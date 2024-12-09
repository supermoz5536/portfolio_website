export const animista = {
  /* Bottom In animation */
  animation: {
    "scale-in-ver-bottom":
      "scale-in-ver-bottom 0.75s cubic-bezier(0.250, 0.460, 0.450, 0.940)   both",
  },

  /* Bottom In animation */
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
};
