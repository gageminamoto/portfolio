"use client"

import { useState } from "react"
import useSWR from "swr"
import { ChevronDown } from "lucide-react"
import type { NotionWritingPost } from "@/lib/notion"
import { HoverLink } from "@/components/hover-link"
import { cn } from "@/lib/utils"

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
    <div className="flex items-baseline gap-2 min-w-0">
      <div className="h-4 w-48 shrink-0 animate-pulse rounded bg-muted" />
      <div className="h-3 w-20 animate-pulse rounded bg-muted" />
    </div>
  )
}

function PostRow({ post }: { post: NotionWritingPost }) {
  return (
    <div className="flex items-baseline gap-2 min-w-0">
      <span className="shrink-0 font-medium">
        <HoverLink
          href={`/writing/${post.slug}?from=home`}
          external={false}
          className="no-underline decoration-transparent hover:decoration-foreground"
        >
          {post.title}
        </HoverLink>
      </span>
      {post.date && (
        <span className="truncate text-sm text-muted-foreground">
          {formatDate(post.date)}
        </span>
      )}
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

  const hasMore = posts.length > INITIAL_COUNT

  return (
    <div
      className="flex flex-col gap-3"
      style={!expanded && hasMore ? { maskImage: 'linear-gradient(to bottom, black calc(100% - 2rem), transparent)' } : undefined}
    >
      {posts.slice(0, INITIAL_COUNT).map((post) => (
        <PostRow key={post.id} post={post} />
      ))}

      {hasMore && (
        <>
          <div className="relative">
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col gap-3">
                  {posts.slice(INITIAL_COUNT).map((post) => (
                    <PostRow key={post.id} post={post} />
                  ))}
                </div>
              </div>
            </div>

          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="group flex cursor-pointer items-center justify-center py-1"
            aria-expanded={expanded}
            aria-label={expanded ? "Show fewer posts" : `Show ${posts.length - INITIAL_COUNT} more posts`}
          >
            <ChevronDown
              className={cn(
                "size-4 text-muted-foreground/40 transition-transform duration-200 ease-out group-hover:text-muted-foreground",
                expanded && "rotate-180"
              )}
            />
          </button>
        </>
      )}
    </div>
  )
}
