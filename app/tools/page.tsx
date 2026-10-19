"use client"

import {
  useState,
  type CSSProperties,
  type FocusEvent,
} from "react"
import { motion, useReducedMotion } from "framer-motion"
import Link from "next/link"
import { IconArrowUpRight, IconSearch } from "@/components/site-icons"
import { BackLink } from "@/components/back-link"
import { ListRow } from "@/components/list-row"
import useSWR from "swr"
import {
  fadeUp,
  noMotion,
  stagger,
  toolsPanelEnter,
} from "@/lib/animations"
import { toolLinkRel } from "@/lib/affiliate-links"
import { cn } from "@/lib/utils"
import { HOVER_EASE_IN_OUT } from "@/lib/hover-constants"
import { useFinePointerHover } from "@/hooks/use-fine-pointer-hover"
import { getFluidListRowEmphasis } from "@/lib/fluid-list-hover"
import { AffiliateLabel, ToolIcon, toolAriaLabel } from "@/components/tool-parts"
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

const PREFERRED_CATEGORIES: ToolCategory[] = ["Build", "Productivity", "Skills"]

function sortCategories(categories: ToolCategory[]): ToolCategory[] {
  return [...categories].sort((a, b) => {
    const aIndex = PREFERRED_CATEGORIES.indexOf(a)
    const bIndex = PREFERRED_CATEGORIES.indexOf(b)
    const aKnown = aIndex !== -1
    const bKnown = bIndex !== -1

    if (aKnown && bKnown) return aIndex - bIndex
    if (aKnown) return -1
    if (bKnown) return 1
    return a.localeCompare(b, undefined, { sensitivity: "base" })
  })
}

function formatLastUpdated(dateStr: string | null): string {
  if (!dateStr) return ""
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
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
          <div className="h-4 w-28 shrink-0 animate-pulse rounded-sm bg-muted" />
          <div className="h-3 w-44 flex-1 animate-pulse rounded-sm bg-muted" />
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
          <div className="h-4 w-24 animate-pulse rounded-sm bg-muted" />
          <div className="h-3 w-full animate-pulse rounded-sm bg-muted" />
        </div>
      ))}
    </div>
  )
}

