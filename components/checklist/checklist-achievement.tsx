"use client"

import { motion, useReducedMotion } from "framer-motion"
import { useTheme } from "next-themes"
import { useChecklist } from "./checklist-context"

const GRADIENT_OPTIONS = [
  { id: "blue"   as const, label: "Blue",   light: "#3b82f6", dark: "#60a5fa" },
  { id: "violet" as const, label: "Violet", light: "#8b5cf6", dark: "#a78bfa" },
  { id: "peach"  as const, label: "Peach",  light: "#f97316", dark: "#fb923c" },
]

const ease = [0.23, 1, 0.32, 1] as const

export function ChecklistAchievement() {
  const { activeGradient, setActiveGradient } = useChecklist()
  const shouldReduceMotion = useReducedMotion()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <div className="flex flex-col gap-4 px-2 py-2">
      {/* Earned message */}
      <motion.p
        className="text-[13px] text-foreground"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.1 }}
      >
        You explored everything.
        <br />
        <span className="text-muted-foreground">Here, pick a vibe.</span>
      </motion.p>

      {/* Gradient swatches */}
      <motion.div
        className="flex items-center gap-2"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.25 }}
      >
        <motion.button
          onClick={() => setActiveGradient(null)}
          className="relative h-7 w-7 rounded-full border border-border bg-background"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          aria-label="Default theme"
          aria-pressed={!activeGradient}
        >
          {!activeGradient && (
            <motion.div
              layoutId="gradient-ring"
              className="absolute -inset-1 rounded-full border-2 border-foreground"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </motion.button>
        {GRADIENT_OPTIONS.map((opt) => {
          const isActive = activeGradient === opt.id
          const color = isDark ? opt.dark : opt.light
          return (
            <motion.button
              key={opt.id}
              onClick={() => setActiveGradient(opt.id)}
              className="relative h-7 w-7 rounded-full"
              style={{ backgroundColor: color }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              aria-label={`${opt.label} gradient theme`}
              aria-pressed={isActive}
            >
              {isActive && (
                <motion.div
                  layoutId="gradient-ring"
                  className="absolute -inset-1 rounded-full border-2 border-foreground"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          )
        })}
      </motion.div>
    </div>
  )
}
