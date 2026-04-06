"use client"

import { useState, useRef, useEffect, useLayoutEffect } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { useGradientWord } from "@/components/gradient-word-context"
import { useTouchDevice } from "@/hooks/use-mobile"
import { useClickSound } from "@/hooks/use-click-sound"

interface WordSwitcherProps {
  options: string[]
  onWordChange?: (word: string) => void
  onUserClick?: (word: string) => void
}

export function WordSwitcher({ options, onWordChange, onUserClick }: WordSwitcherProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selected = options[selectedIndex]
  const prefersReducedMotion = useReducedMotion()
  const { shaderEnabled } = useGradientWord()
  const isTouchDevice = useTouchDevice()
  const effectsDisabled = prefersReducedMotion || !shaderEnabled

  const p = {
    duration: 0.24,
    yOffset: 6,
    blur: 4,
    widthDuration: 0.26,
  }

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

  const [showUnderline, setShowUnderline] = useState(!!effectsDisabled)
  const hasInteracted = useRef(false)
  const onWordChangeRef = useRef(onWordChange)
  onWordChangeRef.current = onWordChange

  // Find the index of "design" — the cycle target where auto-rotation stops
  const designIndex = options.indexOf("design")
  const stopIndex = designIndex >= 0 ? designIndex : 0

  useEffect(() => {
    if (effectsDisabled) {
      setShowUnderline(true)
      // Jump straight to the stop word when effects are disabled
      if (stopIndex !== 0) {
        setSelectedIndex(stopIndex)
        onWordChangeRef.current?.(options[stopIndex])
      }
      return
    }
    const underlineTimer = setTimeout(() => setShowUnderline(true), 2000)
    if (isTouchDevice) return () => clearTimeout(underlineTimer)
    const cycleTimers: ReturnType<typeof setTimeout>[] = []
    const startDelay = 3500
    const interval = 5000
    // Cycle through options and stop at "design" instead of looping
    const stepsToDesign = stopIndex === 0 ? options.length : stopIndex
    for (let i = 0; i < stepsToDesign; i++) {
      cycleTimers.push(
        setTimeout(() => {
          if (!hasInteracted.current) {
            const nextIndex = (i + 1) % options.length
            setSelectedIndex(nextIndex)
            onWordChangeRef.current?.(options[nextIndex])
          }
        }, startDelay + i * interval)
      )
    }
    return () => {
      clearTimeout(underlineTimer)
      cycleTimers.forEach(clearTimeout)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectsDisabled, isTouchDevice])

  const playClick = useClickSound()

  const handleToggle = () => {
    hasInteracted.current = true
    playClick()
    const nextIndex = (selectedIndex + 1) % options.length
    setSelectedIndex(nextIndex)
    onWordChange?.(options[nextIndex])
    onUserClick?.(options[nextIndex])
  }

  const currentWidth = widths[selected]

  return (
    <>
      <span
        ref={measureRef}
        aria-hidden
        className="pointer-events-none"
        style={{ position: "fixed", visibility: "hidden", whiteSpace: "nowrap", top: 0, left: 0 }}
      >
        {options.map((option) => (
          <span key={option} className="inline-block">{option}</span>
        ))}
      </span>

      <button
        onClick={handleToggle}
        className={`inline-flex items-center rounded-md px-1 -mx-1 text-foreground underline decoration-dashed underline-offset-[3px] cursor-pointer transition-[text-decoration-color] duration-700 ease-out ${showUnderline ? "decoration-muted-foreground/50 hover:decoration-foreground" : "decoration-transparent"}`}
      >
        <motion.span
          className="inline-flex overflow-hidden"
          animate={{ width: currentWidth || "auto" }}
          transition={{
            duration: effectsDisabled ? 0 : p.widthDuration,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={selected}
              className="inline-block whitespace-nowrap"
              initial={{ opacity: 0, y: effectsDisabled ? 0 : p.yOffset, filter: effectsDisabled ? "none" : `blur(${p.blur}px)` }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: effectsDisabled ? 0 : -p.yOffset, filter: effectsDisabled ? "none" : `blur(${p.blur}px)` }}
              transition={{ duration: effectsDisabled ? 0 : p.duration, ease: [0.23, 1, 0.32, 1] }}
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
