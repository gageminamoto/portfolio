"use client"

import { Activity, GitBranch, Radio } from "lucide-react"
import useSWR from "swr"

interface ActivityPayload {
  activity: {
    status: "online" | "recent" | "offline"
    label: string
    detail: string
    source: string
    url: string | null
    updatedAt: string | null
  } | null
}

const fallbackActivity = {
  status: "online" as const,
  label: "Available",
  detail: "Designing and building thoughtful web projects",
  source: "Manual status",
  url: null,
  updatedAt: null,
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function formatActivityTime(dateStr: string | null): string {
  if (!dateStr) return "Set manually"

  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return "Recently active"

  const diffMs = Date.now() - date.getTime()
  const diffMinutes = Math.max(0, Math.floor(diffMs / (1000 * 60)))

  if (diffMinutes < 1) return "Just now"
  if (diffMinutes < 60) return `${diffMinutes}m ago`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays}d ago`

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(date)
}

function statusCopy(status: "online" | "recent" | "offline") {
  if (status === "online") return "Live now"
  if (status === "recent") return "Recently active"
  return "Away"
}

export function ActivityStatus() {
  const { data, error } = useSWR<ActivityPayload>("/api/activity", fetcher, {
    refreshInterval: 300_000,
    dedupingInterval: 60_000,
  })

  const activity = data?.activity ?? fallbackActivity
  const isLoading = !data && !error
  const isOnline = activity.status === "online"
  const content = (
    <>
      <div className="relative mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border border-border/70 bg-background shadow-sm">
        {isOnline && (
          <span className="absolute inset-0 rounded-full bg-emerald-400/20 motion-safe:animate-ping" aria-hidden="true" />
        )}
        <span
          className={`relative flex size-2.5 rounded-full ${
            isOnline ? "bg-emerald-500" : activity.status === "recent" ? "bg-amber-500" : "bg-muted-foreground/50"
          }`}
          aria-hidden="true"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground/70">
            {isOnline ? <Radio className="size-3" aria-hidden="true" /> : <Activity className="size-3" aria-hidden="true" />}
            {statusCopy(activity.status)}
          </span>
          <span className="text-xs text-muted-foreground/40" aria-hidden="true">
            /
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground/60">
            <GitBranch className="size-3" aria-hidden="true" />
            {formatActivityTime(activity.updatedAt)}
          </span>
        </div>
        <p className="mt-1 truncate text-sm font-medium text-foreground">
          {isLoading ? "Checking what I’m up to…" : activity.label}
        </p>
        <p className="mt-0.5 line-clamp-2 text-sm leading-snug text-muted-foreground">
          {isLoading ? "Pulling a fresh presence signal from GitHub." : activity.detail}
        </p>
      </div>
    </>
  )

  const className = "group flex items-start gap-3 rounded-2xl border border-border/70 bg-card/70 p-3 shadow-sm shadow-black/[0.02] backdrop-blur transition-[border-color,background-color,transform,box-shadow] duration-150 hover:border-border hover:bg-card hover:shadow-md hover:shadow-black/[0.04]"

  if (activity.url) {
    return (
      <a href={activity.url} target="_blank" rel="noopener noreferrer" className={className} aria-label={`${activity.label}: ${activity.detail}`}>
        {content}
      </a>
    )
  }

  return (
    <div className={className} role="status" aria-live="polite">
      {content}
    </div>
  )
}
