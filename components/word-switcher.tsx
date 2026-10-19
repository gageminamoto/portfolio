"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { TextMorph } from "torph/react"
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

export function resolveSwitcherWord(options: string[], activeWord: string) {
  const index = getActiveIndex(options, activeWord)
  return options[index >= 0 ? index : 0] ?? ""
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

  const [showUnderline, setShowUnderline] = useState(!!effectsDisabled)
  const [progressKey, setProgressKey] = useState(0)
  const hasInteracted = useRef(false)
  const onWordChangeRef = useRef(onWordChange)
  onWordChangeRef.current = onWordChange

  useEffect(() => {
    const activeIndex = getActiveIndex(options, activeWord)
    if (activeIndex < 0) return
    // The rotation updates selectedIndexRef before reporting a word, so a
    // mismatch means someone else picked it (e.g. the color control). Treat
    // that as a manual choice: stop rotating and show the bar as full.
    if (activeIndex !== selectedIndexRef.current) {
      hasInteracted.current = true
      setProgressKey((key) => key + 1)
    }
    selectedIndexRef.current = activeIndex
    setSelectedIndex(activeIndex)
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

  return (
    <>
      <button
        onClick={handleToggle}
        className="group relative inline cursor-pointer rounded-md px-1 -mx-1 text-foreground"
      >
        <TextMorph
          disabled={!!effectsDisabled}
          ease={{ stiffness: 260, damping: 26 }}
          className="role-morph whitespace-nowrap align-baseline"
          style={{ verticalAlign: "baseline" }}
        >
          {selected}
        </TextMorph>
        <span
          aria-hidden
          data-no-markdown
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
