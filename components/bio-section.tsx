"use client"

import React from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { HoverLink } from "@/components/hover-link"
import { WordSwitcher } from "@/components/word-switcher"
import { BIO_PARAGRAPHS } from "@/lib/portfolio-data"
import { CircleUserRound } from "lucide-react"
import Link from "next/link"

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
  activeWord?: string
  className?: string
  onWordChange?: (word: string) => void
  onUserClick?: (word: string) => void
}

function renderParagraph(paragraph: string, onWordChange?: (word: string) => void, onUserClick?: (word: string) => void) {
  const parts = parseBio(paragraph)
  return parts.map((part, index) => {
    if (typeof part === "string") {
      if (part.includes("Negi")) {
        const [before, after] = part.split("Negi")
        return (
          <React.Fragment key={index}>
            {before}
            <HoverLink
              href="https://negi.studio"
              previewImage="/negi-studio-preview.jpg"
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
      // Render "About Me" link as an inline button with icon
      if (part.url === "/about") {
        return (
          <Link
            key={index}
            href="/about"
            className="group/about inline-flex items-center gap-1.5 rounded-[7px] border border-border/50 bg-gradient-to-b from-background to-muted/40 px-2.5 py-[3px] text-[13px] font-medium text-foreground/80 shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-150 ease-out hover:text-foreground hover:border-border/80 hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.08)] hover:-translate-y-[0.5px] active:translate-y-0 active:shadow-[0_0px_1px_rgba(0,0,0,0.04)] align-middle"
          >
            <CircleUserRound className="h-3 w-3 fill-current text-muted-foreground transition-colors duration-150 group-hover/about:text-foreground/70" />
            About Me
          </Link>
        )
      }
      const isInternal = part.url.startsWith("/")
      const previewImages: Record<string, string> = {
        "Mizen": "/mizen-preview.jpg",
        "University of Hawai\u2019i": "/uh-preview.jpg",
        "University of Hawaiʻi Esports": "/uh-preview.jpg",
        "local design community": "/piiku-preview.jpg",
        "Piʻiku": "/piiku-preview.jpg",
        "UH": "/uh-preview.jpg",
        "Servco": "/images/servco-hover.gif",
        "Figma": undefined as unknown as string,
        "Cursor": undefined as unknown as string,
        "Vercel": undefined as unknown as string,
      }
      return (
        <HoverLink
          key={index}
          href={part.url}
          external={!isInternal}
          previewImage={previewImages[part.text]}
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
  })
}

export function BioSection({ bio, activeWord = "software", className = "", onWordChange, onUserClick }: BioSectionProps) {
  const [firstParagraph, secondParagraph] = bio.split("\n\n")
  const thirdParagraph = BIO_PARAGRAPHS[activeWord] ?? BIO_PARAGRAPHS.software
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className={`text-base leading-relaxed text-muted-foreground ${className}`}>
      <p className="text-pretty">
        {renderParagraph(firstParagraph, onWordChange, onUserClick)}
      </p>
      <p className="mt-4 text-pretty">
        {renderParagraph(secondParagraph, onWordChange, onUserClick)}
      </p>
      <AnimatePresence mode="wait">
        <motion.p
          key={activeWord}
          className="mt-4 text-pretty"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 4, filter: shouldReduceMotion ? "none" : "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -4, filter: shouldReduceMotion ? "none" : "blur(4px)" }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: [0.23, 1, 0.32, 1] }}
        >
          {renderParagraph(thirdParagraph)}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
