"use client"

import Link from "next/link"
import useSWR from "swr"
import { ChevronLeft } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { SiteFooter } from "@/components/site-footer"
import type { NotionWritingPost } from "@/lib/notion"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
})

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ""
  return dateFormatter.format(new Date(dateStr))
}

function SkeletonRow() {
  return (
    <div className="flex w-full items-baseline justify-between gap-4">
      <div className="h-4 w-48 animate-pulse rounded bg-muted" />
      <div className="h-3 w-20 shrink-0 animate-pulse rounded bg-muted" />
    </div>
  )
}

export default function WritingPage() {
  const { data, error, isLoading } = useSWR<{ posts: NotionWritingPost[] }>(
    "/api/writing",
    fetcher,
    { revalidateOnFocus: false }
  )

  const posts = data?.posts ?? []

  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-screen max-w-xl flex-col gap-12 px-6 py-16 md:py-24"
    >
      {/* Header */}
      <header className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Home
        </Link>
        <ThemeToggle />
      </header>

      {/* Title */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground [text-wrap:balance]">
          Writing
        </h1>
      </div>

      {/* Posts list */}
      <div className="flex flex-col gap-4">
        {isLoading && (
          <div
            className="flex flex-col gap-3"
            aria-busy="true"
            aria-label="Loading posts\u2026"
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
          posts.map((post) => (
            <div
              key={post.id}
              className="flex w-full items-baseline justify-between gap-4"
            >
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
          ))}
      </div>

      <SiteFooter />
    </main>
  )
}
