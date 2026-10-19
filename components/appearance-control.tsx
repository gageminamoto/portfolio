"use client"

import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useTheme } from "next-themes"
import { useGradientWord } from "@/components/gradient-word-context"
import { useMounted } from "@/hooks/use-mounted"
import { IconColor, IconMoon, IconSun } from "@/components/site-icons"

const COLOR_OPTIONS = [
  { word: "software", label: "Software", hue: 250 },
  { word: "brands", label: "Brands", hue: 330 },
  { word: "tools", label: "Tools", hue: 145 },
] as const

const WORD_ALIASES: Record<string, string> = {
  "Software designer": "software",
  "Experience designer": "brands",
  "Interaction designer": "tools",
}

function colorKey(word: string) {
  return WORD_ALIASES[word] ?? word
}

export function AppearanceControl() {
  const { resolvedTheme, setTheme } = useTheme()
  const { activeWord, setActiveWord } = useGradientWord()
  const mounted = useMounted()
  const reduceMotion = useReducedMotion()

  const mode = resolvedTheme === "dark" ? "dark" : "light"
  const activeColor = colorKey(activeWord)
  const colorIndex = Math.max(
    0,
    COLOR_OPTIONS.findIndex((option) => option.word === activeColor),
  )
  const color = COLOR_OPTIONS[colorIndex] ?? COLOR_OPTIONS[0]
  const ThemeIcon = mode === "dark" ? IconMoon : IconSun

  function toggleTheme(event: React.MouseEvent<HTMLButtonElement>) {
    const next = mode === "dark" ? "light" : "dark"
    const root = document.documentElement

    const apply = () => {
      root.classList.remove("light", "dark")
      root.classList.add(next)
      root.style.colorScheme = next
      setTheme(next)
    }

    const reveal = document.startViewTransition?.bind(document)
    if (reduceMotion || !reveal) {
      apply()
      return
    }

    const rect = event.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    const startRadius = Math.hypot(rect.width, rect.height) / 2
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    )

    const transition = reveal(() => {
      apply()
    })

    transition.ready.then(() => {
      root.animate(
        {
          clipPath: [
            `circle(${startRadius}px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 450,
          easing: "cubic-bezier(0.32, 0.72, 0, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      )
    })
  }

  function cycleColor() {
    const next = COLOR_OPTIONS[(colorIndex + 1) % COLOR_OPTIONS.length]
    setActiveWord(next.word)
  }

  const pillClass =
    "inline-flex size-8 cursor-pointer items-center justify-center border-none bg-neutral-100 text-neutral-800 shadow-none transition-colors hover:bg-neutral-200/80 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-white/10 dark:text-neutral-100 dark:hover:bg-white/16"

  return (
    <div className="fixed right-4 bottom-4 z-40 flex items-center gap-1">
      {mounted ? (
        <>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={mode === "dark" ? "Dark" : "Light"}
            style={{
              borderTopLeftRadius: 999,
              borderBottomLeftRadius: 999,
              borderTopRightRadius: 2,
              borderBottomRightRadius: 2,
            }}
            className={pillClass}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mode}
                className="flex"
                initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.16 }}
              >
                <ThemeIcon className="size-3.5" />
              </motion.span>
            </AnimatePresence>
          </button>
          <button
            type="button"
            onClick={cycleColor}
            aria-label={`Color: ${color.label}. Click to change.`}
            style={{
              borderTopLeftRadius: 2,
              borderBottomLeftRadius: 2,
              borderTopRightRadius: 999,
              borderBottomRightRadius: 999,
            }}
            className={pillClass}
          >
            {/* One icon for every color; only its tint changes. */}
            <IconColor
              className="size-3.5 transition-colors duration-200 ease-out motion-reduce:transition-none"
              style={{ color: `oklch(0.62 0.16 ${color.hue})` }}
            />
          </button>
        </>
      ) : (
        <>
          <div
            aria-hidden
            className="size-8 bg-neutral-100 dark:bg-white/10"
            style={{
              borderTopLeftRadius: 999,
              borderBottomLeftRadius: 999,
              borderTopRightRadius: 2,
              borderBottomRightRadius: 2,
            }}
          />
          <div
            aria-hidden
            className="size-8 bg-neutral-100 dark:bg-white/10"
            style={{
              borderTopLeftRadius: 2,
              borderBottomLeftRadius: 2,
              borderTopRightRadius: 999,
              borderBottomRightRadius: 999,
            }}
          />
        </>
      )}
    </div>
  )
}
