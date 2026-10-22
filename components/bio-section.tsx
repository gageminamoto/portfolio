"use client"

import React, { useRef } from "react"
import { motion } from "motion/react"
import { HoverLink } from "@/components/hover-link"
import { WordSwitcher } from "@/components/word-switcher"
import { REFLOW_ATTR, useReflowFade } from "@/hooks/use-reflow-fade"

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
  /** Links (keyed by href) that open an inline region on plain click. */
  linkToggles?: BioLinkToggles
}

export type BioLinkToggles = Record<
  string,
  { open: boolean; controls: string; onToggle: () => void; onIntent?: () => void }
>

function isPlainClick(e: React.MouseEvent) {
  return !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
}

// Each word (and each link) is its own box so the reflow glide can carry it
// to a new line. Whitespace stays as plain text between boxes, so the
// paragraph still wraps normally.
const reflowItemProps = { [REFLOW_ATTR]: "" }

function ReflowWords({ text }: { text: string }) {
  return text.split(/(\s+)/).map((chunk, i) =>
    chunk.trim() === "" ? (
      chunk
    ) : (
      <span key={i} {...reflowItemProps} className="inline-block">
        {chunk}
      </span>
    ),
  )
}

/** Break multi-word link labels at intentional spots so lines fill width without orphans. */
function ReflowLinkLabel({ text }: { text: string }) {
  if (text === "local design community") {
    return (
      <>
        <span {...reflowItemProps} className="inline-block">
          local
        </span>{" "}
        <span {...reflowItemProps} className="inline-block">
          design community
        </span>
      </>
    )
  }
  return <ReflowWords text={text} />
}

function renderBioParts(
  parts: BioPart[],
  onWordChange?: (word: string) => void,
  onUserClick?: (word: string) => void,
  ghost = false,
  reflow = false,
  linkToggles?: BioLinkToggles,
) {
  const words = (text: string) => (reflow ? <ReflowWords text={text} /> : text)
  const item = (key: React.Key, node: React.ReactNode) =>
    reflow ? (
      <span key={key} {...reflowItemProps} className="inline-block">
        {node}
      </span>
    ) : (
      <React.Fragment key={key}>{node}</React.Fragment>
    )

  return parts.map((part, index) => {
    if (typeof part === "string") {
      if (part.includes("Negi")) {
        const [before, after] = part.split("Negi")
        return (
          <React.Fragment key={index}>
            {words(before)}
            {item(
              "negi",
              <HoverLink
                href="https://negi.studio"
                previewImage="/negi-studio-preview.png"
                previewWidth={256}
                previewHeight={134}
                className={
                  ghost
                    ? "!text-transparent decoration-transparent hover:decoration-primary"
                    : "no-underline decoration-transparent hover:decoration-primary"
                }
              >
                Negi
              </HoverLink>,
            )}
            {words(after)}
          </React.Fragment>
        )
      }
      return <React.Fragment key={index}>{words(part)}</React.Fragment>
    }
    if (isBioLink(part)) {
      const previewImages: Record<string, string> = {
        "Negi": "/negi-studio-preview.png",
        "Mizen": "/images/mizen-hover.mp4",
        "University of Hawaiʻi Esports": "/uh-preview.jpg",
        "UH Esports": "/uh-preview.jpg",
        "local design community": "/piiku-preview.jpg",
        "Michelle": "/michelle-preview.jpg",
        "Aura": "/images/aura-preview.webp",
        "Kilo": "/images/kilo-preview.webp",
        "Umi": "/images/umi-preview.webp",
        "Piʻikū": "/images/piiku-preview.webp",
        "Spero": "/images/spero-preview.webp",
        "MemberSpace": "/images/memberspace-preview.webp",
        "Servco": "/images/servco-preview.webp",
      }
      const toggle = linkToggles?.[part.url]
      const link = (
        <HoverLink
          href={part.url}
          wrap={reflow}
          onClick={
            toggle
              ? (e) => {
                  if (!isPlainClick(e)) return
                  e.preventDefault()
                  toggle.onToggle()
                }
              : undefined
          }
          onPointerEnter={toggle?.onIntent}
          onFocus={toggle?.onIntent}
          ariaExpanded={toggle?.open}
          ariaControls={toggle?.controls}
          external={!part.url.startsWith("/")}
          previewImage={previewImages[part.text]}
          previewFallbackImage={part.text === "Mizen" ? "/projects/mizen.png" : undefined}
          previewWidth={part.text === "Negi" ? 256 : undefined}
          previewHeight={part.text === "Negi" ? 134 : undefined}
          className={
            ghost
              ? "!text-transparent decoration-transparent hover:decoration-primary"
              : "no-underline decoration-transparent hover:decoration-primary"
          }
        >
          {reflow ? <ReflowLinkLabel text={part.text} /> : part.text}
        </HoverLink>
      )
      if (reflow) {
        return <React.Fragment key={index}>{link}</React.Fragment>
      }
      return item(index, link)
    }
    if (isBioSwitcher(part)) {
      return (
        <WordSwitcher
          key={index}
          options={part.options}
          onWordChange={onWordChange}
          onUserClick={onUserClick}
        />
      )
    }
    return null
  })
}

function ShiftingParagraph({
  parts,
  className,
  onWordChange,
  onUserClick,
  linkToggles,
}: {
  parts: BioPart[]
  className: string
  onWordChange?: (word: string) => void
  onUserClick?: (word: string) => void
  linkToggles?: BioLinkToggles
}) {
  // Render as normal flowing text so the paragraph wraps. The role word
  // morphs on its own inside WordSwitcher (TextMorph forces nowrap, so it
  // can't wrap a whole paragraph).
  const ref = useRef<HTMLParagraphElement>(null)
  useReflowFade(ref, "button")

  return (
    <motion.p ref={ref} layout="position" className={className}>
      {renderBioParts(parts, onWordChange, onUserClick, false, true, linkToggles)}
    </motion.p>
  )
}

/** Shared body copy rhythm for bios and inline prose blocks (About hobbies, etc.). */
export const bodyCopyClassName = "text-base leading-7 text-pretty"

export function BioSection({
  bio,
  className = "",
  onWordChange,
  onUserClick,
  linkToggles,
}: BioSectionProps) {
  const paragraphs = bio.split("\n\n")

  return (
    <div className={`${bodyCopyClassName} text-muted-foreground ${className}`}>
      {paragraphs.map((paragraph, pIndex) => {
        const parts = parseBio(paragraph)
        const paragraphClass = pIndex > 0 ? "mt-4" : ""
        if (parts.some(isBioSwitcher)) {
          return (
            <ShiftingParagraph
              key={pIndex}
              parts={parts}
              className={paragraphClass}
              onWordChange={onWordChange}
              onUserClick={onUserClick}
              linkToggles={linkToggles}
            />
          )
        }
        return (
          <motion.p key={pIndex} layout="position" className={paragraphClass}>
            {renderBioParts(parts, onWordChange, onUserClick, false, false, linkToggles)}
          </motion.p>
        )
      })}
    </div>
  )
}
