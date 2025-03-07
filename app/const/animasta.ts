export const animista = {
  animation: {
    /* textTags "h1", "h2", "h3", "h4", "h5", "h6", "p", "span" */
    "scale-in-ver-bottom":
      "scale-in-ver-bottom 0.75s cubic-bezier(0.250, 0.460, 0.450, 0.940)   both",
    /* fade ib bottom */
    "fade-in-bottom":
      "fade-in-bottom 1.2s cubic-bezier(0.215, 0.610, 0.355, 1.000)   both",
    /* line */
    "scale-in-hor-left":
      "scale-in-hor-left 0.75s cubic-bezier(0.250, 0.460, 0.450, 0.940)   both",
    /* chart-b */
    "bounce-in-top": "bounce-in-top 1.25s ease   both",
    /* chart-l */
    "rotate-in-2-tl-ccw":
      "rotate-in-2-tl-ccw 0.75s cubic-bezier(0.250, 0.460, 0.450, 0.940)   both",
    /* chart-r */
    "rotate-in-2-fwd-ccw":
      "rotate-in-2-fwd-ccw 0.75s cubic-bezier(0.250, 0.460, 0.450, 0.940)   both",
    /* svg **/
    "scale-in-center":
      "scale-in-center 0.85s cubic-bezier(0.250, 0.460, 0.450, 0.940)   both",
    /* button */
    "scale-in-hor-center":
      "scale-in-hor-center 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940)   both",
    /* tablet */
    "text-focus-in":
      "text-focus-in 1.5s cubic-bezier(0.250, 0.460, 0.450, 0.940)    both",
    /* fade-in-left */
    "fade-in-left":
      "fade-in-left 1.5s cubic-bezier(0.230, 1.000, 0.320, 1.000)   both",
    /* scale-in-ver-top */
    "scale-in-ver-top":
      "scale-in-ver-top 1.5s cubic-bezier(0.250, 0.460, 0.450, 0.940)   both",
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
    "rotate-in-2-tl-ccw": {
      "0%": {
        transform: "rotate(45deg)",
        "transform-origin": "0 0",
        opacity: "0",
      },
      to: {
        transform: "rotate(0)",
        "transform-origin": "0 0",
        opacity: "1",
      },
    },
    /* chart-r */
    "rotate-in-2-fwd-ccw": {
      "0%": {
        transform: "translateZ(-200px) rotate(45deg)",
        opacity: "0",
      },
      to: {
        transform: "translateZ(0) rotate(0)",
        opacity: "1",
      },
    },
    /* svg **/
    "scale-in-center": {
      "0%": {
        transform: "scale(0)",
        opacity: "1",
      },
      to: {
        transform: "scale(1)",
        opacity: "1",
      },
    },
    /* button */
    "scale-in-hor-center": {
      "0%": {
        // transform: "scaleX(0)",
        transform: "translate(-50%, -50%) scaleX(0)",
        opacity: "1",
      },
      to: {
        // transform: "scaleX(1)",
        transform: "translate(-50%, -50%) scaleX(1)",
        opacity: "1",
      },
    },
    /* tablet */
    "text-focus-in": {
      "0%": {
        filter: "blur(12px)",
        opacity: "0",
      },
      to: {
        filter: "blur(0)",
        opacity: "1",
      },
    },
    /* fade-in-left */
    "fade-in-left": {
      "0%": {
        transform: "translateX(-50px)",
        opacity: "0",
      },
      to: {
        transform: "translateX(0)",
        opacity: "1",
      },
    },
    /* scale-in-ver-top */
    "scale-in-ver-top": {
      "0%": {
        transform: "scaleY(0)",
        "transform-origin": "100% 0%",
        opacity: "1",
      },
      to: {
        transform: "scaleY(1)",
        "transform-origin": "100% 0%",
        opacity: "1",
      },
    },
  },
};
