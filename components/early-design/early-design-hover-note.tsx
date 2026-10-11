"use client"

import { motion, useReducedMotion } from "framer-motion"
import { EARLY_DESIGN_NOTE_MOTION } from "@/lib/early-design-note-motion"

type EarlyDesignHoverNoteProps = {
  note: string
  topPx: number
  noteId: string
}

export function EarlyDesignHoverNote({
  note,
  topPx,
  noteId,
}: EarlyDesignHoverNoteProps) {
  const shouldReduceMotion = useReducedMotion()
  const { durationSec, ease, offsetX, offsetY } = EARLY_DESIGN_NOTE_MOTION

  return (
    <motion.p
      id={noteId}
      role="note"
      aria-live="polite"
      initial={
        shouldReduceMotion ? false : { opacity: 0, x: offsetX * 0.35, y: offsetY }
      }
      animate={{ opacity: 1, x: 0, y: offsetY }}
      exit={shouldReduceMotion ? undefined : { opacity: 0, x: offsetX * 0.2 }}
      transition={{ duration: durationSec, ease }}
      className="pointer-events-none absolute left-full z-10 hidden max-w-[var(--early-design-note-max-width)] text-pretty pl-[var(--early-design-note-offset-x)] text-sm leading-relaxed text-muted-foreground lg:block"
      style={{
        top: topPx,
      }}
    >
      {note}
    </motion.p>
  )
}
