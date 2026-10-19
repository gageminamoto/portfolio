"use client"

import { useState } from "react"
import useSWR from "swr"

import { useReducedMotion } from "framer-motion"
import type { NotionWritingPost } from "@/lib/notion"
import { ExpandableList } from "@/components/expandable-list"
import { ListRow, type ListRowFluidHover } from "@/components/list-row"
import { useFinePointerHover } from "@/hooks/use-fine-pointer-hover"
import { buildListRowFluidHover } from "@/lib/list-row-fluid-hover"

export async function writingFetcher(url: string) {
  const response = await fetch(url)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.error ?? "Failed to fetch writing posts")
  }

  return data
}
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
  initialPosts?: NotionWritingPost[]
  /** Local preview posts appended after the real ones (DialKit seeding). */
  seedPosts?: NotionWritingPost[]
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-0 py-3">
      <div className="h-5 w-48 shrink-0 animate-pulse rounded-sm bg-muted motion-reduce:animate-none" />
      <div className="h-3 w-20 flex-1 animate-pulse rounded-sm bg-muted" />
    </div>
  )
}

function PostRow({
  post,
  fluidHover,
}: {
  post: NotionWritingPost
  fluidHover?: ListRowFluidHover
}) {
  return (
    <ListRow
      href={`/writing/${post.slug}?from=home`}
      name={post.title}
      meta={post.date ? formatDate(post.date) : undefined}
      fluidHover={fluidHover}
    />
  )
}

export function WritingSection({
  variant = "default",
  initialPosts,
  seedPosts,
}: WritingSectionProps) {
  const [hoveredPostId, setHoveredPostId] = useState<string | null>(null)
  const shouldReduceMotion = useReducedMotion()
  const prefersFinePointer = useFinePointerHover({ minWidth: 768 })
  const useFluidListHover = Boolean(!shouldReduceMotion && prefersFinePointer)
  const { data, error, isLoading } = useSWR<{ posts: NotionWritingPost[] }>(
    "/api/writing",
    writingFetcher,
    {
      revalidateOnFocus: false,
      fallbackData: initialPosts ? { posts: initialPosts } : undefined,
    }
  )

  if (error && !data) {
    return (
      <p className="text-sm text-muted-foreground">
        Could not load writing posts.
      </p>
    )
  }

  if (isLoading && !data) {
    return (
      <div className="flex flex-col" aria-busy="true" aria-label="Loading writing posts">
        {[0, 1, 2].map((i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    )
  }

  const posts = [...(data?.posts ?? []), ...(seedPosts ?? [])]

  if (!Array.isArray(posts) || posts.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No posts yet.</p>
    )
  }

  const rowFluidHover = (postId: string) =>
    useFluidListHover
      ? buildListRowFluidHover(hoveredPostId, postId, setHoveredPostId)
      : undefined

  return (
    <ExpandableList
      items={posts}
      getKey={(post) => post.id}
      renderRow={(post) => <PostRow post={post} fluidHover={rowFluidHover(post.id)} />}
      noun="posts"
      initialCount={INITIAL_COUNT}
      onMouseLeave={useFluidListHover ? () => setHoveredPostId(null) : undefined}
    />
  )
}
