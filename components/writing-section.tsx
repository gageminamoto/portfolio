"use client"

import useSWR from "swr"
import type { NotionWritingPost } from "@/lib/notion"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ""
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

// Variant: "default" for layouts 1 & 3, "card" for layout 2
export type WritingVariant = "default" | "card" | "dash"

interface WritingSectionProps {
  variant?: WritingVariant
}

function SkeletonRow({ variant }: { variant: WritingVariant }) {
  if (variant === "card") {
    return (
      <div className="flex items-center justify-between rounded-md px-3 py-3">
        <div className="h-4 w-48 animate-pulse rounded bg-muted" />
        <div className="h-3 w-20 animate-pulse rounded bg-muted" />
      </div>
    )
  }
  return <div className="h-4 w-40 animate-pulse rounded bg-muted" />
}

export function WritingSection({ variant = "default" }: WritingSectionProps) {
  const { data, error, isLoading } = useSWR<{ posts: NotionWritingPost[] }>(
    "/api/writing",
    fetcher,
    { revalidateOnFocus: false }
  )

  if (error) {
    return (
      <p className="text-sm text-muted-foreground">
        Could not load writing posts.
      </p>
    )
  }

  if (isLoading || !data) {
    return (
      <div className="flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <SkeletonRow key={i} variant={variant} />
        ))}
      </div>
    )
  }

  const posts = data?.posts ?? []

  if (!Array.isArray(posts) || posts.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No posts yet.</p>
    )
  }

  // Card variant (Layout 2) — row with date on the right
  if (variant === "card") {
    return (
      <div className="flex flex-col gap-1">
        {posts.map((post) => (
          <a
            key={post.id}
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between rounded-md px-3 py-3 transition-[background-color] duration-150 ease-out hover:bg-accent"
          >
            <span className="text-sm font-medium text-foreground">
              {post.title}
            </span>
            {post.date && (
              <span className="text-xs text-muted-foreground">
                {formatDate(post.date)}
              </span>
            )}
          </a>
        ))}
      </div>
    )
  }

  // Dash variant (Layout 3) — plain link, no extra chrome
  if (variant === "dash") {
    return (
      <div className="flex flex-col gap-2.5">
        {posts.map((post) => (
          <a
            key={post.id}
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground transition-colors duration-150 ease-out hover:text-muted-foreground"
          >
            {post.title}
          </a>
        ))}
      </div>
    )
  }

  // Default variant (Layout 1) — flat list of titles
  return (
    <div className="flex flex-col gap-3">
      {posts.map((post) => (
        <a
          key={post.id}
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-base font-medium text-foreground transition-colors duration-150 ease-out hover:text-muted-foreground"
        >
          {post.title}
        </a>
      ))}
    </div>
  )
}
