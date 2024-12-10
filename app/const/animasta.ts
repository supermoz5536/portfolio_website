export const animista = {
  animation: {
    /* Bottom In  */
    "scale-in-ver-bottom":
      "scale-in-ver-bottom 0.75s cubic-bezier(0.250, 0.460, 0.450, 0.940)   both",
    /* Bottom FadeIn */
    "fade-in-bottom":
      "fade-in-bottom 1.2s cubic-bezier(0.215, 0.610, 0.355, 1.000)   both",
    /* Left In */
    "scale-in-hor-left":
      "scale-in-hor-left 0.75s cubic-bezier(0.250, 0.460, 0.450, 0.940)   both",
  },

  keyframes: {
    /* Bottom In animation */
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
    /* Bottom FadeIn */
    "fade-in-bottom": {
      "0%": {
        transform: "translateY(50px)",
        opacity: "0",
      },
      to: {
        transform: "translateY(0)",
        opacity: "1",
      },
    },
    /* Left In */
    "scale-in-hor-left": {
      "0%": {
        transform: "scaleX(0)",
        "transform-origin": "0% 0%",
        opacity: "1",
      },
      to: {
        transform: "scaleX(1)",
        "transform-origin": "0% 0%",
        opacity: "1",
      },
    },
  },
};
