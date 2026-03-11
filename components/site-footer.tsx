"use client"

import { useState, useCallback, useEffect } from "react"
import { Mail, Check } from "lucide-react"
import { Kbd } from "@/components/ui/kbd"
import { playChime } from "@/lib/sounds"
import useSWR from "swr"

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

function EmailPill() {
  const [copied, setCopied] = useState(false)

  const showCopied = useCallback(() => {
    setCopied(true)
    playChime()
    setTimeout(() => setCopied(false), 2000)
  }, [])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      showCopied()
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea")
      textarea.value = EMAIL
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      showCopied()
    }
  }, [showCopied])

  useEffect(() => {
    const onCopy = () => showCopied()
    window.addEventListener("email-copied", onCopy)
    return () => window.removeEventListener("email-copied", onCopy)
  }, [showCopied])

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        aria-label={`Copy email address ${EMAIL}`}
        aria-describedby="email-tooltip"
        className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm text-foreground transition-[background-color,border-color] duration-150 ease-out hover:bg-accent hover:border-foreground/20"
      >
        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
        <span>{EMAIL}</span>
        {copied ? (
          <Check className="hidden h-3.5 w-3.5 text-emerald-500 md:block" />
        ) : (
          <Kbd className="hidden md:inline-flex">E</Kbd>
        )}
      </button>
      <span
        id="email-tooltip"
        role="tooltip"
        className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-md bg-foreground px-2.5 py-1 text-xs text-background opacity-0 transition-opacity duration-150 group-hover:opacity-100"
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
