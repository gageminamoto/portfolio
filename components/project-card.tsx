"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import type { ProjectItem } from "@/lib/portfolio-data"
import { useTouchDevice } from "@/hooks/use-mobile"
import { useGradientWord } from "@/components/gradient-word-context"
import { DiceFallAnimation } from "@/components/hover-animations/dice-fall"
import { PotLidRattleAnimation } from "@/components/hover-animations/pot-lid-rattle"
import { GuandanCards } from "@/components/guandan-cards"

const shapes = [
  // Rounded square
  (color: string) => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <rect x="4" y="4" width="40" height="40" rx="10" fill={color} />
    </svg>
  ),
  // Circle
  (color: string) => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="20" fill={color} />
    </svg>
  ),
  // Diamond
  (color: string) => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <rect x="24" y="2" width="30" height="30" rx="4" transform="rotate(45 24 2)" fill={color} />
    </svg>
  ),
  // Pill
  (color: string) => (
    <svg width="56" height="48" viewBox="0 0 56 48" fill="none">
      <rect x="4" y="8" width="48" height="32" rx="16" fill={color} />
    </svg>
  ),
  // Triangle-ish
  (color: string) => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <path d="M24 4L44 40H4L24 4Z" fill={color} />
    </svg>
  ),
]

const colors = [
  "currentColor",
]

const BADGE_COLORS: Record<string, string> = {
  software: "oklch(0.55 0.2 250)",
  brands: "oklch(0.55 0.2 330)",
  tools: "oklch(0.55 0.2 145)",
}

export function ProjectCard({
  project,
  index = 0,
  guandanVariant = "logo",
}: {
  project: ProjectItem
  index?: number
  guandanVariant?: "logo" | "cards"
}) {
  const [badgeTilt] = useState(() => Math.random() * 14 - 7)
  const [isHovered, setIsHovered] = useState(false)
  const isTouch = useTouchDevice()
  const { activeWord } = useGradientWord()

  const shape = shapes[index % shapes.length]
  const showAnimations = !isTouch
  const isGuandan = project.name === "Guandan Rules"
  const isInteractive = Boolean(project.url)

  return (
    <div
      className={`group relative flex flex-col gap-3 overflow-hidden rounded-[1.25rem] border border-border/60 bg-card/85 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition-[transform,background-color,border-color,box-shadow] duration-150 [transition-timing-function:cubic-bezier(0.215,0.61,0.355,1)]${
        isInteractive ? " hover:-translate-y-px hover:border-[color:var(--prototype-accent)] hover:bg-background hover:shadow-[0_18px_44px_rgba(15,23,42,0.08)]" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {project.url && (
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-0 rounded-[1.25rem]"
          aria-label={project.name}
          tabIndex={0}
        />
      )}
      {(project.status === "building" || project.status === "new") && (
        <motion.span
          className="absolute -right-1.5 -top-1.5 z-10 cursor-default rounded-full px-2 py-0.5 text-[11px] font-medium text-white shadow-sm"
          style={{ backgroundColor: BADGE_COLORS[activeWord] ?? BADGE_COLORS.software }}
          initial={{ rotate: 0 }}
          animate={{ rotate: badgeTilt }}
          whileHover={{ scale: 1.1, rotate: badgeTilt * 1.5 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
        >
          {project.status === "new" ? "New" : "Building"}
        </motion.span>
      )}
      <div className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-[var(--prototype-accent)] to-transparent opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
      {showAnimations && project.name === "Yahtzee Scorecard" && (
        <DiceFallAnimation isHovered={isHovered} />
      )}
      <div className="flex h-14 items-center justify-center rounded-2xl bg-[var(--prototype-accent-soft)] text-[var(--prototype-accent)] ring-1 ring-inset ring-border/50">
        {isGuandan ? (
          guandanVariant === "cards" ? (
            <GuandanCards isHovered={isHovered} />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src="/projects/guandian-rules-logo.svg"
              alt=""
              className="h-9 w-auto"
              style={{ color: "#EA3A4B" }}
            />
          )
        ) : project.favicon ? (
          showAnimations && project.name === "Mizen" ? (
            <PotLidRattleAnimation isHovered={isHovered}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={project.favicon} alt="" width={48} height={48} className="size-12 rounded-lg" />
            </PotLidRattleAnimation>
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={project.favicon} alt="" width={40} height={40} className="size-10 rounded-lg" />
          )
        ) : (
          shape(colors[0])
        )}
      </div>
      <div className="relative z-10 flex flex-col gap-1">
        <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-foreground">{project.name}</h3>
        <p className="line-clamp-2 text-xs leading-5 text-muted-foreground [text-wrap:balance]">{project.description}</p>
      </div>
    </div>
  )
}
