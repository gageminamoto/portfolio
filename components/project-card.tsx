"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Copy, Github, Check } from "lucide-react"
import type { ProjectItem } from "@/lib/portfolio-data"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"

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

function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase()
}

export function ProjectCard({ project, index = 0 }: { project: ProjectItem; index?: number }) {
  const [badgeTilt] = useState(() => Math.random() * 14 - 7)
  const [copied, setCopied] = useState(false)

  const Wrapper = project.url ? "a" : "div"
  const linkProps = project.url
    ? { href: project.url, target: "_blank" as const, rel: "noopener noreferrer" }
    : {}

  const shape = shapes[index % shapes.length]

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (project.url) {
      navigator.clipboard.writeText(project.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const iconBtnClass = "flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"

  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>
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
            {shape(colors[0])}
          </div>
          <h3 className="text-base font-medium text-foreground">{project.name}</h3>
          <p className="text-sm text-muted-foreground">{project.description}</p>
        </Wrapper>
      </HoverCardTrigger>
      <HoverCardContent side="top" align="center" sideOffset={8} className="w-64 p-0 overflow-hidden">
        {project.image && (
          <div className="aspect-[16/10] w-full overflow-hidden bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.image}
              alt={`${project.name} preview`}
              className="size-full object-cover"
            />
          </div>
        )}
        <div className="flex items-center justify-between gap-2 px-3 py-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{project.name}</p>
            {project.collaborators && project.collaborators.length > 0 && (
              <TooltipProvider delayDuration={0}>
                <div className="flex -space-x-1.5 shrink-0">
                  {project.collaborators.map((c) => (
                    <Tooltip key={c.name}>
                      <TooltipTrigger asChild>
                        <span>
                          <Avatar className="size-5 border border-popover">
                            <AvatarImage src={c.avatarUrl} alt={c.name} />
                            <AvatarFallback className="text-[8px]">{getInitials(c.name)}</AvatarFallback>
                          </Avatar>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        {c.name}
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </TooltipProvider>
            )}
          </div>
          <div className="flex items-center shrink-0">
            {project.url && (
              <button onClick={handleCopyLink} className={iconBtnClass} aria-label="Copy link">
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              </button>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={iconBtnClass}
                aria-label="View on GitHub"
              >
                <Github className="size-3.5" />
              </a>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
