import type { Variants } from "framer-motion"

export const stagger: Variants = {
  hidden: {},
  show: {
    transition: {
      // Let the first item establish the page before the remaining sections
      // enter. The short stagger preserves the reading order without making
      // below-the-fold content feel late.
      delayChildren: 0.04,
      staggerChildren: 0.075,
    },
  },
}

export const fadeUp: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.23, 1, 0.32, 1],
    },
  },
}

export const noMotion: Variants = {
  hidden: { opacity: 1, y: 0 },
  show: { opacity: 1, y: 0 },
}

/**
 * Tools page — one coherent search / filters / list block entrance.
 */
export const toolsPanelEnter: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.26,
      ease: [0.215, 0.61, 0.355, 1],
    },
  },
}
