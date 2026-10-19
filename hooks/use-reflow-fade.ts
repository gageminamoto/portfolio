"use client"

import { useEffect, type RefObject } from "react"
import { useReducedMotion } from "motion/react"

/* ─────────────────────────────────────────────────────────
 * REFLOW FADE STORYBOARD
 *
 * Read top-to-bottom. Each value is ms after the role word
 * starts changing (the word's own width morph is handled by torph).
 *
 *    0ms   role word begins resizing; trailing text reflows with it
 *   ~Nms   a word or link lands on a different line (caught that frame)
 *   +40    it fades in at its new spot (no travel)
 *  +300    fully visible
 * ───────────────────────────────────────────────────────── */

const REFLOW = {
  duration: 260, // ms for the fade
  delay: 40, // ms before the fade starts
  ease: "ease-out",
  minLineShift: 8, // px of vertical jump that counts as a line change
}

export const REFLOW_ATTR = "data-reflow"

/**
 * When `watchSelector` (the morphing role word) changes size, text around it
 * reflows and words hop between lines. Torph animates the word itself; this
 * hook fades in every `[data-reflow]` item that lands on a new line instead
 * of letting it snap.
 */
export function useReflowFade(
  containerRef: RefObject<HTMLElement | null>,
  watchSelector: string,
) {
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let layout = new Map<HTMLElement, number>()

    const measure = () => {
      const top = container.getBoundingClientRect().top
      const next = new Map<HTMLElement, number>()
      container.querySelectorAll<HTMLElement>(`[${REFLOW_ATTR}]`).forEach((el) => {
        next.set(el, el.getBoundingClientRect().top - top)
      })
      return next
    }

    const check = () => {
      const next = measure()
      if (!reduceMotion) {
        next.forEach((y, el) => {
          const prev = layout.get(el)
          if (prev === undefined || Math.abs(y - prev) < REFLOW.minLineShift) return
          el.getAnimations().forEach((a) => a.cancel())
          el.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: REFLOW.duration,
            delay: REFLOW.delay,
            easing: REFLOW.ease,
            fill: "backwards",
          })
        })
      }
      layout = next
    }

    const resetBaseline = () => {
      layout = measure()
    }

    resetBaseline()
    void document.fonts?.ready.then(resetBaseline)

    const watched = container.querySelector(watchSelector)
    const observer = new ResizeObserver(check)
    if (watched) observer.observe(watched)

    // A window resize also reflows text; re-baseline so the next word
    // change doesn't fade from stale positions.
    window.addEventListener("resize", resetBaseline)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", resetBaseline)
    }
  }, [containerRef, watchSelector, reduceMotion])
}
