"use client"

import { useState, useCallback } from "react"
import { Mail, Check } from "lucide-react"

const EMAIL = "info@gageminamoto.com"

// Placeholder commit data — replace with real GitHub API data later
const commitData = {
  hash: "b33efc4",
  additions: 21222,
  deletions: 14202,
  relativeTime: "8hrs ago",
}

function CommitTracker() {
  const { hash, additions, deletions, relativeTime } = commitData

  return (
    <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
      <span className="text-foreground/60">{hash}</span>
      <span className="text-muted-foreground/40">{"·"}</span>
      <span className="text-red-400/80">{`-${deletions.toLocaleString()}`}</span>
      <span className="text-emerald-400/80">{`+${additions.toLocaleString()}`}</span>
      <span className="text-muted-foreground/40">{"·"}</span>
      <span>{relativeTime}</span>
    </div>
  )
}

function EmailPill() {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea")
      textarea.value = EMAIL
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [])

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm text-foreground transition-[background-color,border-color] duration-150 ease-out hover:bg-accent hover:border-foreground/20"
        aria-label={`Copy email address ${EMAIL}`}
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-emerald-500" />
        ) : (
          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
        )}
        <span>{EMAIL}</span>
      </button>
      <span
        className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-md bg-foreground px-2.5 py-1 text-xs text-background opacity-0 transition-opacity duration-150 group-hover:opacity-100"
        role="tooltip"
      >
        {copied ? "Copied!" : "Copy email"}
      </span>
    </div>
  )
}

export function SiteFooter() {
  return (
    <footer className="flex flex-col gap-4 border-t border-border pt-6 pb-10 sm:flex-row sm:items-center sm:justify-between">
      <EmailPill />
      <CommitTracker />
    </footer>
  )
}
