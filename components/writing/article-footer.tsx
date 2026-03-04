"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Link as LinkIcon, Check } from "lucide-react"
import type { NotionWritingPost } from "@/lib/notion"

interface ArticleFooterProps {
  nextPost: NotionWritingPost | null
}

export function ArticleFooter({ nextPost }: ArticleFooterProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const textarea = document.createElement("textarea")
      textarea.value = window.location.href
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [])

  return (
    <footer className="mt-12 border-t border-border pt-8">
      <nav aria-label="Article navigation" className="flex items-center gap-3 mb-8">
        <Link
          href="/writing"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Back
        </Link>

        <span className="text-muted-foreground/40" aria-hidden="true">
          &middot;
        </span>

        <button
          type="button"
          onClick={handleCopyLink}
          aria-label={copied ? "Link copied" : "Copy link"}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm cursor-pointer"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <LinkIcon className="h-3.5 w-3.5" />
          )}
          <span aria-live="polite">{copied ? "Copied!" : "Copy link"}</span>
        </button>
      </nav>

      {nextPost && (
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            Next article
          </span>
          <Link
            href={`/writing/${nextPost.slug}`}
            className="group inline-flex items-center gap-1 font-medium text-foreground underline decoration-muted-foreground/40 underline-offset-4 transition-[color,text-decoration-color] duration-150 ease-out hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
          >
            <span>{nextPost.title}</span>
            <ChevronRight className="h-3.5 w-3.5 opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100" />
          </Link>
        </div>
      )}
    </footer>
  )
}
