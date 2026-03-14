"use client"

import React from "react"
import { HoverLink } from "@/components/hover-link"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"
import { WordSwitcher } from "@/components/word-switcher"
import { ProjectPreviewCard } from "@/components/project-preview-card"
import { portfolioData } from "@/lib/portfolio-data"

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
