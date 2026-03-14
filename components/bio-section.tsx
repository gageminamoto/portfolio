"use client"

import React, { useState } from "react"
import { Copy, Github, Check } from "lucide-react"
import { HoverLink } from "@/components/hover-link"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { WordSwitcher } from "@/components/word-switcher"
import { portfolioData } from "@/lib/portfolio-data"
import type { ProjectItem } from "@/lib/portfolio-data"

interface BioLink {
  text: string
  url: string
}

interface BioSwitcher {
  options: string[]
}

type BioPart = string | BioLink | BioSwitcher

// Parse bio string for links [text](url) and switchers {opt1|opt2|...}
function parseBio(bio: string): BioPart[] {
  const tokenRegex = /\[([^\]]+)\]\(([^)]+)\)|\{([^}]+)\}/g
  const parts: BioPart[] = []
  let lastIndex = 0
  let match

  while ((match = tokenRegex.exec(bio)) !== null) {
    if (match.index > lastIndex) {
      parts.push(bio.slice(lastIndex, match.index))
    }
    if (match[1] && match[2]) {
      parts.push({ text: match[1], url: match[2] })
    } else if (match[3]) {
      parts.push({ options: match[3].split("|") })
    }
    lastIndex = tokenRegex.lastIndex
  }

  if (lastIndex < bio.length) {
    parts.push(bio.slice(lastIndex))
  }

  return parts.length > 0 ? parts : [bio]
}

function isBioLink(part: BioPart): part is BioLink {
  return typeof part === "object" && "url" in part
}

function isBioSwitcher(part: BioPart): part is BioSwitcher {
  return typeof part === "object" && "options" in part
}

function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase()
}

function ProjectPreviewCard({ project }: { project: ProjectItem }) {
  const [copied, setCopied] = useState(false)

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
    <>
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
    </>
  )
}

interface BioSectionProps {
  bio: string
  className?: string
  onWordChange?: (word: string) => void
  onUserClick?: (word: string) => void
}

export function BioSection({ bio, className = "", onWordChange, onUserClick }: BioSectionProps) {
  const paragraphs = bio.split("\n\n")
  const mizenProject = portfolioData.projects.find(p => p.name === "Mizen")

  return (
    <div className={`text-base leading-relaxed text-muted-foreground ${className}`}>
      {paragraphs.map((paragraph, pIndex) => {
        const parts = parseBio(paragraph)
        return (
          <p key={pIndex} className={pIndex > 0 ? "mt-4" : ""}>
            {parts.map((part, index) => {
              if (typeof part === "string") {
                if (part.includes("Negi")) {
                  const [before, after] = part.split("Negi")
                  return (
                    <React.Fragment key={index}>
                      {before}
                      <HoverCard openDelay={300} closeDelay={100}>
                        <HoverCardTrigger asChild>
                          <span className="text-foreground underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-150 ease-out hover:decoration-foreground cursor-default">Negi</span>
                        </HoverCardTrigger>
                        <HoverCardContent side="top" align="center" sideOffset={8} className="w-64 p-0 overflow-hidden">
                          <div className="px-3 py-2.5">
                            <p className="text-sm font-medium text-foreground">Negi</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Coming soon</p>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                      {after}
                    </React.Fragment>
                  )
                }
                return part
              }
              if (isBioLink(part)) {
                // Check if this link is for Mizen and we have project data
                if (part.text === "Mizen" && mizenProject) {
                  return (
                    <HoverCard key={index} openDelay={300} closeDelay={100}>
                      <HoverCardTrigger asChild>
                        <a
                          href={part.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-1 text-foreground underline decoration-muted-foreground/40 underline-offset-4 transition-[color,text-decoration-color] duration-150 ease-out hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm no-underline decoration-transparent hover:decoration-foreground"
                        >
                          <span>{part.text}</span>
                        </a>
                      </HoverCardTrigger>
                      <HoverCardContent side="top" align="center" sideOffset={8} className="w-64 p-0 overflow-hidden">
                        <ProjectPreviewCard project={mizenProject} />
                      </HoverCardContent>
                    </HoverCard>
                  )
                }
                return (
                  <HoverLink
                    key={index}
                    href={part.url}
                    className="no-underline decoration-transparent hover:decoration-foreground"
                  >
                    {part.text}
                  </HoverLink>
                )
              }
              if (isBioSwitcher(part)) {
                return <WordSwitcher key={index} options={part.options} onWordChange={onWordChange} onUserClick={onUserClick} />
              }
              return null
            })}
          </p>
        )
      })}
    </div>
  )
}
