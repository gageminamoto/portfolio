"use client"

import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ChecklistItemProps {
  id: string
  label: string
  checked: boolean
  onToggle: (id: string) => void
  auto?: boolean
  index?: number
}

// ease-out-quint: entering elements
const easeOut: [number, number, number, number] = [0.23, 1, 0.32, 1]

export function ChecklistItem({ id, label, checked, onToggle, auto, index = 0 }: ChecklistItemProps) {
  const shouldReduceMotion = useReducedMotion()
  const isInteractive = !(auto && checked)

  return (
    <motion.button
      type="button"
      // Stagger items entering panel — ease-out, tighter 40ms gaps
      initial={shouldReduceMotion ? false : { opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: index * 0.04, ease: easeOut }}
      onClick={() => isInteractive && onToggle(id)}
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

      <span
        className={cn(
          "text-[13px] leading-snug transition-colors duration-200",
          checked ? "text-muted-foreground" : "text-foreground",
        )}
      >
        {label}
      </span>
    </motion.button>
  )
}
