export const animista = {
  animation: {
    /* textTags "h1", "h2", "h3", "h4", "h5", "h6", "p", "span" */
    "scale-in-ver-bottom":
      "scale-in-ver-bottom 0.75s cubic-bezier(0.250, 0.460, 0.450, 0.940)   both",
    /* chart-r */
    "fade-in-bottom":
      "fade-in-bottom 1.2s cubic-bezier(0.215, 0.610, 0.355, 1.000)   both",
    /* line */
    "scale-in-hor-left":
      "scale-in-hor-left 0.75s cubic-bezier(0.250, 0.460, 0.450, 0.940)   both",
    /* chart-b */
    "bounce-in-top": "bounce-in-top 1.25s ease   both",
    /* chart-l */
    "slide-in-tl":
      "slide-in-tl 0.75s cubic-bezier(0.250, 0.460, 0.450, 0.940)   both",
  },

  keyframes: {
    /* textTags "h1", "h2", "h3", "h4", "h5", "h6", "p", "span" */
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
    /* chart-r */
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
    /* line */
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
    /* chart-b */
    "bounce-in-top": {
      "0%": {
        transform: "translateY(-500px)",
        "animation-timing-function": "ease-in",
        opacity: "0",
      },
      "38%": {
        transform: "translateY(0)",
        "animation-timing-function": "ease-out",
        opacity: "1",
      },
      "55%": {
        transform: "translateY(-65px)",
        "animation-timing-function": "ease-in",
      },
      "72%,90%,to": {
        transform: "translateY(0)",
        "animation-timing-function": "ease-out",
      },
      "81%": {
        transform: "translateY(-28px)",
      },
      "95%": {
        transform: "translateY(-8px)",
        "animation-timing-function": "ease-in",
      },
    },
    /* chart-l */
    "slide-in-tl": {
      "0%": {
        transform: "translateY(-1000px) translateX(-1000px)",
        opacity: "0",
      },
      to: {
        transform: "translateY(0) translateX(0)",
        opacity: "1",
      },
    },
  },
};
