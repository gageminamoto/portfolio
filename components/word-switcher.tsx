"use client"

import { useState, useRef, useEffect, useLayoutEffect } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { useGradientWord } from "@/components/gradient-word-context"
import { useTouchDevice } from "@/hooks/use-mobile"
import { useClickSound } from "@/hooks/use-click-sound"

const WORD_THEME_ALIASES: Record<string, string> = {
  "Interaction designer": "tools",
  "Software designer": "software",
  "Experience designer": "brands",
}

const UNDERLINE_REVEAL_DELAY = 2000
const SWITCH_INTERVAL = 5000

interface WordSwitcherProps {
  options: string[]
  onWordChange?: (word: string) => void
  onUserClick?: (word: string) => void
}

function getThemeKey(word: string) {
  return WORD_THEME_ALIASES[word] ?? word
}

function getActiveIndex(options: string[], activeWord: string) {
  const activeThemeKey = getThemeKey(activeWord)
  return options.findIndex((option) => getThemeKey(option) === activeThemeKey)
}

export function WordSwitcher({ options, onWordChange, onUserClick }: WordSwitcherProps) {
  const prefersReducedMotion = useReducedMotion()
  const { activeWord, shaderEnabled } = useGradientWord()
  const [selectedIndex, setSelectedIndex] = useState(() => {
    const activeIndex = getActiveIndex(options, activeWord)
    return activeIndex >= 0 ? activeIndex : 0
  })
  const selectedIndexRef = useRef(selectedIndex)
  const selected = options[selectedIndex]
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
  const [progressKey, setProgressKey] = useState(0)
  const hasInteracted = useRef(false)
  const onWordChangeRef = useRef(onWordChange)
  onWordChangeRef.current = onWordChange

  useEffect(() => {
    const activeIndex = getActiveIndex(options, activeWord)
    if (activeIndex >= 0) {
      selectedIndexRef.current = activeIndex
      setSelectedIndex(activeIndex)
    }
  }, [activeWord, options])

  useEffect(() => {
    if (effectsDisabled) {
      setShowUnderline(true)
      return
    }
    const underlineTimer = setTimeout(() => {
      setProgressKey((key) => key + 1)
      setShowUnderline(true)
    }, UNDERLINE_REVEAL_DELAY)
    if (isTouchDevice) return () => clearTimeout(underlineTimer)
    let cycleTimer: ReturnType<typeof setTimeout>
    const advanceWord = () => {
      if (hasInteracted.current) return

      const nextIndex = (selectedIndexRef.current + 1) % options.length
      selectedIndexRef.current = nextIndex
      setSelectedIndex(nextIndex)
      onWordChangeRef.current?.(options[nextIndex])
      setProgressKey((key) => key + 1)
      cycleTimer = setTimeout(advanceWord, SWITCH_INTERVAL)
    }

    cycleTimer = setTimeout(advanceWord, UNDERLINE_REVEAL_DELAY + SWITCH_INTERVAL)
    return () => {
      clearTimeout(underlineTimer)
      clearTimeout(cycleTimer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectsDisabled, isTouchDevice])

  const playClick = useClickSound()

  const handleToggle = () => {
    hasInteracted.current = true
    playClick()
    const nextIndex = (selectedIndexRef.current + 1) % options.length
    selectedIndexRef.current = nextIndex
    setSelectedIndex(nextIndex)
    setProgressKey((key) => key + 1)
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
        className="group relative inline-flex items-center rounded-md px-1 -mx-1 text-foreground cursor-pointer"
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
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-x-1 bottom-[1px] h-0.5 overflow-hidden rounded-full transition-opacity duration-700 ease-out ${showUnderline ? "opacity-100" : "opacity-0"}`}
        >
          <span className="absolute inset-0 rounded-full bg-muted-foreground/25 transition-colors duration-150 group-hover:bg-primary/25" />
          <motion.span
            key={progressKey}
            className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-muted-foreground/75 transition-colors duration-150 group-hover:bg-primary"
            initial={{ scaleX: effectsDisabled || hasInteracted.current ? 1 : 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: effectsDisabled || hasInteracted.current ? 0 : SWITCH_INTERVAL / 1000, ease: "linear" }}
          />
        </span>
      </button>
    </>
  )
}
