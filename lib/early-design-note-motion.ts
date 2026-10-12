/** Tunable motion for the desktop hover note (early design page). */
export const EARLY_DESIGN_NOTE_MOTION = {
  enterDurationMs: 180,
  enterDurationSec: 0.18,
  exitDurationMs: 120,
  exitDurationSec: 0.12,
  swapDurationMs: 72,
  swapDurationSec: 0.072,
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
  /** Max width of the note in the right margin (px). Actual width also fits the margin. */
  noteWidthPx: 400,
  /** Delay before hiding when the pointer leaves the list (ms). */
  hideGraceMs: 75,
  /** Opacity of rows that are not under the pointer. */
  rowDimOpacity: 0.48,
  /** Row spotlight timing — kept in sync with the note (ms). */
  rowEnterDurationMs: 180,
  rowExitDurationMs: 120,
  rowSwapDurationMs: 72,
} as const

export const EARLY_DESIGN_NOTE_CSS_VARS = {
  offsetX: "--early-design-note-offset-x",
  duration: "--early-design-note-duration",
  width: "--early-design-note-width",
} as const

/** CSS transition duration for a list row’s dim, matched to note enter / exit / swap. */
export function getEarlyDesignRowTransitionMs(
  rowIndex: number,
  activeIndex: number | null,
  prevActiveIndex: number | null,
): number {
  const {
    rowEnterDurationMs,
    rowExitDurationMs,
    rowSwapDurationMs,
  } = EARLY_DESIGN_NOTE_MOTION

  if (activeIndex == null) {
    return prevActiveIndex != null ? rowExitDurationMs : 0
  }

  if (
    prevActiveIndex != null &&
    activeIndex !== prevActiveIndex
  ) {
    if (rowIndex === activeIndex || rowIndex === prevActiveIndex) {
      return rowSwapDurationMs
    }
    return 0
  }

  if (prevActiveIndex == null && rowIndex !== activeIndex) {
    return rowEnterDurationMs
  }

  return rowIndex === activeIndex ? 0 : rowEnterDurationMs
}
