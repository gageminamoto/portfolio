"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

interface CopyFeedbackIconProps {
  copied: boolean
  idleIcon: ReactNode
  copiedIcon: ReactNode
  className?: string
}

export function CopyFeedbackIcon({
  copied,
  idleIcon,
  copiedIcon,
  className,
}: CopyFeedbackIconProps) {
  const shouldReduceMotion = useReducedMotion()
  const transition = {
    duration: shouldReduceMotion ? 0 : 0.22,
    ease: [0.23, 1, 0.32, 1],
  } as const

  return (
    <span className={cn("relative inline-flex h-3.5 w-3.5 items-center justify-center", className)}>
      <motion.span
        className="absolute inset-0 inline-flex items-center justify-center"
        animate={{
          opacity: copied ? 0 : 1,
          scale: copied ? 0.88 : 1,
          y: copied ? -2 : 0,
        }}
        transition={transition}
        style={{ willChange: "transform, opacity" }}
      >
        {idleIcon}
      </motion.span>
      <motion.span
        className="absolute inset-0 inline-flex items-center justify-center"
        animate={{
          opacity: copied ? 1 : 0,
          scale: copied ? 1 : 0.88,
          y: copied ? 0 : 2,
        }}
        transition={transition}
        style={{ willChange: "transform, opacity" }}
      >
        {copiedIcon}
      </motion.span>
    </span>
  )
}
