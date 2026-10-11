"use client"

import { useEffect, useId, useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { BackLink } from "@/components/back-link"
import { ListRow } from "@/components/list-row"
import { SiteFooter } from "@/components/site-footer"
import { PageActions } from "@/components/page-actions"
import { IconChevronDown } from "@/components/site-icons"
import { EarlyDesignResourcePanel } from "@/components/early-design/early-design-resource-panel"
import {
  earlyDesignResources,
  getResourceHost,
} from "@/lib/early-design-resources"
import { fadeUp, noMotion, stagger } from "@/lib/animations"
import { cn } from "@/lib/utils"

const linkRowClass =
  "focus-within:bg-transparent focus-within:px-0 focus-visible:bg-muted focus-visible:px-3"

const PANEL_NOTE_ID = "early-design-panel-note"

export function EarlyDesignPage() {
  const shouldReduceMotion = useReducedMotion()
  const item = shouldReduceMotion ? noMotion : fadeUp
  const listRef = useRef<HTMLUListElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [expandedMobileIndex, setExpandedMobileIndex] = useState<number | null>(
    null,
  )
  const mobileNoteRegionId = useId()
  const [sidePanelEnabled, setSidePanelEnabled] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)")
    const update = () => setSidePanelEnabled(mql.matches)
    update()
    mql.addEventListener("change", update)
    return () => mql.removeEventListener("change", update)
  }, [])

  const activeResource =
    earlyDesignResources[activeIndex] ?? earlyDesignResources[0]

  const handleListMouseLeave = (event: React.MouseEvent<HTMLUListElement>) => {
    const next = event.relatedTarget
    if (next instanceof Node && listRef.current?.contains(next)) return
    setActiveIndex(0)
  }

  return (
    <motion.main
      id="main-content"
      className="mx-auto flex min-h-screen max-w-xl flex-col gap-12 px-6 py-16 lg:max-w-none lg:px-8 lg:py-24 xl:max-w-6xl"
      variants={shouldReduceMotion ? undefined : stagger}
      initial="hidden"
      animate="show"
    >
      <motion.header variants={item} className="lg:max-w-xl">
        <nav className="flex items-center justify-between">
          <BackLink href="/">Home</BackLink>
          <PageActions />
        </nav>
      </motion.header>

      <motion.div variants={item} className="lg:max-w-xl">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground [text-wrap:balance]">
          Early design resources
        </h1>
      </motion.div>

      <motion.div
        variants={item}
        className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-10 xl:gap-14"
      >
        <ul
          ref={listRef}
          className="flex min-w-0 flex-1 flex-col lg:max-w-xl"
          onMouseLeave={handleListMouseLeave}
        >
          {earlyDesignResources.map((resource, index) => {
            const host = resource.url ? getResourceHost(resource.url) : undefined
            const isActive = index === activeIndex
            const noteExpanded = expandedMobileIndex === index
            const mobileNoteId = `${mobileNoteRegionId}-${index}`
            const panelDescribedBy =
              sidePanelEnabled && isActive && resource.note
                ? PANEL_NOTE_ID
                : undefined

            return (
              <li
                key={resource.title}
                className="border-b border-transparent"
                onMouseEnter={() => setActiveIndex(index)}
                onFocusCapture={() => setActiveIndex(index)}
              >
                <ListRow
                  href={resource.url}
                  external={Boolean(resource.url)}
                  name={resource.title}
                  meta={host}
                  aria-label={
                    resource.url
                      ? `${resource.title} (opens in new tab)`
                      : resource.title
                  }
                  aria-describedby={panelDescribedBy}
                  className={resource.url ? linkRowClass : undefined}
                />
                {resource.note ? (
                  <div className="lg:hidden">
                    <button
                      type="button"
                      className="-mt-1 mb-2 flex w-full items-center gap-1.5 rounded-md py-1.5 pl-0 text-left text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      aria-expanded={noteExpanded}
                      aria-controls={mobileNoteId}
                      onClick={() =>
                        setExpandedMobileIndex((current) =>
                          current === index ? null : index,
                        )
                      }
                    >
                      <IconChevronDown
                        className={cn(
                          "size-3.5 shrink-0 transition-transform duration-150 ease-out motion-reduce:transition-none",
                          noteExpanded && "rotate-180",
                        )}
                        aria-hidden
                      />
                      {noteExpanded ? "Hide note" : "Show note"}
                    </button>
                    {noteExpanded ? (
                      <p
                        id={mobileNoteId}
                        className="mb-3 text-pretty text-sm leading-relaxed text-muted-foreground"
                      >
                        {resource.note}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </li>
            )
          })}
        </ul>

        <aside
          className="hidden w-64 shrink-0 lg:block xl:w-72"
          aria-label="Resource preview"
        >
          <div
            className="sticky top-24 rounded-xl border border-border/60 bg-card px-4 py-4 shadow-sm"
            aria-live="polite"
            aria-atomic="true"
          >
            {activeResource ? (
              <EarlyDesignResourcePanel
                resource={activeResource}
                noteId={PANEL_NOTE_ID}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Hover or focus a link to preview its note.
              </p>
            )}
          </div>
        </aside>
      </motion.div>

      <motion.div variants={item} className="lg:max-w-xl">
        <SiteFooter />
      </motion.div>
    </motion.main>
  )
}
