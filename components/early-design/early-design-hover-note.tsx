"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { EARLY_DESIGN_NOTE_MOTION } from "@/lib/early-design-note-motion"

type EarlyDesignHoverNoteProps = {
  note: string
  topPx: number
  noteId: string
  rowKey: number
}

export function EarlyDesignHoverNote({
  note,
  topPx,
  noteId,
  rowKey,
}: EarlyDesignHoverNoteProps) {
  const shouldReduceMotion = useReducedMotion()
  const {
    enterDurationSec,
    exitDurationSec,
    swapDurationSec,
    ease,
    offsetX,
    offsetY,
    enterOffsetXRatio,
    exitOffsetXRatio,
  } = EARLY_DESIGN_NOTE_MOTION

  const enterOffset = offsetX * enterOffsetXRatio
  const exitOffset = offsetX * exitOffsetXRatio

  return (
    <motion.p
      id={noteId}
      role="note"
      aria-live="polite"
      initial={
        shouldReduceMotion
          ? false
          : { opacity: 0, x: enterOffset, y: offsetY, top: topPx }
      }
      animate={{ opacity: 1, x: 0, y: offsetY, top: topPx }}
      exit={
        shouldReduceMotion
          ? undefined
          : {
              opacity: 0,
              x: exitOffset,
              transition: { duration: exitDurationSec, ease },
            }
      }
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : {
              opacity: { duration: enterDurationSec, ease },
              x: { duration: enterDurationSec, ease },
              y: { duration: enterDurationSec, ease },
              top: { duration: swapDurationSec, ease },
            }
      }
      className="pointer-events-none absolute left-full z-10 hidden max-w-[var(--early-design-note-max-width)] text-pretty pl-[var(--early-design-note-offset-x)] text-sm leading-relaxed text-muted-foreground lg:block"
    >
      <AnimatePresence mode="sync" initial={false}>
        <motion.span
          key={rowKey}
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0 : swapDurationSec,
            ease,
          }}
          className="block"
        >
          {note}
        </motion.span>
      </AnimatePresence>
    </motion.p>
  )
}
