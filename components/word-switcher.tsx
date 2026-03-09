"use client"

import { useState, useRef, useLayoutEffect } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { useDialKit } from "dialkit"

interface WordSwitcherProps {
  options: string[]
  onWordChange?: (word: string) => void
}

export function WordSwitcher({ options, onWordChange }: WordSwitcherProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selected = options[selectedIndex]
  const prefersReducedMotion = useReducedMotion()

  const p = useDialKit("Word Crossfade", {
    duration: [0.24, 0.05, 1],
    yOffset: [6, 0, 20],
    blur: [4, 0, 10],
    widthDuration: [0.26, 0.1, 1],
  })

  const measureRef = useRef<HTMLSpanElement>(null)
  const [widths, setWidths] = useState<Record<string, number>>({})

  useLayoutEffect(() => {
    const measure = () => {
      if (!measureRef.current) return
      const spans = measureRef.current.children
      const newWidths: Record<string, number> = {}
      options.forEach((option, i) => {
        const el = spans[i] as HTMLElement
        if (el) newWidths[option] = el.getBoundingClientRect().width
      })
      setWidths(newWidths)
    }
    measure()
    document.fonts.ready.then(measure)
  }, [options])

  const handleToggle = () => {
    const nextIndex = (selectedIndex + 1) % options.length
    setSelectedIndex(nextIndex)
    onWordChange?.(options[nextIndex])
  }

  const currentWidth = widths[selected]

  return (
    <>
      <span
        ref={measureRef}
        aria-hidden
        className="pointer-events-none"
        style={{ position: "absolute", visibility: "hidden", whiteSpace: "nowrap" }}
      >
        {options.map((option) => (
          <span key={option} className="inline-block">{option}</span>
        ))}
      </span>

      <button
        onClick={handleToggle}
        className="inline-flex items-center rounded-md px-1 -mx-1 text-foreground underline decoration-dashed decoration-muted-foreground/50 underline-offset-[3px] transition-colors hover:decoration-foreground cursor-pointer"
      >
        <motion.span
          className="inline-flex overflow-hidden"
          animate={{ width: currentWidth || "auto" }}
          transition={{
            duration: prefersReducedMotion ? 0 : p.widthDuration,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={selected}
              className="inline-block whitespace-nowrap"
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : p.yOffset, filter: prefersReducedMotion ? "none" : `blur(${p.blur}px)` }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -p.yOffset, filter: prefersReducedMotion ? "none" : `blur(${p.blur}px)` }}
              transition={{ duration: prefersReducedMotion ? 0 : p.duration, ease: [0.23, 1, 0.32, 1] }}
              style={{ willChange: "filter, opacity, transform" }}
            >
              {selected}
            </motion.span>
          </AnimatePresence>
        </motion.span>
      </button>
    </>
  )
}
