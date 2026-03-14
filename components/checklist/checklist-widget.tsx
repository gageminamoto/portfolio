"use client"

import { useEffect, useRef } from "react"
import { X, RotateCcw } from "lucide-react"
import { motion, AnimatePresence, LayoutGroup, useReducedMotion } from "framer-motion"
import { useChecklist, CHECKLIST_ITEMS } from "./checklist-context"
import { ChecklistItem } from "./checklist-item"
import { ChecklistAchievement } from "./checklist-achievement"

const AUTO_ITEMS = new Set(CHECKLIST_ITEMS.map((item) => item.id))

const PROGRESS_MESSAGES = [
  "While you\u2019re here\u2026",
  "On your way",
  "Almost there",
  "Nice one",
] as const

// Layout morph: fluid, barely-bouncy spring — panel and pill share the same shape
const layoutSpring = { type: "spring", duration: 0.45, bounce: 0.05 } as const
// Dot expand/contract: softer, liquid-fill feel
const dotSpring = { type: "spring", stiffness: 250, damping: 22 } as const
// Standard ease-out for entering elements
const easeOut: [number, number, number, number] = [0.23, 1, 0.32, 1]

export function ChecklistWidget() {
  const {
    checked,
    toggleItem,
    isOpen,
    setIsOpen,
    dismissed,
    restart,
    resetKey,
    progress,
    achievementUnlocked,
    mounted,
  } = useChecklist()
  const shouldReduceMotion = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)

  // Click outside → minimize (collapse to pill)
  useEffect(() => {
    if (!isOpen) return
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    const id = requestAnimationFrame(() => {
      document.addEventListener("mousedown", handleClick)
    })
    return () => {
      cancelAnimationFrame(id)
      document.removeEventListener("mousedown", handleClick)
    }
  }, [isOpen, setIsOpen])

  if (!mounted) return null

  const { completed, total } = progress
  const message = PROGRESS_MESSAGES[Math.min(completed, PROGRESS_MESSAGES.length - 1)]

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6"
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.96, y: 8, filter: "blur(4px)" }
          }
          transition={{ duration: 0.2, ease: easeOut }}
          style={{ transformOrigin: "bottom right" }}
        >
      <LayoutGroup>
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              ref={panelRef}
              key="panel"
              layoutId={shouldReduceMotion ? undefined : "checklist-container"}
              initial={shouldReduceMotion ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
              transition={{ layout: layoutSpring, opacity: { duration: 0.12 } }}
              className="w-[calc(100vw-2rem)] origin-bottom-right overflow-hidden rounded-2xl border border-border/60 bg-background shadow-xl sm:w-72"
              style={{ borderRadius: 16 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 pb-1 pt-3">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={message}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    transition={{ duration: 0.2, ease: easeOut }}
                    className="text-[13px] font-medium text-foreground"
                  >
                    {message}
                  </motion.span>
                </AnimatePresence>
                <div className="flex items-center gap-0.5">
                  <AnimatePresence>
                    {completed > 0 && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.75 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.75 }}
                        transition={{ duration: 0.15, ease: easeOut }}
                        onClick={restart}
                        className="inline-flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground/60 transition-colors duration-150 hover:text-foreground"
                        aria-label="Start over"
                      >
                        <RotateCcw className="h-3 w-3" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="inline-flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground/60 transition-colors duration-150 hover:text-foreground"
                    aria-label="Minimize checklist"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Progress dots */}
              <div className="flex items-center gap-1 px-4 pb-3">
                {Array.from({ length: total }, (_, i) => (
                  <motion.div
                    key={i}
                    className="h-1 rounded-full"
                    initial={false}
                    animate={{
                      width: i < completed ? 16 : 8,
                      backgroundColor: i < completed
                        ? "var(--foreground)"
                        : "var(--border)",
                    }}
                    transition={dotSpring}
                  />
                ))}
              </div>

              {/* Content — items or achievement */}
              <div className="relative px-2 pb-3">
                <AnimatePresence initial={false} mode="wait">
                  {achievementUnlocked ? (
                    <motion.div
                      key="achievement"
                      initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.22, ease: easeOut }}
                    >
                      <ChecklistAchievement />
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`items-${resetKey}`}
                      initial={shouldReduceMotion ? false : { opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.22, ease: easeOut }}
                      className="flex flex-col"
                    >
                      {CHECKLIST_ITEMS.map((item, index) => (
                        <ChecklistItem
                          key={item.id}
                          id={item.id}
                          label={item.label}
                          checked={!!checked[item.id]}
                          onToggle={toggleItem}
                          auto={AUTO_ITEMS.has(item.id)}
                          index={index}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="trigger"
              layoutId={shouldReduceMotion ? undefined : "checklist-container"}
              initial={shouldReduceMotion ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
              transition={{ layout: layoutSpring, opacity: { duration: 0.12 } }}
              onClick={() => setIsOpen(true)}
              className="group inline-flex items-center gap-2 overflow-hidden rounded-2xl border border-border/60 bg-background px-3 py-2.5 shadow-lg transition-shadow duration-200 hover:shadow-xl"
              style={{ borderRadius: 16 }}
              aria-label="Site exploration checklist"
              aria-expanded={false}
            >
              <div className="flex items-center gap-0.5">
                {Array.from({ length: total }, (_, i) => (
                  <motion.div
                    key={i}
                    className="h-1 rounded-full"
                    animate={{
                      width: i < completed ? 8 : 4,
                      backgroundColor: i < completed
                        ? "var(--foreground)"
                        : "var(--border)",
                    }}
                    transition={dotSpring}
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-muted-foreground transition-colors duration-150 group-hover:text-foreground">
                {completed}/{total}
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </LayoutGroup>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