export default function ToolsPage() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("All")
  const [hoveredToolId, setHoveredToolId] = useState<string | null>(null)
  const shouldReduceMotion = useReducedMotion()
  const prefersFinePointer = useFinePointerHover()
  const useFluidListHover = Boolean(!shouldReduceMotion && prefersFinePointer)
  const item = shouldReduceMotion ? noMotion : fadeUp
  const toolsPanelParent = shouldReduceMotion ? noMotion : toolsPanelEnter

  const hoverPadMs = 100
  const hoverColorMs = 100
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
  const isPending = isLoading && !data
  const hasError = Boolean(error && !data)

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

  const toolCategories = Array.from(new Set(tools.map((tool) => tool.category)))
  const categories: { value: FilterCategory; label: string }[] = [
    { value: "All", label: "All" },
    ...sortCategories(toolCategories).map((category) => ({
      value: category,
      label: category,
    })),
  ]

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
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground [text-wrap:balance]">
            Tools
          </h1>
          <p className="text-sm text-muted-foreground">
            Everything I build with, stay productive, and keep learning.
          </p>
        </div>
      </motion.header>

      {/* Search, filters, and table enter as one coherent block. */}
      <motion.div variants={toolsPanelParent} className="flex flex-col gap-5">
        {/* Search */}
        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          />
        </div>

        {/* Category pills + updated date */}
        <div className="flex flex-wrap items-center justify-between gap-3">
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
        </div>

        {/* Content — loading/error fade as one block; list/cards stagger rows */}
        <div
          className={cn(
            !isPending && !hasError && viewMode === "list" && "flex flex-col",
            !isPending &&
              !hasError &&
              viewMode === "card" &&
              "grid grid-cols-2 gap-3",
          )}
          onMouseLeave={
            !isPending && !hasError && viewMode === "list" && useFluidListHover
              ? () => setHoveredToolId(null)
              : undefined
          }
        >
        {isPending ? (
          viewMode === "list" ? <SkeletonRows /> : <SkeletonCards />
        ) : hasError ? (
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
                  const { isEmphasized, isHighlighted } = getFluidListRowEmphasis(
                    hoveredToolId,
                    tool.id,
                  )

                  const clearRowHover = (e: FocusEvent<HTMLElement>) => {
                    const next = e.relatedTarget
                    const row = e.currentTarget.closest("[data-tool-row]")
                    if (next && row?.contains(next)) return
                    setHoveredToolId((h) => (h === tool.id ? null : h))
                  }

                  const rowClass = cn(
                    "relative flex items-center gap-3 overflow-hidden rounded-lg py-3 transition-[padding]",
                    isHighlighted ? "px-3" : "px-0",
                    tool.url &&
                      "group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  )

                  const rowBody = (
                    <>
                      <div
                        className="pointer-events-none absolute inset-0 rounded-lg bg-muted/40 transition-opacity motion-reduce:transition-none"
                        style={{
                          opacity: isHighlighted ? 1 : 0,
                          ...rowHighlightFadeStyle,
                        }}
                        aria-hidden
                      />
                      <div className="relative z-10 flex min-w-0 flex-1 items-center gap-3">
                        <ToolIcon name={tool.name} url={tool.url} />
                        <div className="flex min-w-0 shrink-0 items-center gap-1.5">
                          {isSkill ? (
                            <div className="flex items-center gap-1.5">
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs font-medium transition-colors",
                                  tool.url && "group-hover:bg-accent",
                                  isEmphasized
                                    ? "text-foreground"
                                    : "text-muted-foreground",
                                )}
                                style={textColorTransitionStyle}
                              >
                                {displayName}
                                {tool.url ? (
                                  <IconArrowUpRight
                                    className={cn(
                                      "h-2.5 w-2.5 shrink-0 transition-colors",
                                      isEmphasized
                                        ? "text-muted-foreground"
                                        : "text-muted-foreground/50",
                                    )}
                                    style={textColorTransitionStyle}
                                  />
                                ) : null}
                              </span>
                            </div>
                          ) : (
                            <span
                              className={cn(
                                "truncate text-sm font-medium transition-colors",
                                isEmphasized
                                  ? "text-foreground"
                                  : "text-muted-foreground",
                              )}
                              style={textColorTransitionStyle}
                            >
                              {displayName}
                            </span>
                          )}
                          {tool.affiliate ? <AffiliateLabel /> : null}
                        </div>
                        <span
                          className={cn(
                            "min-w-0 flex-1 truncate text-right text-xs transition-colors",
                            isEmphasized
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
                      data-tool-row={tool.id}
                      href={tool.url}
                      target="_blank"
                      rel={toolLinkRel(tool.affiliate)}
                      className={rowClass}
                      style={rowPadTransitionStyle}
                      onMouseEnter={() => setHoveredToolId(tool.id)}
                      onFocus={() => setHoveredToolId(tool.id)}
                      onBlur={clearRowHover}
                      aria-label={toolAriaLabel(
                        displayName,
                        tool.description,
                        tool.affiliate,
                      )}
                    >
                      {rowBody}
                    </motion.a>
                  ) : (
                    <motion.div
                      key={tool.id}
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

                const nameNode = (
                  <span className="inline-flex items-center gap-1.5">
                    {isSkill ? (
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs font-medium text-foreground transition-colors",
                          tool.url && "group-hover:bg-accent",
                        )}
                      >
                        {displayName}
                        {tool.url ? (
                          <IconArrowUpRight className="h-2.5 w-2.5 shrink-0 text-muted-foreground" />
                        ) : null}
                      </span>
                    ) : (
                      displayName
                    )}
                    {tool.affiliate ? <AffiliateLabel /> : null}
                  </span>
                )

                return (
                  <ListRow
                    key={tool.id}
                    href={tool.url}
                    external
                    rel={toolLinkRel(Boolean(tool.url) && tool.affiliate)}
                    icon={<ToolIcon name={tool.name} url={tool.url} />}
                    name={nameNode}
                    meta={tool.description}
                    style={rowPadTransitionStyle}
                    aria-label={toolAriaLabel(
                      displayName,
                      tool.description,
                      tool.affiliate,
                    )}
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

              const cardBody = (
                <>
                  <ToolIcon name={tool.name} url={tool.url} />
                  <div className="flex items-center gap-1.5">
                    {isSkill ? (
                      <span className="w-fit rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs font-medium text-foreground">
                        {displayName}
                      </span>
                    ) : (
                      <h3 className="text-sm font-medium text-foreground">{displayName}</h3>
                    )}
                    {tool.affiliate ? <AffiliateLabel /> : null}
                  </div>
                  <p className="line-clamp-2 text-xs text-muted-foreground">{tool.description}</p>
                </>
              )

              return tool.url ? (
                <motion.a
                  key={tool.id}
                  href={tool.url}
                  target="_blank"
                  rel={toolLinkRel(tool.affiliate)}
                  className={cardClassName}
                  aria-label={toolAriaLabel(
                    displayName,
                    tool.description,
                    tool.affiliate,
                  )}
                >
                  {cardBody}
                </motion.a>
              ) : (
                <motion.div key={tool.id} className={cardClassName}>
                  {cardBody}
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
        </div>
      </motion.div>

    </motion.main>
  )
}
