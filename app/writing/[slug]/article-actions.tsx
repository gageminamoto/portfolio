"use client"

import { useCallback, useState } from "react"
import { Check, Link as LinkIcon } from "lucide-react"
import { CopyFeedbackIcon } from "@/components/copy-feedback-icon"
import { ThemeToggle } from "@/components/theme-toggle"

export function ArticleActions() {
  const [copied, setCopied] = useState(false)

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
    } catch {
      const textarea = document.createElement("textarea")
      textarea.value = window.location.href
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
    }

    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }, [])

  return (
    <div className="flex items-center gap-1" aria-label="Article actions">
      <div className="flex h-8 w-8 items-center justify-center">
        <button
          type="button"
          onClick={copyLink}
          aria-label={copied ? "Link copied" : "Copy link"}
          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-[color,transform] duration-150 ease-out hover:text-foreground active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <CopyFeedbackIcon
            copied={copied}
            idleIcon={<LinkIcon className="h-3.5 w-3.5" aria-hidden="true" />}
            copiedIcon={<Check className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />}
          />
        </button>
      </div>
      <div className="flex h-8 w-8 items-center justify-center"><ThemeToggle /></div>
    </div>
  )
}
