"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { BackLink } from "@/components/back-link"
import { ListRow } from "@/components/list-row"
import { SiteFooter } from "@/components/site-footer"
import { PageActions } from "@/components/page-actions"
import { EarlyDesignHoverNote } from "@/components/early-design/early-design-hover-note"
import {
  earlyDesignResources,
  getResourceHost,
} from "@/lib/early-design-resources"
import {
  EARLY_DESIGN_NOTE_CSS_VARS,
  EARLY_DESIGN_NOTE_MOTION,
  getEarlyDesignRowTransitionMs,
} from "@/lib/early-design-note-motion"
import { fadeUp, noMotion, stagger } from "@/lib/animations"

const linkRowClass =
  "focus-within:bg-transparent focus-within:px-0 focus-visible:bg-muted focus-visible:px-3"

const HOVER_NOTE_ID = "early-design-hover-note"

export function EarlyDesignPage() {
  const shouldReduceMotion = useReducedMotion()
  const item = shouldReduceMotion ? noMotion : fadeUp
  const listRef = useRef<HTMLUListElement>(null)
  const listAnchorRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<(HTMLLIElement | null)[]>([])
  const [hoverRows, setHoverRows] = useState<{
    activeIndex: number | null
    prevActiveIndex: number | null
  }>({ activeIndex: null, prevActiveIndex: null })
  const { activeIndex, prevActiveIndex } = hoverRows

  const setActiveRow = (next: number | null) => {
    setHoverRows(({ activeIndex: current }) => ({
      prevActiveIndex: current,
      activeIndex: next,
    }))
  }
  const [noteTopPx, setNoteTopPx] = useState(0)
  const [desktopNoteEnabled, setDesktopNoteEnabled] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(
      "(min-width: 1024px) and (hover: hover) and (pointer: fine)",
    )
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

  const hideGraceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cancelHideGrace = () => {
    if (hideGraceTimerRef.current != null) {
      clearTimeout(hideGraceTimerRef.current)
      hideGraceTimerRef.current = null
    }
  }

  const clearActive = () => {
    cancelHideGrace()
    setActiveRow(null)
  }

  const scheduleClearActive = () => {
    cancelHideGrace()
    hideGraceTimerRef.current = setTimeout(() => {
      hideGraceTimerRef.current = null
      setActiveRow(null)
    }, EARLY_DESIGN_NOTE_MOTION.hideGraceMs)
  }

  useEffect(() => () => cancelHideGrace(), [])

  const handleRowMouseEnter = (index: number) => {
    cancelHideGrace()
    setActiveRow(index)
  }

  const handleListMouseLeave = (event: React.MouseEvent<HTMLUListElement>) => {
    const next = event.relatedTarget
    if (next instanceof Node && listRef.current?.contains(next)) return
    scheduleClearActive()
  }

  const handleListFocusOut = (event: React.FocusEvent<HTMLUListElement>) => {
    const next = event.relatedTarget
    if (next instanceof Node && listRef.current?.contains(next)) return
    clearActive()
  }

  const motionStyle = {
    [EARLY_DESIGN_NOTE_CSS_VARS.offsetX]: `${EARLY_DESIGN_NOTE_MOTION.offsetX}px`,
    [EARLY_DESIGN_NOTE_CSS_VARS.duration]: `${EARLY_DESIGN_NOTE_MOTION.enterDurationMs}ms`,
    [EARLY_DESIGN_NOTE_CSS_VARS.width]: `${EARLY_DESIGN_NOTE_MOTION.noteWidthPx}px`,
  } as React.CSSProperties

  return (
    <motion.main
      id="main-content"
      className="mx-auto flex min-h-screen max-w-xl flex-col gap-12 px-6 py-16 md:py-24"
      style={motionStyle}
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
        <div ref={listAnchorRef} className="relative w-full">
          <ul
            ref={listRef}
            className="flex flex-col"
            onMouseEnter={cancelHideGrace}
            onMouseLeave={handleListMouseLeave}
            onFocusOut={handleListFocusOut}
          >
            {earlyDesignResources.map((resource, index) => {
              const host = resource.url
                ? getResourceHost(resource.url)
                : undefined
              const isActive = index === activeIndex
              const hoverNoteDescribedBy =
                desktopNoteEnabled && isActive && resource.note
                  ? HOVER_NOTE_ID
                  : undefined

              const spotlight =
                desktopNoteEnabled &&
                activeIndex != null &&
                !shouldReduceMotion
              const dimmed = spotlight && !isActive
              const rowTransitionMs = getEarlyDesignRowTransitionMs(
                index,
                activeIndex,
                prevActiveIndex,
              )

              return (
                <li
                  key={resource.title}
                  ref={(node) => {
                    rowRefs.current[index] = node
                  }}
                  onMouseEnter={() => handleRowMouseEnter(index)}
                  onFocusCapture={() => handleRowMouseEnter(index)}
                  className="transition-[filter,opacity] motion-reduce:transition-none"
                  style={{
                    filter: dimmed
                      ? `blur(${EARLY_DESIGN_NOTE_MOTION.rowBlurPx}px)`
                      : "none",
                    opacity: dimmed
                      ? EARLY_DESIGN_NOTE_MOTION.rowDimOpacity
                      : 1,
                    transitionDuration: `${rowTransitionMs}ms`,
                    transitionTimingFunction: `cubic-bezier(${EARLY_DESIGN_NOTE_MOTION.ease.join(", ")})`,
                  }}
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
                </li>
              )
            })}
          </ul>

          <AnimatePresence>
            {activeNote && activeIndex != null ? (
              <EarlyDesignHoverNote
                key="desktop-hover-note"
                rowKey={activeIndex}
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
