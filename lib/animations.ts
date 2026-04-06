import type { Variants } from "framer-motion"

export const stagger: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.23, 1, 0.32, 1],
    },
  },
}

export const noMotion: Variants = {
  hidden: { opacity: 1, y: 0 },
  show: { opacity: 1, y: 0 },
}

/**
 * Tools page — search / filters / list block: parent ease-out entrance + staggered children.
 * Durations stay under ~300ms; easing matches animations.dev ease-out-cubic.
 */
export const toolsPanelEnter: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.26,
      ease: [0.215, 0.61, 0.355, 1],
      staggerChildren: 0.052,
      delayChildren: 0.04,
    },
  },
}

export const toolsPanelChild: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.24,
      ease: [0.215, 0.61, 0.355, 1],
    },
  },
}

/** Content swap — matches WordSwitcher blur+slide pattern for homepage section transitions. */
export const contentSwap: Variants = {
  initial: { opacity: 0, y: 6, filter: "blur(4px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.24, ease: [0.23, 1, 0.32, 1] },
  },
  exit: {
    opacity: 0,
    y: -6,
    filter: "blur(4px)",
    transition: { duration: 0.18, ease: [0.23, 1, 0.32, 1] },
  },
}

/** No-motion content swap for reduced motion preference. */
export const contentSwapNoMotion: Variants = {
  initial: { opacity: 1, y: 0 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
}

/** Stagger rows/cards inside the tools list after the panel children. */
export const toolListStagger: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.24,
      ease: [0.215, 0.61, 0.355, 1],
      staggerChildren: 0.032,
      delayChildren: 0.02,
    },
  },
}

export const toolListRow: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.22,
      ease: [0.215, 0.61, 0.355, 1],
    },
  },
}
