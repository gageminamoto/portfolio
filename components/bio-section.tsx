"use client"

import React from "react"
import { HoverLink } from "@/components/hover-link"
import { WordSwitcher } from "@/components/word-switcher"

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
                      <HoverLink
                        href="https://negi.studio"
                        className="no-underline decoration-transparent hover:decoration-foreground"
                      >
                        Negi
                      </HoverLink>
                      {after}
                    </React.Fragment>
                  )
                }
                return part
              }
              if (isBioLink(part)) {
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
