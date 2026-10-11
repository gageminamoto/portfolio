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
    swapDurationMs,
    ease,
    offsetX,
    offsetY,
    enterOffsetXRatio,
    exitOffsetXRatio,
  } = EARLY_DESIGN_NOTE_MOTION

  const enterOffset = offsetX * enterOffsetXRatio
  const exitOffset = offsetX * exitOffsetXRatio
  const easeCss = `cubic-bezier(${ease.join(", ")})`

  return (
    <motion.p
      id={noteId}
      role="note"
      aria-live="polite"
      initial={
        shouldReduceMotion
          ? false
          : { opacity: 0, x: enterOffset, y: offsetY }
      }
      animate={{ opacity: 1, x: 0, y: offsetY }}
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
            }
      }
      className="pointer-events-none absolute left-full z-10 box-border hidden w-[var(--early-design-note-width)] pl-[var(--early-design-note-offset-x)] text-sm leading-relaxed text-muted-foreground lg:block"
      style={{
        top: topPx,
        transition: shouldReduceMotion
          ? undefined
          : `top ${swapDurationMs}ms ${easeCss}`,
      }}
    >
      <span className="grid w-full [&>*]:col-start-1 [&>*]:row-start-1">
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
            className="block w-full"
          >
            {note}
          </motion.span>
        </AnimatePresence>
      </span>
    </motion.p>
  )
}
