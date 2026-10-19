"use client"

import { useState } from "react"
import useSWR from "swr"
import { useReducedMotion } from "framer-motion"
import { IconArrowUpRight, IconChevronDown } from "@/components/site-icons"
import { ListRow, type ListRowFluidHover } from "@/components/list-row"
import { AffiliateLabel, ToolIcon, toolAriaLabel } from "@/components/tool-parts"
import type { NotionToolItem } from "@/lib/notion"
import { toolLinkRel } from "@/lib/affiliate-links"
import { cn } from "@/lib/utils"
import { useFinePointerHover } from "@/hooks/use-fine-pointer-hover"
import { buildListRowFluidHover } from "@/lib/list-row-fluid-hover"

export async function toolsFetcher(url: string) {
  const response = await fetch(url)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.error ?? "Failed to fetch tools")
  }

  return data
}
const INITIAL_COUNT = 5

interface ToolsSectionProps {
  /** Local preview tools appended after the real ones (DialKit seeding). */
  seedTools?: NotionToolItem[]
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-0 py-3">
      <div className="h-8 w-8 shrink-0 animate-pulse rounded-md bg-muted motion-reduce:animate-none" />
      <div className="h-4 w-28 shrink-0 animate-pulse rounded-sm bg-muted motion-reduce:animate-none" />
      <div className="h-3 w-44 flex-1 animate-pulse rounded-sm bg-muted motion-reduce:animate-none" />
    </div>
  )
}

function ToolName({ tool }: { tool: NotionToolItem }) {
  const isSkill = tool.category === "Skills"

  return (
    <span className="inline-flex items-center gap-1.5">
      {isSkill ? (
        <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs font-medium">
          /{tool.name}
          {tool.url ? (
            <IconArrowUpRight className="h-2.5 w-2.5 shrink-0 text-muted-foreground/50" />
          ) : null}
        </span>
      ) : (
        tool.name
      )}
      {tool.affiliate ? <AffiliateLabel /> : null}
    </span>
  )
}

function ToolListRow({
  tool,
  fluidHover,
}: {
  tool: NotionToolItem
  fluidHover?: ListRowFluidHover
}) {
  const displayName = tool.category === "Skills" ? `/${tool.name}` : tool.name

  return (
    <ListRow
      href={tool.url}
      external
      rel={toolLinkRel(Boolean(tool.url) && tool.affiliate)}
      icon={<ToolIcon name={tool.name} url={tool.url} />}
      name={<ToolName tool={tool} />}
      meta={tool.description}
      fluidHover={fluidHover}
      aria-label={toolAriaLabel(displayName, tool.description, tool.affiliate)}
    />
  )
}

/** Just the list of tools, for the homepage. The full page adds search and filters. */
export function ToolsSection({ seedTools }: ToolsSectionProps) {
  const [expanded, setExpanded] = useState(false)
  const [hoveredToolId, setHoveredToolId] = useState<string | null>(null)
  const shouldReduceMotion = useReducedMotion()
  const prefersFinePointer = useFinePointerHover({ minWidth: 768 })
  const useFluidListHover = Boolean(!shouldReduceMotion && prefersFinePointer)
  const { data, error, isLoading } = useSWR<{ tools: NotionToolItem[] }>(
    "/api/tools",
    toolsFetcher,
    { revalidateOnFocus: false },
  )

  const tools = [...(data?.tools ?? []), ...(seedTools ?? [])]

  if (error && !data && tools.length === 0) {
    return <p className="text-sm text-muted-foreground">Could not load tools.</p>
  }

  if (isLoading && !data) {
    return (
      <div className="flex flex-col" aria-busy="true" aria-label="Loading tools">
        {[0, 1, 2].map((i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    )
  }

  if (tools.length === 0) {
    return <p className="text-sm text-muted-foreground">No tools yet.</p>
  }

  const hasMore = tools.length > INITIAL_COUNT

  const rowFluidHover = (toolId: string) =>
    useFluidListHover
      ? buildListRowFluidHover(hoveredToolId, toolId, setHoveredToolId)
      : undefined

  return (
    <div
      className="flex flex-col"
      onMouseLeave={useFluidListHover ? () => setHoveredToolId(null) : undefined}
      style={!expanded && hasMore ? { maskImage: "linear-gradient(to bottom, black calc(100% - 2rem), transparent)" } : undefined}
    >
      {tools.slice(0, INITIAL_COUNT).map((tool) => (
        <ToolListRow key={tool.id} tool={tool} fluidHover={rowFluidHover(tool.id)} />
      ))}

      {hasMore && (
        <>
          <div
            className={cn(
              "grid transition-[grid-template-rows] duration-300 ease-out",
              expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            )}
          >
            <div className="overflow-hidden">
              <div className="flex flex-col">
                {tools.slice(INITIAL_COUNT).map((tool) => (
                  <ToolListRow key={tool.id} tool={tool} fluidHover={rowFluidHover(tool.id)} />
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="group flex cursor-pointer items-center justify-center py-1"
            aria-expanded={expanded}
            aria-label={expanded ? "Show fewer tools" : `Show ${tools.length - INITIAL_COUNT} more tools`}
          >
            <IconChevronDown
              className={cn(
                "size-4 text-muted-foreground transition-[color,transform] duration-200 ease-out group-hover:text-foreground",
                expanded && "rotate-180",
              )}
            />
          </button>
        </>
      )}
    </div>
  )
}
