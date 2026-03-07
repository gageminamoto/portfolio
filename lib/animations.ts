import type { Variants } from "framer-motion"
import { useReducedMotion } from "framer-motion"

export function useEntranceMotion() {
  const shouldReduceMotion = useReducedMotion()
  return {
    item: shouldReduceMotion ? noMotion : fadeUp,
    containerProps: {
      variants: shouldReduceMotion ? undefined : stagger,
      initial: "hidden" as const,
      animate: "show" as const,
    },
  }
}

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
      ease: [0.23, 1, 0.32, 1], // ease-out-quint
    },
  },
}

export const noMotion: Variants = {
  hidden: { opacity: 1, y: 0 },
  show: { opacity: 1, y: 0 },
}
