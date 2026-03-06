"use client"

import { HoverLink } from "@/components/hover-link"

interface BioLink {
  text: string
  url: string
}

// Parse bio string for links in format [text](url)
function parseBio(bio: string): (string | BioLink)[] {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  const parts: (string | BioLink)[] = []
  let lastIndex = 0
  let match

  while ((match = linkRegex.exec(bio)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(bio.slice(lastIndex, match.index))
    }
    // Add the link
    parts.push({
      text: match[1],
      url: match[2],
    })
    lastIndex = linkRegex.lastIndex
  }

  // Add remaining text
  if (lastIndex < bio.length) {
    parts.push(bio.slice(lastIndex))
  }

  return parts.length > 0 ? parts : [bio]
}

interface BioSectionProps {
  bio: string
  className?: string
}

export function BioSection({ bio, className = "" }: BioSectionProps) {
  const parts = parseBio(bio)

  return (
    <p className={`whitespace-pre-line text-base leading-relaxed text-muted-foreground ${className}`}>
      {parts.map((part, index) => {
        if (typeof part === "string") {
          return part
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
      })}
    </p>
  )
}
