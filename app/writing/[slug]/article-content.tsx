"use client"

import Link from "next/link"
import useSWR from "swr"
import { useState, useCallback } from "react"
import { ChevronLeft, Link as LinkIcon, Check } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotionBlocksRenderer } from "@/components/writing/notion-blocks-renderer"
import {
  TableOfContents,
  extractHeadings,
} from "@/components/writing/table-of-contents"
import { ArticleFooter } from "@/components/writing/article-footer"
import type { NotionWritingPost, NotionBlock } from "@/lib/notion"

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

function ArticleSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-label="Loading article\u2026">
      <div className="h-7 w-80 max-w-full animate-pulse rounded bg-muted" />
      <div className="h-4 w-24 animate-pulse rounded bg-muted" />
      <div className="mt-6 flex flex-col gap-3">
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}

interface ArticleContentProps {
  slug: string
  from?: string
}

export function ArticleContent({ slug, from }: ArticleContentProps) {
  const [copied, setCopied] = useState(false)

  const isFromHome = from === "home"
  const backLabel = isFromHome ? "Home" : "Writing"
  const backHref = isFromHome ? "/" : "/writing"

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement("textarea")
      textarea.value = window.location.href
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [])

  const { data, error, isLoading } = useSWR<{
    post: NotionWritingPost
    blocks: NotionBlock[]
    allPosts: NotionWritingPost[]
  }>(`/api/writing/${slug}`, fetcher, {
    revalidateOnFocus: false,
  })

  const post = data?.post
  const blocks = data?.blocks ?? []
  const allPosts = data?.allPosts ?? []

  // Find next article chronologically
  const currentIndex = allPosts.findIndex((p) => p.slug === slug)
  const nextPost =
    currentIndex >= 0 && currentIndex < allPosts.length - 1
      ? allPosts[currentIndex + 1]
      : null

  const headings = extractHeadings(blocks)

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      <div className="md:grid md:grid-cols-[1fr_200px] md:gap-12">
        <main id="main-content" className="min-w-0 max-w-xl">
          {/* Header */}
          <header className="mb-10 flex flex-col gap-6">
            <nav className="flex items-center justify-between">
              <Link
                href={backHref}
                className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
              >
                <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
                {backLabel}
              </Link>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  aria-label={copied ? "Link copied" : "Copy link"}
                  className="inline-flex items-center text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm cursor-pointer"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                  ) : (
                    <LinkIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                </button>
                <ThemeToggle />
              </div>
            </nav>

            {post && (
              <>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground [text-wrap:balance]">
                  {post.title}
                </h1>
                {post.date && (
                  <time
                    dateTime={post.date}
                    className="text-sm text-muted-foreground"
                  >
                    {formatDate(post.date)}
                  </time>
                )}
              </>
            )}
          </header>

          {/* Mobile TOC */}
          {!isLoading && !error && headings.length > 0 && (
            <div className="md:hidden">
              <TableOfContents headings={headings} />
            </div>
          )}

          {/* Content */}
          {isLoading && <ArticleSkeleton />}

          {error && (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">
                Could not load article.
              </p>
              <Link
                href="/writing"
                className="text-sm text-muted-foreground underline decoration-muted-foreground/40 underline-offset-4 transition-colors duration-150 ease-out hover:text-foreground"
              >
                Back to writing
              </Link>
            </div>
          )}

          {!isLoading && !error && blocks.length > 0 && (
            <article>
              <NotionBlocksRenderer blocks={blocks} />
            </article>
          )}

          {!isLoading && !error && <ArticleFooter nextPost={nextPost} />}
        </main>

        {/* Desktop TOC sidebar */}
        {!isLoading && !error && headings.length > 0 && (
          <aside className="hidden md:block">
            <TableOfContents headings={headings} />
          </aside>
        )}
      </div>
    </div>
  )
}
