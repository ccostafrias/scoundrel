export const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.8 // Começa um pouco menor (para zoom in)
  },
  in: {
    opacity: 1,
    scale: 1 // Vai para o tamanho normal
  },
  out: {
    opacity: 0,
    scale: 0.6 // Zoom out um pouco ao sair
  }

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
  type: "spring",
  ease: "easeIn",
  duration: 0.3
}