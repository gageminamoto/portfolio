"use client"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import type { NotionBlock } from "@/lib/notion"
import { getHeadingId, type HeadingBlock } from "./notion-heading"

export interface TocHeading {
  id: string
  text: string
  level: 1 | 2 | 3
}

export function extractHeadings(blocks: NotionBlock[]): TocHeading[] {
  return blocks
    .filter(isHeadingBlock)
    .map((block) => {
      const richText = getHeadingRichText(block)
      return {
        id: getHeadingId(block),
        text: richText.map((t) => t.plain_text).join(""),
        level: parseInt(block.type.replace("heading_", "")) as 1 | 2 | 3,
      }
    })
}

function isHeadingBlock(block: NotionBlock): block is HeadingBlock {
  return (
    block.type === "heading_1" ||
    block.type === "heading_2" ||
    block.type === "heading_3"
  )
}

function getHeadingRichText(block: HeadingBlock) {
  switch (block.type) {
    case "heading_1":
      return block.heading_1.rich_text
    case "heading_2":
      return block.heading_2.rich_text
    case "heading_3":
      return block.heading_3.rich_text
  }
}

interface TableOfContentsProps {
  headings: TocHeading[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState("")
  const [open, setOpen] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: "0px 0px -80% 0px", threshold: 0 }
    )

    headings.forEach((h) => {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  function handleClick(id: string) {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    if (isMobile) setOpen(false)
  }

  if (headings.length === 0) return null

  const tocItems = (
    <div className="flex flex-col gap-1">
      {headings.map((heading) => (
        <button
          key={heading.id}
          type="button"
          onClick={() => handleClick(heading.id)}
          className={`text-left text-sm leading-6 transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:underline ${
            heading.level === 2 ? "pl-3" : heading.level === 3 ? "pl-6" : ""
          } ${
            activeId === heading.id
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground/80"
          }`}
        >
          {heading.text}
        </button>
      ))}
    </div>
  )

  if (isMobile) {
    return (
      <nav aria-label="Table of contents" className="mb-6 rounded-lg border border-border">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="flex w-full items-center justify-between p-3 text-sm text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg"
        >
          <span>On this page</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-150 ease-out ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
        {open && <div className="px-3 pb-3">{tocItems}</div>}
      </nav>
    )
  }

  return (
    <nav aria-label="Table of contents" className="space-y-2">
      <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        On this page
      </span>
      {tocItems}
    </nav>
  )
}
