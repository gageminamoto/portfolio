"use client"

import Link from "next/link"
import useSWR from "swr"
import { useDialKit } from "dialkit"
import { motion, useReducedMotion } from "framer-motion"
import { ChevronLeft } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { SiteFooter } from "@/components/site-footer"
import { generateSeedPosts } from "@/lib/seed-posts"
import { fadeUp, noMotion, stagger } from "@/lib/animations"
import type { NotionWritingPost } from "@/lib/notion"

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
    <div className="flex w-full items-baseline justify-between gap-4">
      <div className="h-4 w-48 animate-pulse rounded bg-muted" />
      <div className="h-3 w-20 shrink-0 animate-pulse rounded bg-muted" />
    </div>
  )
}

function PostRow({ post }: { post: NotionWritingPost }) {
  return (
    <div className="flex w-full items-baseline justify-between gap-4">
      <span className="min-w-0 truncate">
        <Link
          href={`/writing/${post.slug}`}
          className="font-medium text-foreground underline decoration-transparent underline-offset-4 transition-[color,text-decoration-color] duration-150 ease-out hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
        >
          {post.title}
        </Link>
      </span>
      {post.date && (
        <time
          dateTime={post.date}
          className="shrink-0 text-sm tabular-nums text-muted-foreground"
        >
          {formatDate(post.date)}
        </time>
      )}
    </div>
  )
}

interface WritingListProps {
  initialPosts?: NotionWritingPost[]
}

export function WritingList({ initialPosts }: WritingListProps) {
  const dial = useDialKit("Seed Posts", {
    enabled: false,
    count: [5, 1, 20, 1],
  })
  const shouldReduceMotion = useReducedMotion()
  const item = shouldReduceMotion ? noMotion : fadeUp

  const { data, error, isLoading } = useSWR<{ posts: NotionWritingPost[] }>(
    "/api/writing",
    fetcher,
    {
      revalidateOnFocus: false,
      fallbackData: initialPosts ? { posts: initialPosts } : undefined,
    }
  )
  const realPosts = data?.posts ?? []
  const posts = dial.enabled
    ? [...realPosts, ...generateSeedPosts(dial.count)]
    : realPosts
  const groups = groupPosts(posts)

  return (
    <motion.main
      id="main-content"
      className="mx-auto flex min-h-screen max-w-xl flex-col gap-12 px-6 py-16 md:py-24"
      variants={shouldReduceMotion ? undefined : stagger}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.header variants={item} className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
        >
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Home
        </Link>
        <ThemeToggle />
      </motion.header>

      {/* Title */}
      <motion.div variants={item} className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground [text-wrap:balance]">
          Writing
        </h1>
      </motion.div>

      {/* Posts list */}
      <motion.div variants={item} className="flex flex-col gap-10">
        {isLoading && (
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

        {error && (
          <p className="text-sm text-muted-foreground">
            Could not load writing posts.
          </p>
        )}

        {!isLoading && !error && posts.length === 0 && (
          <p className="text-sm text-muted-foreground">No articles yet.</p>
        )}

        {!isLoading &&
          !error &&
          groups.map((group) => (
            <section key={group.label} className="flex flex-col gap-4">
              <h2 className="text-sm text-muted-foreground">{group.label}</h2>
              <div className="flex flex-col gap-4">
                {group.posts.map((post) => (
                  <PostRow key={post.id} post={post} />
                ))}
              </div>
            </section>
          ))}
      </motion.div>

      <motion.div variants={item}>
        <SiteFooter />
      </motion.div>
    </motion.main>
  )
}
