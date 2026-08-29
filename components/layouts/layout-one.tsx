"use client"

import { type CSSProperties, useEffect, useLayoutEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Layers, Pen, Pin, Suitcase, UserCircle } from "@solar-icons/react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { portfolioData } from "@/lib/portfolio-data"
import { SocialIcons } from "@/components/social-icons"
import { BioSection } from "@/components/bio-section"
import { SiteFooter } from "@/components/site-footer"
import { WritingSection } from "@/components/writing-section"
import { Section } from "@/components/section"
import { ProjectCard } from "@/components/project-card"
import { WorkSection } from "@/components/work-section"
import { WorkHoverProvider } from "@/components/work-hover-context"
import { useGradientWord } from "@/components/gradient-word-context"
import { CursorTrail } from "@/components/cursor-trail"
import { fadeUp, noMotion, stagger } from "@/lib/animations"
import type { NotionWritingPost } from "@/lib/notion"

interface LayoutOneProps {
  initialPosts?: NotionWritingPost[]
}

const PROJECT_EDGE_BLEED_PX = 16

function ProjectCarousel({ projects }: { projects: typeof portfolioData.projects }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const [bleedMetrics, setBleedMetrics] = useState({ left: 0, right: 0, width: 0 })
  const [activeIndex, setActiveIndex] = useState(0)

  useLayoutEffect(() => {
    const parent = wrapperRef.current?.parentElement
    if (!parent) return

    const updateInset = () => {
      const rect = parent.getBoundingClientRect()
      const viewportWidth = window.visualViewport?.width ?? window.innerWidth

      setBleedMetrics({
        left: Math.max(0, Math.round(rect.left)),
        right: Math.max(0, Math.round(viewportWidth - rect.right)),
        width: Math.round(viewportWidth),
      })
    }

    updateInset()
    window.addEventListener("resize", updateInset)
    window.visualViewport?.addEventListener("resize", updateInset)
    window.visualViewport?.addEventListener("scroll", updateInset)

    return () => {
      window.removeEventListener("resize", updateInset)
      window.visualViewport?.removeEventListener("resize", updateInset)
      window.visualViewport?.removeEventListener("scroll", updateInset)
    }
  }, [])

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      railRef.current?.scrollTo({ left: 0, behavior: "auto" })
      setActiveIndex(0)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [])

  const railStyle = {
    "--projects-start-inset": `${bleedMetrics.left}px`,
    "--projects-end-inset": `${bleedMetrics.right}px`,
    "--projects-edge-bleed": `${PROJECT_EDGE_BLEED_PX}px`,
    marginLeft: `-${bleedMetrics.left + PROJECT_EDGE_BLEED_PX}px`,
    width: bleedMetrics.width
      ? `${bleedMetrics.width + PROJECT_EDGE_BLEED_PX * 2}px`
      : `calc(100% + ${PROJECT_EDGE_BLEED_PX * 2}px)`,
  } as CSSProperties

  const updateActiveIndex = () => {
    const rail = railRef.current
    if (!rail) return

    const items = Array.from(rail.children) as HTMLElement[]
    const firstOffset = items[0]?.offsetLeft ?? 0
    const maxScrollLeft = rail.scrollWidth - rail.clientWidth
    const closestIndex = items.reduce((closest, item, index) => {
      const snapPosition = index === items.length - 1 ? maxScrollLeft : item.offsetLeft - firstOffset
      return Math.abs(rail.scrollLeft - snapPosition) < Math.abs(rail.scrollLeft - closest.position)
        ? { index, position: snapPosition }
        : closest
    }, { index: 0, position: 0 })

    setActiveIndex(closestIndex.index)
  }

  const scrollToIndex = (index: number) => {
    const rail = railRef.current
    if (!rail) return

    const items = Array.from(rail.children) as HTMLElement[]
    const nextIndex = Math.min(Math.max(index, 0), items.length - 1)
    const firstOffset = items[0]?.offsetLeft ?? 0
    const item = items[nextIndex]
    if (!item) return

    rail.scrollTo({
      left: nextIndex === items.length - 1
        ? rail.scrollWidth - rail.clientWidth
        : item.offsetLeft - firstOffset,
      behavior: "smooth",
    })
    setActiveIndex(nextIndex)
  }

  return (
    <>
      <div ref={wrapperRef} className="overflow-visible" style={railStyle}>
        <div
          ref={railRef}
          className="-mt-2 flex w-full snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-pl-[calc(var(--projects-start-inset)+var(--projects-edge-bleed))] scroll-pr-[calc(var(--projects-end-inset)+var(--projects-edge-bleed))] pb-1 pl-[calc(var(--projects-start-inset)+var(--projects-edge-bleed))] pr-[calc(var(--projects-end-inset)+var(--projects-edge-bleed))] pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onScroll={updateActiveIndex}
        >
          {projects.map((project, index) => (
            <div key={project.name} className={`w-[min(82vw,22rem)] shrink-0 ${index === projects.length - 1 ? "snap-end" : "snap-start"}`}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button type="button" onClick={() => scrollToIndex(activeIndex - 1)} disabled={activeIndex === 0} className="inline-flex size-8 items-center justify-center rounded-full bg-muted/55 text-muted-foreground disabled:cursor-not-allowed disabled:opacity-40" aria-label="Previous project">
          <ChevronLeft className="size-4" strokeWidth={2.25} aria-hidden="true" />
        </button>
        <div className="flex items-center gap-3" aria-label="Project carousel position">
          {projects.map((project, index) => (
            <button key={project.name} type="button" onClick={() => scrollToIndex(index)} className={`size-2 rounded-full ${index === activeIndex ? "bg-foreground" : "bg-muted-foreground/18"}`} aria-label={`Show ${project.name}`} aria-current={index === activeIndex ? "true" : undefined} />
          ))}
        </div>
        <button type="button" onClick={() => scrollToIndex(activeIndex + 1)} disabled={activeIndex === projects.length - 1} className="inline-flex size-8 items-center justify-center rounded-full bg-muted/55 text-muted-foreground disabled:cursor-not-allowed disabled:opacity-40" aria-label="Next project">
          <ChevronRight className="size-4" strokeWidth={2.25} aria-hidden="true" />
        </button>
      </div>
    </>
  )
}

export function LayoutOne({ initialPosts }: LayoutOneProps) {
  const { name, bio, socials, email, projects } = portfolioData
  const { setActiveWord, setCursorTrailActive } = useGradientWord()
  const shouldReduceMotion = useReducedMotion()
  const item = shouldReduceMotion ? noMotion : fadeUp

  return (
    <WorkHoverProvider>
    <motion.main
      id="main-content"
      className="relative z-10 mx-auto flex min-h-screen max-w-xl min-w-0 flex-col gap-12 px-6 py-16 md:gap-14 md:py-24"
      variants={shouldReduceMotion ? undefined : stagger}
      // The homepage's introductory copy is the LCP candidate. Rendering its
      // children with the hidden variant leaves the server-rendered page at
      // opacity: 0 until the full client bundle has hydrated on mobile.
      // Preserve all interaction animations while making the initial content
      // paintable immediately.
      initial={false}
      animate="show"
    >
      {/* Header */}
      <motion.header variants={item} className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {name}
          </h1>
          <BioSection bio={bio} onWordChange={(word) => { setActiveWord(word) }} onUserClick={() => { setCursorTrailActive(true) }} />
        </div>
        <SocialIcons socials={socials} email={email} />
      </motion.header>

      {/* Work */}
      <motion.section variants={item} className="min-w-0 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Suitcase size={14} weight="Bold" />
            Work
          </h2>
        </div>
        <div className="min-w-0 max-w-full">
          <WorkSection />
        </div>
      </motion.section>

      {/* Projects */}
      <motion.section variants={item} className="min-w-0 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Pin size={14} weight="Bold" />
            Projects
          </h2>
        </div>

        <div className="min-w-0 max-w-full">
          <ProjectCarousel projects={projects} />
        </div>
      </motion.section>

      {/* Details */}
      <motion.div variants={item} className="flex flex-col gap-8">
        <Section title="About" href="/about" icon={<UserCircle size={14} weight="Bold" />}>
          <p className="text-sm text-muted-foreground">
            More about me.
          </p>
        </Section>

        <Section title="Tools" href="/tools" icon={<Layers size={14} weight="Bold" />}>
          <p className="text-sm text-muted-foreground">
            Everything I build with.
          </p>
        </Section>

        <Section title="Writing" href="/writing" icon={<Pen size={14} weight="Bold" />}>
          <WritingSection variant="default" initialPosts={initialPosts} />
        </Section>
      </motion.div>

      <motion.div variants={item}>
        <SiteFooter />
      </motion.div>

      <CursorTrail />
    </motion.main>
    </WorkHoverProvider>
  )
}
