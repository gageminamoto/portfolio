"use client"

import { useState } from "react"
import useSWR from "swr"
import type { NotionWritingPost } from "@/lib/notion"
import { HoverLink } from "@/components/hover-link"

const fetcher = (url: string) => fetch(url).then((r) => r.json())
const INITIAL_COUNT = 5

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ""
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export type WritingVariant = "default" | "card"

interface WritingSectionProps {
  variant?: WritingVariant
}

function SkeletonRow() {
  return (
    <div className="flex items-baseline gap-2">
      <div className="h-4 w-48 animate-pulse rounded bg-muted" />
      <div className="h-3 w-20 animate-pulse rounded bg-muted" />
    </div>
  )
}

export function WritingSection({ variant = "default" }: WritingSectionProps) {
  const [expanded, setExpanded] = useState(false)
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
      <div className="flex flex-col gap-3" aria-busy="true" aria-label="Loading writing posts">
        {[0, 1, 2].map((i) => (
          <SkeletonRow key={i} />
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

  const visiblePosts = expanded ? posts : posts.slice(0, INITIAL_COUNT)
  const hasMore = posts.length > INITIAL_COUNT

  return (
    <div className="flex flex-col gap-3">
      {visiblePosts.map((post) => (
        <div key={post.id} className="flex items-baseline gap-2">
          <HoverLink
            href={post.url}
            className="font-medium no-underline decoration-transparent hover:decoration-foreground"
          >
            {post.title}
          </HoverLink>
          {post.date && (
            <span className="text-sm text-muted-foreground">
              {formatDate(post.date)}
            </span>
          )}
        </div>
      ))}
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="cursor-pointer text-left text-sm text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground"
        >
          {expanded ? "Show less" : `See ${posts.length - INITIAL_COUNT} more`}
        </button>
      )}
    </div>
  )
}
