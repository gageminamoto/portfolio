"use client"

import { useState } from "react"
import useSWR from "swr"
import { motion, useReducedMotion } from "framer-motion"
import { BackLink } from "@/components/back-link"
import { ListRow, type ListRowFluidHover } from "@/components/list-row"
import { fadeUp, noMotion, stagger } from "@/lib/animations"
import type { NotionWritingPost } from "@/lib/notion"
import { useFinePointerHover } from "@/hooks/use-fine-pointer-hover"
import { buildListRowFluidHover } from "@/lib/list-row-fluid-hover"

async function fetcher(url: string) {
  const response = await fetch(url)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.error ?? "Failed to fetch writing posts")
  }

  return data
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
})

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ""
  return dateFormatter.format(new Date(dateStr))
}

function getTimeGroup(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()

  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  if (date >= startOfWeek) return "This week"

  if (
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  )
    return "This month"

  if (date.getFullYear() === now.getFullYear()) return "Earlier this year"

  return String(date.getFullYear())
}

function groupPosts(
  posts: NotionWritingPost[]
): { label: string; posts: NotionWritingPost[] }[] {
  const groups: Map<string, NotionWritingPost[]> = new Map()
  const undated: NotionWritingPost[] = []

  for (const post of posts) {
    if (!post.date) {
      undated.push(post)
      continue
    }
    const label = getTimeGroup(post.date)
    const group = groups.get(label)
    if (group) {
      group.push(post)
    } else {
      groups.set(label, [post])
    }
  }

  const result = Array.from(groups, ([label, posts]) => ({ label, posts }))
  if (undated.length > 0) {
    result.push({ label: "Undated", posts: undated })
  }
  return result
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
      href={`/writing/${post.slug}`}
      name={post.title}
      meta={
        post.date ? (
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        ) : undefined
      }
      fluidHover={fluidHover}
    />
  )
}

interface WritingListProps {
  initialPosts?: NotionWritingPost[]
}

export function WritingList({ initialPosts }: WritingListProps) {
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null)
  const shouldReduceMotion = useReducedMotion()
  const prefersFinePointer = useFinePointerHover({ minWidth: 768 })
  const useFluidListHover = Boolean(!shouldReduceMotion && prefersFinePointer)
  const item = shouldReduceMotion ? noMotion : fadeUp

  const rowFluidHover = (rowId: string) =>
    useFluidListHover
      ? buildListRowFluidHover(hoveredRowId, rowId, setHoveredRowId)
      : undefined

  const { data, error, isLoading } = useSWR<{ posts: NotionWritingPost[] }>(
    "/api/writing",
    fetcher,
    {
      revalidateOnFocus: false,
      fallbackData: initialPosts ? { posts: initialPosts } : undefined,
    }
  )
  const isPending = isLoading && !data
  const hasError = Boolean(error && !data)
  const posts = data?.posts ?? []
  const groups = groupPosts(posts)

  return (
    <motion.main
      id="main-content"
      className="mx-auto flex min-h-screen max-w-xl flex-col gap-(--page-section-gap) px-6 py-16 md:py-24"
      variants={shouldReduceMotion ? undefined : stagger}
      initial="hidden"
      animate="show"
    >
      <motion.header variants={item} className="flex flex-col gap-6">
        <BackLink href="/">Home</BackLink>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground [text-wrap:balance]">
          Writing
        </h1>
      </motion.header>

      {/* Posts list */}
      <motion.div
        variants={item}
        className="flex flex-col gap-(--page-section-gap)"
        onMouseLeave={useFluidListHover ? () => setHoveredRowId(null) : undefined}
      >
        <section className="flex flex-col gap-4">
          <h2 className="text-sm text-muted-foreground">Resources</h2>
          <div className="flex flex-col">
            <ListRow
              href="/early-design"
              name="Early design resources"
              fluidHover={rowFluidHover("early-design")}
            />
          </div>
        </section>

        {isPending && (
          <div
            className="flex flex-col gap-3"
            aria-busy="true"
            aria-label="Loading posts…"
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        )}

        {hasError && (
          <p className="text-sm text-muted-foreground">
            Could not load writing posts.
          </p>
        )}

        {!isPending && !hasError && posts.length === 0 && (
          <p className="text-sm text-muted-foreground">No articles yet.</p>
        )}

        {!isPending &&
          !hasError &&
          groups.map((group) => (
            <section key={group.label} className="flex flex-col gap-4">
              <h2 className="text-sm text-muted-foreground">{group.label}</h2>
              <div className="flex flex-col">
                {group.posts.map((post) => (
                  <PostRow
                    key={post.id}
                    post={post}
                    fluidHover={rowFluidHover(post.id)}
                  />
                ))}
              </div>
            </section>
          ))}
      </motion.div>

    </motion.main>
  )
}
