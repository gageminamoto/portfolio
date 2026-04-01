"use client"

import { useCallback } from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChecklistItemProps {
  id: string
  label: string
  hint?: string
  href?: string
  target?: string
  checked: boolean
  onToggle: (id: string) => void
  auto?: boolean
  index?: number
}

// ease-out-quint: entering elements
const easeOut: [number, number, number, number] = [0.23, 1, 0.32, 1]

const WIGGLE_CLASS = "checklist-wiggle"

export function ChecklistItem({ id, label, hint, href, target, checked, onToggle, auto, index = 0 }: ChecklistItemProps) {
  const shouldReduceMotion = useReducedMotion()
  const isInteractive = !(auto && checked)

  const startWiggle = useCallback(() => {
    if (shouldReduceMotion || !target) return
    const el = document.querySelector<HTMLElement>(target)
    if (!el) return
    el.classList.remove(WIGGLE_CLASS)
    // Force reflow so re-adding the class restarts the animation
    void el.offsetWidth
    el.classList.add(WIGGLE_CLASS)
  }, [target, shouldReduceMotion])

  const stopWiggle = useCallback(() => {
    if (!target) return
    const el = document.querySelector<HTMLElement>(target)
    el?.classList.remove(WIGGLE_CLASS)
  }, [target])

  function handleHintClick(e: React.MouseEvent) {
    e.stopPropagation()
    if (href === "#theme") {
      const btn = document.querySelector<HTMLButtonElement>('[aria-label="Display settings"]')
      btn?.click()
    }
  }

  const hintContent = hint && (
    <span
      className="inline-flex items-center gap-0.5 text-[11px] leading-snug text-muted-foreground/60 hover:text-muted-foreground transition-colors duration-150"
    >
      {hint}
      <ArrowUpRight className="h-2.5 w-2.5" />
    </span>
  )

  return (
    <motion.button
      type="button"
      // Stagger items entering panel — ease-out, tighter 40ms gaps
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.22, delay: index * 0.04, ease: easeOut }}
      onClick={() => isInteractive && onToggle(id)}
      onMouseEnter={startWiggle}
      onMouseLeave={stopWiggle}
      disabled={!isInteractive}
      className={cn(
        "group flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors duration-150",
        isInteractive && "hover:bg-accent/50 active:bg-accent/70",
      )}
    >
      {/* Check circle: fill first, then draw the tick */}
      <div className="relative flex h-4 w-4 shrink-0 items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-full border border-border"
          animate={{
            borderColor: checked ? "var(--foreground)" : "var(--border)",
            backgroundColor: checked ? "var(--foreground)" : "transparent",
          }}
          transition={{ duration: 0.18, ease: easeOut }}
        />
        <motion.svg
          viewBox="0 0 12 12"
          className="relative h-2.5 w-2.5"
          fill="none"
          stroke="var(--background)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path
            d="M2.5 6L5 8.5L9.5 3.5"
            initial={false}
            animate={{
              pathLength: checked ? 1 : 0,
              opacity: checked ? 1 : 0,
            }}
            // Delayed 80ms so circle fills before stroke draws
            transition={{
              pathLength: { duration: 0.18, delay: checked ? 0.08 : 0, ease: easeOut },
              opacity: { duration: 0.1, delay: checked ? 0.08 : 0 },
            }}
          />
        </motion.svg>
      </div>

      <span className="flex flex-col">
        <span
          className={cn(
            "text-[13px] leading-snug transition-colors duration-200",
            checked ? "text-muted-foreground" : "text-foreground",
          )}
        >
          {label}
        </span>
        {hint && href && href !== "#theme" ? (
          <Link
            href={href}
            data-checklist-hint
            onClick={(e) => e.stopPropagation()}
          >
            {hintContent}
          </Link>
        ) : hint && href === "#theme" ? (
          <span onClick={handleHintClick} className="cursor-pointer">
            {hintContent}
          </span>
        ) : hint ? (
          hintContent
        ) : null}
      </span>
    </motion.button>
  )
}
