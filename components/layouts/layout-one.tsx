"use client"

import { useCallback, useEffect, useLayoutEffect, useState } from "react"
import useSWR from "swr"
import { useDialKit, type TransitionConfig } from "dialkit"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "motion/react"
import { BioSection, type BioLinkToggles } from "@/components/bio-section"
import { CursorTrail } from "@/components/cursor-trail"
import { useGradientWord } from "@/components/gradient-word-context"
import { SocialIcons } from "@/components/social-icons"
import { ToolsSection, toolsFetcher } from "@/components/tools-section"
import { WritingSection, writingFetcher } from "@/components/writing-section"
import { generateSeedTools } from "@/lib/seed-tools"
import { generateSeedPosts } from "@/lib/seed-writing"
import { portfolioData } from "@/lib/portfolio-data"

const easeOut = [0.19, 1, 0.22, 1] as const

/* Bio links that open their list inline under the bio instead of navigating.
 * One list is open at a time; picking the other swaps them. */
const SECTIONS = {
  writing: { href: "/writing", label: "Writing", api: "/api/writing", fetcher: writingFetcher },
  tools: { href: "/tools", label: "Tools", api: "/api/tools", fetcher: toolsFetcher },
} as const
type SectionKey = keyof typeof SECTIONS
const SECTION_KEYS = Object.keys(SECTIONS) as SectionKey[]
const REGION_ID = "home-list"

/* List reveal: the region grows open under the bio while its rows fade in,
 * so the list unrolls from the link that opened it. Closing mirrors it:
 * the rows fade out first, then the region folds back up on the same curve.
 * Tune live in the "List reveal" DialKit panel (dev only). */
const LIST_REVEAL = {
  enter: {
    height: { type: "easing", duration: 0.45, ease: [0.19, 1, 0.22, 1] },
    fadeDuration: [0.3, 0, 1, 0.01],
    fadeDelay: [0.06, 0, 0.5, 0.01],
  },
  exit: {
    height: { type: "easing", duration: 0.4, ease: [0.19, 1, 0.22, 1] },
    heightDelay: [0.06, 0, 0.5, 0.01],
    fadeDuration: [0.25, 0, 1, 0.01],
    fadeDelay: [0, 0, 0.5, 0.01],
  },
  // Writing ↔ tools: the open panel resizes to the new list while the lists
  // crossfade with a small sideways shift that follows the bio sentence.
  swap: {
    height: { type: "easing", duration: 0.3, ease: [0.25, 1, 0.5, 1] },
    fadeDuration: [0.2, 0, 1, 0.01],
    shift: [12, 0, 48, 1],
    blur: [2, 0, 10, 0.5],
  },
  seed: {
    enabled: false,
    posts: [5, 1, 30, 1],
    tools: [8, 1, 23, 1],
  },
  writing: { type: "action", label: "Open / close writing" },
  tools: { type: "action", label: "Open / close tools" },
} as const satisfies Parameters<typeof useDialKit>[1]

