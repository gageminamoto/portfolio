"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ChevronDown } from "lucide-react"
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
  variant?: "list" | "collapsible"
}

export function TableOfContents({
  headings,
  variant = "list",
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState("")
  const [open, setOpen] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    let frame = 0

    function updateActiveHeading() {
      frame = 0

      if (headings.length === 0) {
        setActiveId("")
        return
      }

      const documentElement = document.documentElement
      const isAtPageBottom =
        window.scrollY + window.innerHeight >= documentElement.scrollHeight - 2

      if (isAtPageBottom) {
        setActiveId(headings[headings.length - 1].id)
        return
      }

      const activationY = window.innerHeight * 0.45
      let nextActiveId = headings[0].id

      for (const heading of headings) {
        const el = document.getElementById(heading.id)
        if (!el) continue

        if (el.getBoundingClientRect().top <= activationY) {
          nextActiveId = heading.id
        } else {
          break
        }
      }

      setActiveId(nextActiveId)
    }

    function requestUpdate() {
      if (frame) return
      frame = window.requestAnimationFrame(updateActiveHeading)
    }

    updateActiveHeading()
    window.addEventListener("scroll", requestUpdate, { passive: true })
    window.addEventListener("resize", requestUpdate)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", requestUpdate)
      window.removeEventListener("resize", requestUpdate)
    }
  }, [headings])

  function handleClick(id: string) {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    if (variant === "collapsible") setOpen(false)
  }

  if (headings.length === 0) return null

  const tocItems = (
    <div className="flex flex-col gap-1">
      {headings.map((heading) => (
        <button
          key={heading.id}
          type="button"
          onClick={() => handleClick(heading.id)}
          className={`cursor-pointer text-left text-sm leading-6 transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:underline ${
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

  if (variant === "collapsible") {
    const contentTransition = {
      duration: shouldReduceMotion ? 0 : 0.18,
      ease: [0.215, 0.61, 0.355, 1],
    }

    return (
      <nav aria-label="Table of contents" className="mb-6 rounded-lg border border-border">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="flex w-full cursor-pointer items-center justify-between rounded-lg p-3 text-sm text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span>On this page</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-150 ease-out ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="mobile-toc-content"
              initial={
                shouldReduceMotion
                  ? false
                  : { height: 0, opacity: 0, y: -6 }
              }
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { height: 0, opacity: 0, y: -4 }
              }
              transition={contentTransition}
              className="overflow-hidden"
            >
              <div className="px-3 pb-3">{tocItems}</div>
            </motion.div>
          )}
        </AnimatePresence>
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
