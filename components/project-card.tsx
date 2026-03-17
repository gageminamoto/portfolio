"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import type { ProjectItem } from "@/lib/portfolio-data"

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

export function ProjectCard({ project, index = 0 }: { project: ProjectItem; index?: number }) {
  const [badgeTilt] = useState(() => Math.random() * 14 - 7)

  const Wrapper = project.url ? "a" : "div"
  const linkProps = project.url
    ? { href: project.url, target: "_blank" as const, rel: "noopener noreferrer" }
    : {}

  const shape = shapes[index % shapes.length]

  return (
    <Wrapper
      {...linkProps}
      className="group relative flex flex-col gap-2 rounded-xl border border-border/50 p-5 transition-colors hover:bg-muted/50"
    >
      {project.status === "building" && (
        <motion.span
          className="absolute -right-1.5 -top-1.5 z-10 cursor-default rounded-full bg-[#3A81F5] px-2 py-0.5 text-[11px] font-medium text-white shadow-sm"
          initial={{ rotate: 0 }}
          animate={{ rotate: badgeTilt }}
          whileHover={{ scale: 1.1, rotate: badgeTilt * 1.5 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
        >
          Building
        </motion.span>
      )}
      <div className="flex h-16 items-center justify-center text-muted-foreground/20">
        {project.favicon ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={project.favicon} alt="" className="size-10 rounded-lg" />
        ) : (
          shape(colors[0])
        )}
      </div>
      <h3 className="text-base font-medium text-foreground">{project.name}</h3>
      <p className="text-sm text-muted-foreground">{project.description}</p>
    </Wrapper>
  )
}
