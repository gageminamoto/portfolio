"use client"

import { useState, useCallback } from "react"
import { Mail, Check, Info } from "lucide-react"
import useSWR from "swr"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

const EMAIL = "info@gageminamoto.com"

const fallbackCommit = {
  hash: "-------",
  additions: 0,
  deletions: 0,
  relativeTime: "...",
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function CommitTracker() {
  const { data } = useSWR("/api/commits", fetcher, {
    refreshInterval: 600_000, // 10 minutes, matches server cache
    dedupingInterval: 60_000,
  })

  const commit = data?.commit ?? fallbackCommit

  return (
    <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
      <span className="text-foreground/60">{commit.hash}</span>
      <span className="text-muted-foreground/40">{"·"}</span>
      <span className="text-red-400/80">{`-${commit.deletions.toLocaleString()}`}</span>
      <span className="text-emerald-400/80">{`+${commit.additions.toLocaleString()}`}</span>
      <span className="text-muted-foreground/40">{"·"}</span>
      <span>{commit.relativeTime}</span>
    </div>
  )
}

function Colophon() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          aria-label="Colophon"
          className="cursor-default text-muted-foreground/40 transition-colors duration-150 ease-out hover:text-muted-foreground"
        >
          <Info className="h-3.5 w-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={6} className="text-left">
        Built with Next.js and TypeScript.<br />Content from Notion. Set in Inter.<br />Deployed on Vercel.<br />Made with v0, Conductor, and Claude.
      </TooltipContent>
    </Tooltip>
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
        aria-label={`Copy email address ${EMAIL}`}
        aria-describedby="email-tooltip"
        className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm text-foreground transition-[background-color,border-color] duration-150 ease-out hover:bg-accent hover:border-foreground/20"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-emerald-500" />
        ) : (
          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
        )}
        <span>{EMAIL}</span>
      </button>
      <span
        id="email-tooltip"
        role="tooltip"
        className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-md bg-foreground px-2.5 py-1 text-xs text-background opacity-0 transition-opacity duration-150 group-hover:opacity-100"
      >
        {copied ? "Email Copied!" : "Copy email"}
      </span>
    </div>
  )
}

export function SiteFooter() {
  return (
    <footer className="flex flex-col gap-4 border-t border-border pt-6 pb-10 sm:flex-row sm:items-center sm:justify-between">
      <EmailPill />
      <div className="flex items-center gap-2">
        <CommitTracker />
        <Colophon />
      </div>
    </footer>
  )
}
