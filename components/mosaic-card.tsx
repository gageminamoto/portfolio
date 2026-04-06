"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGradientWord } from "@/components/gradient-word-context"

export interface GalleryItem {
  name: string
  url?: string
  description: string
  year?: number
  status?: "production" | "building"
}

const BADGE_COLORS: Record<string, string> = {
  design: "oklch(0.55 0.2 250)",
  software: "oklch(0.55 0.2 250)",
  brands: "oklch(0.55 0.2 330)",
  tools: "oklch(0.55 0.2 145)",
}

const ASPECT_RATIOS = ["5/4", "16/9", "1/1"] as const

const ease = [0.215, 0.61, 0.355, 1] as const

export function MosaicCard({ project, index = 0 }: { project: GalleryItem; index?: number }) {
  const [isHovered, setIsHovered] = useState(false)

  const [badgeTilt] = useState(() => Math.random() * 14 - 7)
  const { activeWord } = useGradientWord()

  const aspectRatio = ASPECT_RATIOS[index % ASPECT_RATIOS.length]

  return (
    <div
      className="relative"
      style={{ aspectRatio, breakInside: "avoid" }}
    >
      {/* Badge sits outside the scaling container so it doesn't scale on hover */}
      {project.status === "building" && (
        <motion.span
          className="absolute -right-1.5 -top-1.5 z-20 cursor-default rounded-full px-2 py-0.5 text-[11px] font-medium text-white shadow-sm"
          style={{ backgroundColor: BADGE_COLORS[activeWord] ?? BADGE_COLORS.software }}
          initial={{ rotate: 0 }}
          animate={{ rotate: badgeTilt }}
          whileHover={{ scale: 1.1, rotate: badgeTilt * 1.5 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
        >
          Building
        </motion.span>
      )}

      <div
        className="absolute inset-0 transition-transform [transition-duration:var(--card-hover-speed,200ms)] [transition-timing-function:cubic-bezier(0.215,0.61,0.355,1)] hover:[transform:scale(var(--card-hover-scale,0.98))]"
      >
      <div
        className="group absolute inset-0 overflow-hidden rounded-xl border border-border/50 bg-card transition-[background-color,border-color,box-shadow] duration-200 [transition-timing-function:cubic-bezier(0.215,0.61,0.355,1)] hover:border-border/80 hover:bg-accent/50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 z-0 rounded-xl"
            aria-label={project.name}
            tabIndex={0}
          />
        )}

        {/* Placeholder thumbnail — fills the card */}
        <div className="absolute inset-0 bg-muted/30 dark:bg-white/[0.03]" />

        {/* Bottom content tray — slides up from below on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-x-0 bottom-0 z-[5] flex flex-col rounded-b-[11px] bg-card/90 backdrop-blur-sm dark:bg-card/80"
            initial={{ transform: "translateY(100%)" }}
            animate={{ transform: "translateY(0%)" }}
            exit={{ transform: "translateY(100%)" }}
            transition={{ duration: 0.3, ease }}
          >
            {/* Name + year bar */}
            <div className="flex w-full items-center justify-between px-3.5 py-2.5">
              <span className="text-[13px] font-semibold text-foreground">{project.name}</span>
              {project.year && (
                <span className="font-mono text-[11px] text-muted-foreground/50">{project.year}</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
      </div>
    </div>
  )
}
