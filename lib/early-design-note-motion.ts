/** Tunable motion for the desktop hover note (early design page). */
export const EARLY_DESIGN_NOTE_MOTION = {
  durationMs: 150,
  durationSec: 0.15,
  ease: "easeOut" as const,
  /** Distance from the list’s right edge (px). */
  offsetX: 12,
  /** Extra vertical nudge from the row top (px). */
  offsetY: 0,
  /** Max width of the note column (px). */
  maxWidthPx: 256,
} as const

export const EARLY_DESIGN_NOTE_CSS_VARS = {
  offsetX: "--early-design-note-offset-x",
  duration: "--early-design-note-duration",
  maxWidth: "--early-design-note-max-width",
} as const
