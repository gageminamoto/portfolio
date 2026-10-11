/** Tunable motion for the desktop hover note (early design page). */
export const EARLY_DESIGN_NOTE_MOTION = {
  enterDurationMs: 180,
  enterDurationSec: 0.18,
  exitDurationMs: 120,
  exitDurationSec: 0.12,
  swapDurationMs: 64,
  swapDurationSec: 0.064,
  /** Strong ease-out (no ease-in). */
  ease: [0.23, 1, 0.32, 1] as [number, number, number, number],
  /** Distance from the list’s right edge (px). */
  offsetX: 12,
  /** Enter starts this fraction of `offsetX` to the right (~6px at 12). */
  enterOffsetXRatio: 0.5,
  /** Exit ends this fraction of `offsetX` to the right (~4px at 12). */
  exitOffsetXRatio: 0.33,
  /** Extra vertical nudge from the row top (px). */
  offsetY: 0,
  /** Width of the desktop note column (px); list + note share a wider page on lg. */
  noteWidthPx: 400,
  /** Delay before hiding when the pointer leaves the list (ms). */
  hideGraceMs: 75,
} as const

export const EARLY_DESIGN_NOTE_CSS_VARS = {
  offsetX: "--early-design-note-offset-x",
  duration: "--early-design-note-duration",
  width: "--early-design-note-width",
} as const
