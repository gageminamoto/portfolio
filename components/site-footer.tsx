"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import useSWR from "swr"
import Link from "next/link"
import { Info } from "lucide-react"

const CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?0123456789abcdef"
const HOVER_TEXT = "View GitHub"
const SCRAMBLE_DURATION = 400

const fallbackCommit = {
  hash: "-------",
  sha: "",
  additions: 0,
  deletions: 0,
  relativeTime: "…",
  repoFullName: "",
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function buildCommitText(commit: typeof fallbackCommit) {
  return `${commit.hash} +${commit.additions.toLocaleString()} -${commit.deletions.toLocaleString()} ${commit.relativeTime}`
}

function CommitLink({ commit }: { commit: typeof fallbackCommit }) {
  const commitText = buildCommitText(commit)
  const [display, setDisplay] = useState(commitText)
  const rafRef = useRef(0)
  const hoveredRef = useRef(false)
  const displayRef = useRef(display)
  displayRef.current = display

  // When commit data changes and not hovered, sync display
  useEffect(() => {
    if (!hoveredRef.current) {
      setDisplay(commitText)
    }
  }, [commitText])

  const scrambleTo = useCallback((target: string) => {
    cancelAnimationFrame(rafRef.current)
    const targetLen = target.length
    const start = performance.now()

    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / SCRAMBLE_DURATION, 1)
      const resolved = Math.floor(progress * targetLen)

      let result = ""
      for (let i = 0; i < targetLen; i++) {
        if (i < resolved) {
          result += target[i]
        } else {
          result += CHARS[Math.floor(Math.random() * CHARS.length)]
        }
      }

      displayRef.current = result
      setDisplay(result)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        displayRef.current = target
        setDisplay(target)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [])

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <a
      href="https://github.com/gageminamoto/portfolio"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block min-w-[var(--foot-w)] transition-colors duration-150 hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
      style={{ "--foot-w": `${Math.max(commitText.length, HOVER_TEXT.length)}ch` } as React.CSSProperties}
      aria-label="View GitHub repository"
      onMouseEnter={() => {
        hoveredRef.current = true
        scrambleTo(HOVER_TEXT)
      }}
      onMouseLeave={() => {
        hoveredRef.current = false
        scrambleTo(commitText)
      }}
    >
      {display}
    </a>
  )
}

export function SiteFooter() {
  const { data } = useSWR("/api/commits", fetcher, {
    refreshInterval: 600_000,
    dedupingInterval: 60_000,
  })

  const commit = data?.commit ?? fallbackCommit

  return (
    <footer className="flex items-center justify-between pt-6 pb-10 font-sans text-[11px] text-muted-foreground/40">
      <CommitLink commit={commit} />
      <Link
        href="/colophon"
        aria-label="Colophon"
        className="transition-colors duration-150 hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
      >
        <Info className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </footer>
  )
}
