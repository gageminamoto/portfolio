"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import type { NotionBlock } from "@/lib/notion"
import { NotionRichText } from "./notion-rich-text"
import { NotionBlocksRenderer } from "./notion-blocks-renderer"

interface NotionToggleProps {
  block: NotionBlock
}

export function NotionToggle({ block }: NotionToggleProps) {
  const [open, setOpen] = useState(false)
  const toggle = block.toggle

  return (
    <div className="my-4 rounded-lg border border-border">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 p-3 text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none rounded-lg"
      >
        <ChevronRight
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-150 ease-out ${
            open ? "rotate-90" : ""
          }`}
        />
        <span className="font-medium text-foreground">
          <NotionRichText items={toggle.rich_text} />
        </span>
      </button>
      {open && block.children && (
        <div className="px-3 pb-3 pl-9">
          <NotionBlocksRenderer blocks={block.children} />
        </div>
      )}
    </div>
  )
}
