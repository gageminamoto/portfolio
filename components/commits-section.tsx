"use client"

import { GitBranch, FileText } from "lucide-react"
import useSWR from "swr"
import type { CommitHistoryItem } from "@/lib/github"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function formatGroupDate(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 14) return "1 week ago"
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 60) return "1 month ago"
  return `${Math.floor(diffDays / 30)} months ago`
}

function formatShortDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })
}

function groupCommitsByDate(commits: CommitHistoryItem[]) {
  const groups: { label: string; count: number; commits: CommitHistoryItem[] }[] = []
  let currentLabel = ""

  for (const commit of commits) {
    const label = formatGroupDate(commit.date)
    if (label !== currentLabel) {
      currentLabel = label
      groups.push({ label, count: 0, commits: [] })
    }
    groups[groups.length - 1].commits.push(commit)
    groups[groups.length - 1].count++
  }

  return groups
}

function SkeletonRows() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="Loading commits">
      {[0, 1, 2].map((g) => (
        <div key={g} className="flex flex-col gap-2">
          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          {[0, 1, 2].map((r) => (
            <div key={r} className="flex items-center gap-3 py-2">
              <div className="h-4 w-4 animate-pulse rounded bg-muted" />
              <div className="h-3 w-20 animate-pulse rounded bg-muted" />
              <div className="h-3 w-3 animate-pulse rounded bg-muted" />
              <div className="h-3 flex-1 animate-pulse rounded bg-muted" />
              <div className="h-3 w-12 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function CommitIcon({ isPush }: { isPush: boolean }) {
  return isPush
    ? <GitBranch className="h-3.5 w-3.5" />
    : <FileText className="h-3.5 w-3.5" />
}

function CommitRow({ commit }: { commit: CommitHistoryItem }) {
  const content = (
    <>
      <span className="shrink-0 text-muted-foreground/60" aria-hidden="true">
        <CommitIcon isPush={commit.isPush} />
      </span>
      <span className={`shrink-0 text-sm ${commit.isPush ? "font-medium text-foreground" : "text-muted-foreground"}`}>
        {commit.repoName}
      </span>
      <span className="shrink-0 text-xs text-muted-foreground/30" aria-hidden="true">
        {"\u203A"}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground transition-colors duration-150 ease-out group-hover:text-foreground">
        {commit.message}
      </span>
      <span className="shrink-0 text-xs text-muted-foreground/60 tabular-nums">
        {formatShortDate(commit.date)}
      </span>
    </>
  )

  const baseClasses = "group flex items-center gap-3 rounded-md py-2 -mx-2 px-2"

  if (commit.isPrivate || !commit.url) {
    return (
      <div className={baseClasses}>
        {content}
      </div>
    )
  }

  return (
    <a
      href={commit.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClasses} transition-[background-color] duration-150 ease-out hover:bg-accent/50`}
    >
      {content}
    </a>
  )
}

export function CommitsSection() {
  const { data, error, isLoading } = useSWR("/api/commits/history", fetcher, {
    refreshInterval: 600_000,
    dedupingInterval: 60_000,
  })

  if (isLoading) return <SkeletonRows />

  if (error || !data?.commits) {
    return (
      <p className="text-sm text-muted-foreground">
        Could not load commits right now.
      </p>
    )
  }

  const commits = data.commits as CommitHistoryItem[]

  if (commits.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No recent commits found.
      </p>
    )
  }

  const groups = groupCommitsByDate(commits)

  return (
    <div className="flex flex-col gap-8">
      {groups.map((group) => (
        <section key={group.label} className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2 pb-2">
            <h3 className="text-xs font-medium text-muted-foreground">
              {group.label}
            </h3>
            <span className="text-xs text-muted-foreground/50">
              {group.count}
            </span>
          </div>
          <div className="flex flex-col">
            {group.commits.map((commit) => (
              <CommitRow key={commit.sha} commit={commit} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
