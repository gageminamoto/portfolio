"use client"

import {
  useState,
  useEffect,
  type CSSProperties,
  type FocusEvent,
} from "react"
import { motion, useReducedMotion } from "framer-motion"
import Link from "next/link"
import { ChevronLeft, Search, ArrowUpRight } from "lucide-react"
import { ListRow } from "@/components/list-row"
import { ThemeToggle } from "@/components/theme-toggle"
import { SiteFooter } from "@/components/site-footer"
import useSWR from "swr"
import { useDialKit } from "dialkit"
import {
  fadeUp,
  noMotion,
  stagger,
  toolsPanelEnter,
  toolsPanelChild,
  toolListStagger,
  toolListRow,
} from "@/lib/animations"
import { generateSeedTools } from "@/lib/seed-tools"
import { cn } from "@/lib/utils"
import { HOVER_EASE_IN_OUT } from "@/lib/hover-constants"
import { useFinePointerHover } from "@/hooks/use-fine-pointer-hover"
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
          className="flex items-center gap-3 px-0 py-3"
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
  const seedDial = useDialKit("Seed tools", {
    enabled: false,
    count: [5, 1, 20, 1],
  })
  /** 1 = default; higher = snappier hover (padding, text, background fade). */
  const hoverSpeedDial = useDialKit("Tools hover speed", {
    speed: [1, 0.25, 2.5, 0.05],
  })
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("All")
  const [hoveredToolId, setHoveredToolId] = useState<string | null>(null)
  const shouldReduceMotion = useReducedMotion()
  const prefersFinePointer = useFinePointerHover()
  const useFluidListHover = Boolean(!shouldReduceMotion && prefersFinePointer)
  const item = shouldReduceMotion ? noMotion : fadeUp
  const toolsPanelParent = shouldReduceMotion ? noMotion : toolsPanelEnter
  const toolsPanelPiece = shouldReduceMotion ? noMotion : toolsPanelChild
  const toolRowStagger = shouldReduceMotion ? noMotion : toolListStagger
  const toolRowItem = shouldReduceMotion ? noMotion : toolListRow

  const hoverSpeed = Math.max(0.25, hoverSpeedDial.speed)
  const hoverPadMs = Math.round(100 / hoverSpeed)
  const hoverColorMs = Math.round(100 / hoverSpeed)
  const rowPadTransitionStyle: CSSProperties = {
    transitionDuration: `${hoverPadMs}ms`,
    transitionTimingFunction: HOVER_EASE_IN_OUT,
  }
  const textColorTransitionStyle: CSSProperties = {
    transitionDuration: `${hoverColorMs}ms`,
    transitionTimingFunction: HOVER_EASE_IN_OUT,
  }
  const rowHighlightFadeStyle: CSSProperties = {
    transitionDuration: `${hoverPadMs}ms`,
    transitionTimingFunction: HOVER_EASE_IN_OUT,
  }

  const viewMode = activeCategory === "All" ? "list" : "card"

  const { data, error, isLoading } = useSWR<{
    tools: NotionToolItem[]
    lastUpdated: string | null
  }>("/api/tools", fetcher, { revalidateOnFocus: false })

  const realTools = data?.tools ?? []
  const tools = seedDial.enabled
    ? [...realTools, ...generateSeedTools(seedDial.count)]
    : realTools

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

      {/* Search + Filters + Table — nested stagger (ease-out, transform + opacity only) */}
      <motion.div variants={toolsPanelParent} className="flex flex-col gap-5">
        {/* Search */}
        <motion.div variants={toolsPanelPiece} className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          />
        </motion.div>

        {/* Category pills + updated date */}
        <motion.div
          variants={toolsPanelPiece}
          className="flex flex-wrap items-center justify-between gap-3"
        >
          <div
            className="flex flex-wrap items-center gap-2"
            role="group"
            aria-label="Filter by category"
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat.value
              return (
                <button
                  key={cat.value}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveCategory(cat.value)}
                  className={cn(
                    "cursor-pointer rounded-full border px-3 py-1.5 text-sm font-medium transition-colors duration-150 ease motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    isActive
                      ? "border-transparent bg-foreground text-background"
                      : "border-border/60 bg-background text-muted-foreground hover:bg-muted/50",
                  )}
                >
                  {cat.label}
                </button>
              )
            })}
          </div>
          {data?.lastUpdated && (
            <span className="text-xs text-muted-foreground/60">
              Updated {formatLastUpdated(data.lastUpdated)}
            </span>
          )}
        </motion.div>

        {/* Content — loading/error fade as one block; list/cards stagger rows */}
        <motion.div
          variants={isLoading || error ? toolsPanelPiece : toolRowStagger}
          className={cn(
            !isLoading && !error && viewMode === "list" && "flex flex-col",
            !isLoading &&
              !error &&
              viewMode === "card" &&
              "grid grid-cols-2 gap-3",
          )}
          onMouseLeave={
            !isLoading && !error && viewMode === "list" && useFluidListHover
              ? () => setHoveredToolId(null)
              : undefined
          }
        >
        {isLoading ? (
          viewMode === "list" ? <SkeletonRows /> : <SkeletonCards />
        ) : error ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Could not load tools.
          </p>
        ) : viewMode === "list" ? (
          <>
            {useFluidListHover ? (
              <>
                {filtered.map((tool) => {
                  const isSkill = tool.category === "Skills"
                  const displayName = isSkill ? `/${tool.name}` : tool.name
                  const isActive = hoveredToolId === tool.id

                  const clearRowHover = (e: FocusEvent<HTMLElement>) => {
                    const next = e.relatedTarget
                    const row = e.currentTarget.closest("[data-tool-row]")
                    if (next && row?.contains(next)) return
                    setHoveredToolId((h) => (h === tool.id ? null : h))
                  }

                  const rowClass = cn(
                    "relative flex items-center gap-3 overflow-hidden rounded-lg py-3 transition-[padding]",
                    isActive ? "px-3" : "px-0",
                    tool.url &&
                      "group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  )

                  const rowBody = (
                    <>
                      <div
                        className="pointer-events-none absolute inset-0 rounded-lg bg-muted/40 transition-opacity motion-reduce:transition-none"
                        style={{
                          opacity: isActive ? 1 : 0,
                          ...rowHighlightFadeStyle,
                        }}
                        aria-hidden
                      />
                      <div className="relative z-10 flex min-w-0 flex-1 items-center gap-3">
                        <ToolIcon name={tool.name} url={tool.url} />
                        <div className="flex min-w-0 shrink-0">
                          {isSkill ? (
                            <div className="flex items-center gap-1.5">
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs font-medium transition-colors",
                                  tool.url && "group-hover:bg-accent",
                                  isActive
                                    ? "text-foreground"
                                    : "text-muted-foreground",
                                )}
                                style={textColorTransitionStyle}
                              >
                                {displayName}
                                {tool.url ? (
                                  <ArrowUpRight
                                    size={10}
                                    className={cn(
                                      "shrink-0 transition-colors",
                                      isActive
                                        ? "text-muted-foreground"
                                        : "text-muted-foreground/50",
                                    )}
                                    style={textColorTransitionStyle}
                                    aria-hidden
                                  />
                                ) : null}
                              </span>
                            </div>
                          ) : (
                            <span
                              className={cn(
                                "truncate text-sm font-medium transition-colors",
                                isActive
                                  ? "text-foreground"
                                  : "text-muted-foreground",
                              )}
                              style={textColorTransitionStyle}
                            >
                              {displayName}
                            </span>
                          )}
                        </div>
                        <span
                          className={cn(
                            "min-w-0 flex-1 truncate text-right text-xs transition-colors",
                            isActive
                              ? "text-muted-foreground"
                              : "text-muted-foreground/55",
                          )}
                          style={textColorTransitionStyle}
                        >
                          {tool.description}
                        </span>
                      </div>
                    </>
                  )

                  return tool.url ? (
                    <motion.a
                      key={tool.id}
                      variants={toolRowItem}
                      data-tool-row={tool.id}
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={rowClass}
                      style={rowPadTransitionStyle}
                      onMouseEnter={() => setHoveredToolId(tool.id)}
                      onFocus={() => setHoveredToolId(tool.id)}
                      onBlur={clearRowHover}
                      aria-label={`${displayName} — ${tool.description}`}
                    >
                      {rowBody}
                    </motion.a>
                  ) : (
                    <motion.div
                      key={tool.id}
                      variants={toolRowItem}
                      data-tool-row={tool.id}
                      className={rowClass}
                      style={rowPadTransitionStyle}
                      onMouseEnter={() => setHoveredToolId(tool.id)}
                    >
                      {rowBody}
                    </motion.div>
                  )
                })}
              </>
            ) : (
              filtered.map((tool) => {
                const isSkill = tool.category === "Skills"
                const displayName = isSkill ? `/${tool.name}` : tool.name

                const nameNode = isSkill ? (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs font-medium text-foreground transition-colors",
                      tool.url && "group-hover:bg-accent",
                    )}
                  >
                    {displayName}
                    {tool.url ? (
                      <ArrowUpRight size={10} className="shrink-0 text-muted-foreground" aria-hidden />
                    ) : null}
                  </span>
                ) : (
                  displayName
                )

                return (
                  <ListRow
                    key={tool.id}
                    href={tool.url}
                    external
                    icon={<ToolIcon name={tool.name} url={tool.url} />}
                    name={nameNode}
                    meta={tool.description}
                    variants={toolRowItem}
                    style={rowPadTransitionStyle}
                    aria-label={`${displayName} — ${tool.description}`}
                  />
                )
              })
            )}
            {filtered.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No tools found.
              </p>
            )}
          </>
        ) : (
          <>
            {filtered.map((tool) => {
              const isSkill = tool.category === "Skills"
              const displayName = isSkill ? `/${tool.name}` : tool.name
              const cardClassName =
                "group flex flex-col gap-2 rounded-xl border border-border/50 p-5 transition-colors hover:bg-muted/50"

              return tool.url ? (
                <motion.a
                  key={tool.id}
                  variants={toolRowItem}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cardClassName}
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
                </motion.a>
              ) : (
                <motion.div key={tool.id} variants={toolRowItem} className={cardClassName}>
                  <ToolIcon name={tool.name} url={tool.url} />
                  {isSkill ? (
                    <span className="w-fit rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs font-medium text-foreground">
                      {displayName}
                    </span>
                  ) : (
                    <h3 className="text-sm font-medium text-foreground">{displayName}</h3>
                  )}
                  <p className="line-clamp-2 text-xs text-muted-foreground">{tool.description}</p>
                </motion.div>
              )
            })}
            {filtered.length === 0 && (
              <p className="col-span-2 py-8 text-center text-sm text-muted-foreground">
                No tools found.
              </p>
            )}
          </>
        )}
        </motion.div>
      </motion.div>

      <motion.div variants={item}>
        <SiteFooter />
      </motion.div>
    </motion.main>
  )
}
