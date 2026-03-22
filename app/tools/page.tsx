"use client"

import { useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import Link from "next/link"
import { ChevronLeft, Search, ArrowUpRight } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { SiteFooter } from "@/components/site-footer"
import useSWR from "swr"
import { fadeUp, noMotion, stagger } from "@/lib/animations"
import type { NotionToolItem, ToolCategory } from "@/lib/notion"

async function fetcher(url: string) {
  const response = await fetch(url)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.error ?? "Failed to fetch tools")
  }

  return data
}

type FilterCategory = "All" | ToolCategory

function formatLastUpdated(dateStr: string | null): string {
  if (!dateStr) return ""
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function ToolIcon({ name, url }: { name: string; url: string | null }) {
  const initials = name.slice(0, 2)
  const [failed, setFailed] = useState(false)
  let hostname: string | null = null

  if (url) {
    try {
      hostname = new URL(url).hostname
    } catch {
      hostname = null
    }
  }

  if (hostname && !failed) {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`}
          alt=""
          className="size-5 rounded-sm"
          onError={() => setFailed(true)}
        />
      </div>
    )
  }

  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
      <span className="font-mono text-[11px] font-semibold text-muted-foreground">
        {initials}
      </span>
    </div>
  )
}

function SkeletonRows() {
  return (
    <div className="flex flex-col" aria-busy="true" aria-label="Loading tools">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center gap-3 border-b border-border/40 py-3 last:border-b-0"
        >
          <div className="h-8 w-8 shrink-0 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-28 shrink-0 animate-pulse rounded bg-muted" />
          <div className="h-3 w-44 flex-1 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  )
}

function SkeletonCards() {
  return (
    <div className="grid grid-cols-2 gap-3" aria-busy="true" aria-label="Loading tools">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex flex-col gap-3 rounded-xl border border-border/50 p-5"
        >
          <div className="h-8 w-8 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-3 w-full animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  )
}

export default function ToolsPage() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("All")
  const shouldReduceMotion = useReducedMotion()
  const item = shouldReduceMotion ? noMotion : fadeUp

  const viewMode = activeCategory === "All" ? "list" : "card"

  const { data, error, isLoading } = useSWR<{
    tools: NotionToolItem[]
    lastUpdated: string | null
  }>("/api/tools", fetcher, { revalidateOnFocus: false })

  const tools = data?.tools ?? []

  const filtered = tools.filter((t) => {
    const matchesCategory =
      activeCategory === "All" || t.category === activeCategory
    const matchesSearch =
      search === "" ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const categories: { value: FilterCategory; label: string }[] = [
    { value: "All", label: "All" },
    { value: "Build", label: "Build" },
    { value: "Productivity", label: "Productivity" },
    { value: "Skills", label: "Skills" },
  ]

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
          className="inline-flex items-center gap-1 rounded-sm text-sm text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Home
        </Link>
        <ThemeToggle />
      </motion.header>

      {/* Title */}
      <motion.div variants={item} className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground [text-wrap:balance]">
          Tools
        </h1>
        <p className="text-sm text-muted-foreground">
          Everything I build with, stay productive, and keep learning.
        </p>
      </motion.div>

      {/* Search + Filters + Table */}
      <motion.div variants={item} className="flex flex-col gap-5">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          />
        </div>

        {/* Filter tabs + view toggle + updated date */}
        <div className="flex items-baseline justify-between gap-3">
          <div className="flex items-center gap-4">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`cursor-pointer text-sm transition-opacity duration-150 ease-out hover:opacity-70 ${
                  activeCategory === cat.value
                    ? "font-medium text-foreground underline underline-offset-4 decoration-foreground/50"
                    : "text-muted-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          {data?.lastUpdated && (
            <span className="text-xs text-muted-foreground/60">
              Updated {formatLastUpdated(data.lastUpdated)}
            </span>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          viewMode === "list" ? <SkeletonRows /> : <SkeletonCards />
        ) : error ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Could not load tools.
          </p>
        ) : viewMode === "list" ? (
          <div className="flex flex-col">
            {filtered.map((tool) => {
              const isSkill = tool.category === "Skills"
              const displayName = isSkill ? `/${tool.name}` : tool.name

              return (
                <div
                  key={tool.id}
                  className="flex items-center gap-3 border-b border-border/40 px-3 py-3 rounded-lg transition-colors duration-100 last:border-b-0 hover:bg-muted/30"
                >
                  <ToolIcon name={tool.name} url={tool.url} />
                  <div className="flex min-w-0 shrink-0">
                    {isSkill ? (
                      <div className="flex items-center gap-1.5">
                        {tool.url ? (
                          <a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs font-medium text-foreground transition-colors duration-150 hover:bg-accent"
                          >
                            {displayName}
                            <ArrowUpRight
                              size={10}
                              className="shrink-0 text-muted-foreground"
                            />
                          </a>
                        ) : (
                          <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs font-medium text-foreground">
                            {displayName}
                          </span>
                        )}
                      </div>
                    ) : tool.url ? (
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate text-sm font-medium text-foreground transition-colors duration-150 hover:text-foreground/70"
                      >
                        {displayName}
                      </a>
                    ) : (
                      <span className="truncate text-sm font-medium text-foreground">
                        {displayName}
                      </span>
                    )}
                  </div>
                  <span className="min-w-0 flex-1 truncate text-right text-xs text-muted-foreground">
                    {tool.description}
                  </span>
                </div>
              )
            })}
            {filtered.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No tools found.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((tool) => {
              const isSkill = tool.category === "Skills"
              const displayName = isSkill ? `/${tool.name}` : tool.name
              const Wrapper = tool.url ? "a" : "div"
              const linkProps = tool.url
                ? { href: tool.url, target: "_blank" as const, rel: "noopener noreferrer" }
                : {}

              return (
                <Wrapper
                  key={tool.id}
                  {...linkProps}
                  className="group flex flex-col gap-2 rounded-xl border border-border/50 p-5 transition-colors hover:bg-muted/50"
                >
                  <ToolIcon name={tool.name} url={tool.url} />
                  {isSkill ? (
                    <span className="w-fit rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs font-medium text-foreground">
                      {displayName}
                    </span>
                  ) : (
                    <h3 className="text-sm font-medium text-foreground">{displayName}</h3>
                  )}
                  <p className="line-clamp-2 text-xs text-muted-foreground">{tool.description}</p>
                </Wrapper>
              )
            })}
            {filtered.length === 0 && (
              <p className="col-span-2 py-8 text-center text-sm text-muted-foreground">
                No tools found.
              </p>
            )}
          </div>
        )}
      </motion.div>

      <motion.div variants={item}>
        <SiteFooter />
      </motion.div>
    </motion.main>
  )
}
