"use client"

import Link from "next/link"
import useSWR from "swr"
import { useState, useCallback, useEffect } from "react"
import { useDialKit } from "dialkit"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ChevronLeft, Link as LinkIcon, Check } from "lucide-react"
import { CopyFeedbackIcon } from "@/components/copy-feedback-icon"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotionBlocksRenderer } from "@/components/writing/notion-blocks-renderer"
import {
  TableOfContents,
  extractHeadings,
} from "@/components/writing/table-of-contents"
import { ArticleFooter } from "@/components/writing/article-footer"
import { generateSeedPosts, getSeedPost, generateSeedBlocks } from "@/lib/seed-posts"
import { fadeUp, noMotion, stagger } from "@/lib/animations"
import type { NotionWritingPost, NotionBlock } from "@/lib/notion"

async function fetcher(url: string) {
  const response = await fetch(url)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.error ?? "Failed to fetch article")
  }

  return data
}

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

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)

    function updateMatches() {
      setMatches(media.matches)
    }

    updateMatches()
    media.addEventListener("change", updateMatches)

    return () => media.removeEventListener("change", updateMatches)
  }, [query])

  return matches
}

interface ArticleContentProps {
  slug: string
  from?: string
  initialPost?: NotionWritingPost
}

export function ArticleContent({ slug, from, initialPost }: ArticleContentProps) {
  const [copied, setCopied] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const isMobileTocVisible = useMediaQuery("(max-width: 47.999rem)")
  const isDesktopTocVisible = useMediaQuery("(min-width: 80rem)")
  const item = shouldReduceMotion ? noMotion : fadeUp
  const dial = useDialKit("Seed Posts", {
    enabled: false,
    count: [5, 1, 20, 1],
  })

  const isFromHome = from === "home"
  const backLabel = isFromHome ? "Home" : "Writing"
  const backHref = isFromHome ? "/" : "/writing"

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      const textarea = document.createElement("textarea")
      textarea.value = window.location.href
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    }
  }, [])

  const isSeed = slug.startsWith("seed-")

  const { data, error, isLoading } = useSWR<{
    post: NotionWritingPost
    blocks: NotionBlock[]
    allPosts: NotionWritingPost[]
  }>(isSeed ? null : `/api/writing/${slug}`, fetcher, {
    revalidateOnFocus: false,
  })

  const seedPost = isSeed ? getSeedPost(slug) : null
  const seedBlocks = isSeed ? generateSeedBlocks() : []

  const post = seedPost ?? data?.post ?? initialPost
  const blocks = isSeed ? seedBlocks : (data?.blocks ?? [])
  const realPosts = data?.allPosts ?? []
  const allPosts = dial.enabled || isSeed
    ? [...realPosts, ...generateSeedPosts(dial.count)]
    : realPosts

  // Find previous and next articles chronologically
  const currentIndex = allPosts.findIndex((p) => p.slug === slug)
  const prevPost =
    currentIndex > 0 ? allPosts[currentIndex - 1] : null
  const nextPost =
    currentIndex >= 0 && currentIndex < allPosts.length - 1
      ? allPosts[currentIndex + 1]
      : null

  const headings = extractHeadings(blocks)

  const hasFooter = (isSeed || (!isLoading && !error)) && (prevPost || nextPost)

  return (
    <motion.div
      variants={shouldReduceMotion ? undefined : stagger}
      initial="hidden"
      animate="show"
    >
      {/* Fixed desktop tracks keep the article centered while letting the TOC sidebar stick normally. */}
      <div
        className={`mx-auto w-full px-6 pt-16 md:pt-24 ${hasFooter ? "pb-0" : "pb-16 md:pb-24"} xl:grid xl:grid-cols-[clamp(16rem,18vw,20rem)_minmax(0,36rem)_clamp(16rem,18vw,20rem)] xl:items-start xl:justify-center`}
      >
          {/* Left spacer balances the TOC width so the article stays centered. */}
          <div className="hidden xl:block" />

          <main id="main-content" className="min-w-0 max-w-xl xl:max-w-none mx-auto w-full">
            {/* Header */}
            <motion.header variants={item} className="mb-10 flex flex-col gap-6">
              <nav className="flex items-center justify-between">
                <Link
                  href={backHref}
                  className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                >
                  <ChevronLeft className="h-3.5 w-3.5 transition-transform duration-150 ease-out group-hover:-translate-x-0.5" aria-hidden="true" />
                  {backLabel}
                </Link>
                <div className="flex items-center gap-1" aria-label="Article actions">
                  <div className="flex h-8 w-8 items-center justify-center">
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      aria-label={copied ? "Link copied" : "Copy link"}
                      className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-[color,transform] duration-150 ease-out hover:text-foreground active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <CopyFeedbackIcon
                        copied={copied}
                        idleIcon={<LinkIcon className="h-3.5 w-3.5" aria-hidden="true" />}
                        copiedIcon={<Check className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />}
                      />
                    </button>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center">
                    <ThemeToggle />
                  </div>
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
            </motion.header>

            {/* Mobile TOC */}
            <AnimatePresence initial={false}>
              {!isLoading && !error && headings.length > 0 && isMobileTocVisible && (
                <motion.div
                  key="mobile-toc"
                  initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.2,
                    ease: [0.215, 0.61, 0.355, 1],
                  }}
                  className="will-change-transform"
                >
                  <TableOfContents headings={headings} variant="collapsible" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Content */}
            <motion.div variants={item}>
              {!isSeed && isLoading && <ArticleSkeleton />}

              {!isSeed && error && (
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-muted-foreground">
                    Could not load article.
                  </p>
                  <Link
                    href="/writing"
                    className="text-sm text-muted-foreground underline decoration-dashed decoration-2 decoration-muted-foreground/40 underline-offset-4 transition-colors duration-150 ease-out hover:text-primary"
                  >
                    Back to writing
                  </Link>
                </div>
              )}

              {(isSeed || (!isLoading && !error)) && blocks.length > 0 && (
                <article>
                  <NotionBlocksRenderer blocks={blocks} />
                </article>
              )}
            </motion.div>
          </main>

          {/* Desktop TOC sidebar */}
          <div className="relative xl:sticky xl:top-6 xl:max-h-[calc(100vh-3rem)] xl:self-start xl:overflow-y-auto xl:pl-10 max-xl:pointer-events-none max-xl:fixed max-xl:right-6 max-xl:top-24 max-xl:z-20 max-xl:w-[min(18rem,calc(100vw-3rem))]">
            <AnimatePresence initial={false}>
              {!isLoading && !error && headings.length > 0 && isDesktopTocVisible && (
                <motion.aside
                  key="desktop-toc"
                  initial={shouldReduceMotion ? false : { opacity: 0, x: 16 }}
                  animate={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 10 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.22,
                    ease: [0.215, 0.61, 0.355, 1],
                  }}
                  className="will-change-transform"
                >
                  <TableOfContents headings={headings} variant="list" />
                </motion.aside>
              )}
            </AnimatePresence>
          </div>
      </div>

      {hasFooter && (
        <motion.div variants={item} className="px-6">
          <ArticleFooter prevPost={prevPost} nextPost={nextPost} />
        </motion.div>
      )}
    </motion.div>
  )
}
