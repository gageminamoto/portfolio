import type { CSSProperties } from "react"

/**
 * Custom ease-in-out (quart) from the animations.dev / Emil Kowalski easing blueprint —
 * on-screen motion (padding, opacity, color) vs default CSS ease-in-out.
 * @see https://animations.dev/learn/easing-curves
 */
export const HOVER_EASE_IN_OUT = "cubic-bezier(0.77, 0, 0.175, 1)"

/** Default duration (ms) for fluid-hover row padding + highlight transitions. */
export const HOVER_DURATION_MS = 100

export const fluidHoverPadStyle: CSSProperties = {
  transitionDuration: `${HOVER_DURATION_MS}ms`,
  transitionTimingFunction: HOVER_EASE_IN_OUT,
}

export const fluidHoverTextStyle: CSSProperties = {
  transitionDuration: `${HOVER_DURATION_MS}ms`,
  transitionTimingFunction: HOVER_EASE_IN_OUT,
}

export const fluidHoverHighlightStyle: CSSProperties = {
  transitionDuration: `${HOVER_DURATION_MS}ms`,
  transitionTimingFunction: HOVER_EASE_IN_OUT,
}
