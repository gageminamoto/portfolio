"use client"

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { BackLink } from "@/components/back-link"
import { ListRow } from "@/components/list-row"
import { SiteFooter } from "@/components/site-footer"
import { PageActions } from "@/components/page-actions"
import { IconChevronDown } from "@/components/site-icons"
import { EarlyDesignHoverNote } from "@/components/early-design/early-design-hover-note"
import {
  earlyDesignResources,
  getResourceHost,
} from "@/lib/early-design-resources"
import {
  EARLY_DESIGN_NOTE_CSS_VARS,
  EARLY_DESIGN_NOTE_MOTION,
} from "@/lib/early-design-note-motion"
import { fadeUp, noMotion, stagger } from "@/lib/animations"
import { cn } from "@/lib/utils"

const linkRowClass =
  "focus-within:bg-transparent focus-within:px-0 focus-visible:bg-muted focus-visible:px-3"

const HOVER_NOTE_ID = "early-design-hover-note"

export function EarlyDesignPage() {
  const shouldReduceMotion = useReducedMotion()
  const item = shouldReduceMotion ? noMotion : fadeUp
  const listRef = useRef<HTMLUListElement>(null)
  const listAnchorRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<(HTMLLIElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [noteTopPx, setNoteTopPx] = useState(0)
  const [expandedMobileIndex, setExpandedMobileIndex] = useState<number | null>(
    null,
  )
  const mobileNoteRegionId = useId()
  const [desktopNoteEnabled, setDesktopNoteEnabled] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)")
    const update = () => setDesktopNoteEnabled(mql.matches)
    update()
    mql.addEventListener("change", update)
    return () => mql.removeEventListener("change", update)
  }, [])

  const activeResource =
    activeIndex != null ? earlyDesignResources[activeIndex] : null
  const activeNote = activeResource?.note

  const syncNotePosition = () => {
    if (activeIndex == null) return
    const row = rowRefs.current[activeIndex]
    const anchor = listAnchorRef.current
    if (!row || !anchor) return
    setNoteTopPx(row.offsetTop + EARLY_DESIGN_NOTE_MOTION.offsetY)
  }

  useLayoutEffect(() => {
    syncNotePosition()
  }, [activeIndex])

  useEffect(() => {
    if (activeIndex == null) return
    const onResize = () => syncNotePosition()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [activeIndex])

  const clearActive = () => setActiveIndex(null)

  const handleListMouseLeave = (event: React.MouseEvent<HTMLUListElement>) => {
    const next = event.relatedTarget
    if (next instanceof Node && listRef.current?.contains(next)) return
    clearActive()
  }

  const handleListFocusOut = (event: React.FocusEvent<HTMLUListElement>) => {
    const next = event.relatedTarget
    if (next instanceof Node && listRef.current?.contains(next)) return
    clearActive()
  }

  const motionStyle = {
    [EARLY_DESIGN_NOTE_CSS_VARS.offsetX]: `${EARLY_DESIGN_NOTE_MOTION.offsetX}px`,
    [EARLY_DESIGN_NOTE_CSS_VARS.duration]: `${EARLY_DESIGN_NOTE_MOTION.durationMs}ms`,
    [EARLY_DESIGN_NOTE_CSS_VARS.maxWidth]: `${EARLY_DESIGN_NOTE_MOTION.maxWidthPx}px`,
  } as React.CSSProperties

  return (
    <motion.main
      id="main-content"
      className="mx-auto flex min-h-screen max-w-xl flex-col gap-12 px-6 py-16 md:py-24"
      variants={shouldReduceMotion ? undefined : stagger}
      initial="hidden"
      animate="show"
    >
      <motion.header variants={item}>
        <nav className="flex items-center justify-between">
          <BackLink href="/">Home</BackLink>
          <PageActions />
        </nav>
      </motion.header>

      <motion.div variants={item}>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground [text-wrap:balance]">
          Early design resources
        </h1>
      </motion.div>

      <motion.div variants={item}>
        <div
          ref={listAnchorRef}
          className="relative"
          style={motionStyle}
        >
          <ul
            ref={listRef}
            className="flex flex-col"
            onMouseLeave={handleListMouseLeave}
            onFocusOut={handleListFocusOut}
          >
            {earlyDesignResources.map((resource, index) => {
              const host = resource.url
                ? getResourceHost(resource.url)
                : undefined
              const isActive = index === activeIndex
              const noteExpanded = expandedMobileIndex === index
              const mobileNoteId = `${mobileNoteRegionId}-${index}`
              const hoverNoteDescribedBy =
                desktopNoteEnabled && isActive && resource.note
                  ? HOVER_NOTE_ID
                  : undefined

              return (
                <li
                  key={resource.title}
                  ref={(node) => {
                    rowRefs.current[index] = node
                  }}
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
                    aria-describedby={hoverNoteDescribedBy}
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

          <AnimatePresence mode="wait">
            {activeNote && activeIndex != null ? (
              <EarlyDesignHoverNote
                key={activeIndex}
                note={activeNote}
                topPx={noteTopPx}
                noteId={HOVER_NOTE_ID}
              />
            ) : null}
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <SiteFooter />
      </motion.div>
    </motion.main>
  )
}
