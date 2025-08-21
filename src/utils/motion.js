export const pageVariants = {
  initial: {
    opacity: 1,
  },
  in: {
    opacity: [1, 0.4, 0.7, 0.3, 0.5, 0], // fade para transparente com flicker
    transition: {
      duration: 2,
      times: [0, 0.2, 0.4, 0.6, 0.8, 1],
      ease: "easeInOut",
    },
  },
  out: {
    opacity: [0, 0.3, 0.6, 0.2, 0.5, 1], // fade para preto com flicker
    transition: {
      duration: 1,
      times: [0, 0.2, 0.4, 0.6, 0.8, 1],
      ease: "easeInOut",
    },
  },
}

export const pageStyle = {
  pointerEvents: 'none',
  position: "absolute",
  inset: 0,
  backgroundColor: "black", // cor do fundo
  zIndex: 999,
}

export const buttonVariants = {
  hidden: {
    opacity: 0,
    pointerEvents: "none"
  },
  visible: {
    opacity: 1,
    pointerEvents: "auto"
  },
}

export const pageTransition = {
  // type: "spring",
  // ease: "easeIn",
  duration: .5
}