/** Tracks an element's rendered height; null until first measured. */
function useHeight() {
  const [el, setEl] = useState<HTMLDivElement | null>(null)
  const [height, setHeight] = useState<number | null>(null)

  // Forget the last height when the element unmounts, so a reopened panel
  // starts from its new content instead of the size it closed at.
  const ref = useCallback((node: HTMLDivElement | null) => {
    setEl(node)
    if (!node) setHeight(null)
  }, [])

  useLayoutEffect(() => {
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      setHeight(entry.borderBoxSize?.[0]?.blockSize ?? el.offsetHeight)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [el])

  return [ref, height] as const
}

/** DialKit transition (easing or spring) → Motion transition. */
function toMotionTransition(config: TransitionConfig): Transition {
  if (config.type === "easing") {
    return { duration: config.duration, ease: config.ease }
  }
  const { type: _type, ...spring } = config
  return { type: "spring", ...spring }
}

export function LayoutOne() {
  const { name, bio, socials, email } = portfolioData
  const { setActiveWord, setCursorTrailActive } = useGradientWord()
  const reduceMotion = useReducedMotion()
  const [openSection, setOpenSection] = useState<SectionKey | null>(null)
  const [wanted, setWanted] = useState<Record<SectionKey, boolean>>({
    writing: false,
    tools: false,
  })
  const [waitedLong, setWaitedLong] = useState(false)

  const want = (key: SectionKey) =>
    setWanted((prev) => (prev[key] ? prev : { ...prev, [key]: true }))
  const toggleSection = (key: SectionKey) => {
    want(key)
    setWaitedLong(false)
    setOpenSection((open) => (open === key ? null : key))
  }

  const reveal = useDialKit("List reveal", LIST_REVEAL, {
    onAction: (action) => {
      if (action === "writing" || action === "tools") toggleSection(action)
    },
  })

  // Warm the shared cache on hover/focus, and hold the reveal until the list
  // arrives, so the region opens to its final height instead of opening on
  // loading rows and then jumping. A slow response falls back to skeletons.
  const writingQuery = useSWR(
    wanted.writing ? SECTIONS.writing.api : null,
    SECTIONS.writing.fetcher,
    { revalidateOnFocus: false },
  )
  const toolsQuery = useSWR(
    wanted.tools ? SECTIONS.tools.api : null,
    SECTIONS.tools.fetcher,
    { revalidateOnFocus: false },
  )
  const queries = { writing: writingQuery, tools: toolsQuery }
  const openReady =
    openSection !== null &&
    (queries[openSection].data !== undefined ||
      queries[openSection].error !== undefined ||
      waitedLong)

  // While swapping to a list that hasn't loaded yet, keep the current one up
  // instead of closing the panel. Direction is +1 moving right in the bio
  // sentence (writing → tools), -1 moving left.
  const [shownSection, setShownSection] = useState<SectionKey | null>(null)
  const [direction, setDirection] = useState(1)
  const [swapping, setSwapping] = useState(false)
  const targetSection =
    openSection === null ? null : openReady ? openSection : shownSection
  if (targetSection !== shownSection) {
    if (shownSection && targetSection) {
      setDirection(
        SECTION_KEYS.indexOf(targetSection) > SECTION_KEYS.indexOf(shownSection) ? 1 : -1,
      )
      setSwapping(true)
    }
    setShownSection(targetSection)
  }
  const [measureRef, contentHeight] = useHeight()

  useEffect(() => {
    if (openSection === null || openReady) return
    const timer = setTimeout(() => setWaitedLong(true), 400)
    return () => clearTimeout(timer)
  }, [openSection, openReady])

  const linkToggles: BioLinkToggles = Object.fromEntries(
    SECTION_KEYS.map((key) => [
      SECTIONS[key].href,
      {
        open: openSection === key,
        controls: REGION_ID,
        onToggle: () => toggleSection(key),
        onIntent: () => want(key),
      },
    ]),
  )

  return (
    <>
      <main
        id="main-content"
        className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16"
      >
        <div className="flex w-full max-w-xl flex-col gap-6">
          <div className="flex flex-col gap-4">
            <motion.h1
              layout="position"
              className="text-3xl font-semibold tracking-tight text-foreground"
            >
              {name}
            </motion.h1>
          <BioSection
            bio={bio}
            onWordChange={(word) => {
              setActiveWord(word)
            }}
            onUserClick={() => {
              setCursorTrailActive(true)
            }}
            linkToggles={linkToggles}
          />
          </div>
          <AnimatePresence initial={false}>
            {shownSection && (
              <motion.section
                key="list"
                id={REGION_ID}
                aria-label={SECTIONS[shownSection].label}
                // Cancel the column gap so it opens from zero, not 24px.
                className="-mt-6 overflow-hidden"
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: "auto",
                  opacity: 1,
                  transition: {
                    height: reduceMotion
                      ? { duration: 0 }
                      : toMotionTransition(reveal.enter.height),
                    opacity: {
                      duration: reveal.enter.fadeDuration,
                      delay: reduceMotion ? 0 : reveal.enter.fadeDelay,
                      ease: "easeOut",
                    },
                  },
                }}
                exit={{
                  height: 0,
                  opacity: 0,
                  transition: {
                    height: reduceMotion
                      ? { duration: 0 }
                      : {
                          ...toMotionTransition(reveal.exit.height),
                          delay: reveal.exit.heightDelay,
                        },
                    opacity: {
                      duration: reveal.exit.fadeDuration,
                      delay: reduceMotion ? 0 : reveal.exit.fadeDelay,
                      ease: "easeOut",
                    },
                  },
                }}
              >
                {/* Follows the content height instantly (e.g. "show more"),
                    and eases between the two lists' heights during a swap. */}
                <motion.div
                  initial={false}
                  animate={{ height: contentHeight ?? "auto" }}
                  transition={
                    swapping && !reduceMotion
                      ? toMotionTransition(reveal.swap.height)
                      : { duration: 0 }
                  }
                  onAnimationComplete={() => setSwapping(false)}
                >
                  <div ref={measureRef} className="relative pt-6">
                    <AnimatePresence initial={false} mode="popLayout" custom={direction}>
                      <motion.div
                        key={shownSection}
                        custom={direction}
                        variants={{
                          enter: (dir: number) => ({
                            opacity: 0,
                            x: reduceMotion ? 0 : reveal.swap.shift * dir,
                            filter: `blur(${reduceMotion ? 0 : reveal.swap.blur}px)`,
                          }),
                          shown: { opacity: 1, x: 0, filter: "blur(0px)" },
                          leave: (dir: number) => ({
                            opacity: 0,
                            x: reduceMotion ? 0 : -reveal.swap.shift * dir,
                            filter: `blur(${reduceMotion ? 0 : reveal.swap.blur}px)`,
                          }),
                        }}
                        initial="enter"
                        animate="shown"
                        exit="leave"
                        transition={{
                          duration: reveal.swap.fadeDuration,
                          ease: easeOut,
                        }}
                      >
                        {shownSection === "writing" ? (
                          <WritingSection
                            seedPosts={
                              reveal.seed.enabled
                                ? generateSeedPosts(reveal.seed.posts)
                                : undefined
                            }
                          />
                        ) : (
                          <ToolsSection
                            seedTools={
                              reveal.seed.enabled
                                ? generateSeedTools(reveal.seed.tools)
                                : undefined
                            }
                          />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>
              </motion.section>
            )}
          </AnimatePresence>
          <motion.div layout="position">
            <SocialIcons socials={socials} email={email} />
          </motion.div>
        </div>
        <CursorTrail />
      </main>
    </>
  )
}
