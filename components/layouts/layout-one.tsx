"use client"

import { useState, useRef, useEffect, useLayoutEffect, useMemo, useCallback } from "react"
import { portfolioData } from "@/lib/portfolio-data"
import { SocialIcons } from "@/components/social-icons"
import { HoverLink } from "@/components/hover-link"
import { ThemeToggle } from "@/components/theme-toggle"
import { BioSection } from "@/components/bio-section"
import { SiteFooter } from "@/components/site-footer"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { WritingSection } from "@/components/writing-section"
import { ProjectCard } from "@/components/project-card"
import { Icon } from "@iconify/react"
import { Kbd } from "@/components/ui/kbd"
import { useIsMobile } from "@/components/ui/use-mobile"
import { assignShortcutKeys } from "@/lib/keyboard-shortcuts"
import { useTheme } from "next-themes"
import dynamic from "next/dynamic"
import { Section } from "@/components/section"
import { useGradientWord } from "@/components/gradient-word-context"
import { CursorTrail } from "@/components/cursor-trail"
import { motion } from "framer-motion"
import { useEntranceMotion } from "@/lib/animations"

// Dynamically import PokemonCards so a missing framer-motion
// doesn't crash the full page before React hydrates
const PokemonCards = dynamic(
  () => import("@/components/pokemon-cards").then((m) => m.PokemonCards),
  { ssr: false, loading: () => <span className="font-medium text-foreground">Pokemon cards</span> }
)

export function LayoutOne() {
  const { name, bio, socials, email, projects, hobbies, learning } = portfolioData
  const [projectFilter, setProjectFilter] = useState<"all" | "building" | "production">("all")
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards")
  const gridRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const gridMaxH = useRef(0)
  const listMaxH = useRef(0)

  const isMobile = useIsMobile()
  const { theme, setTheme } = useTheme()
  const shortcutMap = useMemo(() => assignShortcutKeys(projects), [projects])
  const { item, containerProps } = useEntranceMotion()
  const { setActiveWord, setCursorTrailActive } = useGradientWord()

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark")
  }, [theme, setTheme])

  useEffect(() => {
    if (isMobile) return

    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return
      if (e.ctrlKey || e.altKey || e.metaKey || e.shiftKey) return

      const key = e.key.toLowerCase()

      if (key === "t") {
        toggleTheme()
        return
      }

      if (key === "e" && email) {
        navigator.clipboard.writeText(email)
        window.dispatchEvent(new Event("email-copied"))
        return
      }

      for (const [projectName, shortcut] of shortcutMap) {
        if (shortcut === key) {
          const project = projects.find((p) => p.name === projectName)
          if (project?.url) window.open(project.url, "_blank", "noopener,noreferrer")
          return
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isMobile, shortcutMap, projects, toggleTheme, email])

  const filteredProjects = projects.filter((p) => projectFilter === "all" || p.status === projectFilter)

  useLayoutEffect(() => {
    // Reset tracked max when filter changes so stale heights don't persist
    gridMaxH.current = 0
    listMaxH.current = 0
  }, [projectFilter])

  useLayoutEffect(() => {
    const activeRef = viewMode === "cards" ? gridRef : listRef
    const maxH = viewMode === "cards" ? gridMaxH : listMaxH
    if (!activeRef.current) return
    activeRef.current.style.minHeight = "0px"
    const natural = activeRef.current.scrollHeight
    maxH.current = Math.max(maxH.current, natural)
    activeRef.current.style.minHeight = `${maxH.current}px`
  }, [projectFilter, viewMode])

  return (
    <main
      id="main-content"
      className="relative z-10 mx-auto flex min-h-screen max-w-xl flex-col gap-8 px-6 py-16 md:py-24"
    >
      {/* Header */}
      <header className="flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground [text-wrap:balance]">
              {name}
            </h1>
            <BioSection bio={bio} onWordChange={(word) => { setActiveWord(word) }} onUserClick={() => { setCursorTrailActive(true) }} />
          </div>
          <ThemeToggle />
        </div>
        <SocialIcons socials={socials} email={email} />
      </header>

      {/* Projects */}
      <motion.div variants={item}>
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setProjectFilter("all")}
                className={cn(
                  "text-sm transition-colors",
                  projectFilter === "all"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground/70"
                )}
              >
                Projects
              </button>
              <button
                onClick={() => setProjectFilter("building")}
                className={cn(
                  "text-sm transition-colors",
                  projectFilter === "building"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground/70"
                )}
              >
                Building
              </button>
              <button
                onClick={() => setProjectFilter("production")}
                className={cn(
                  "text-sm transition-colors",
                  projectFilter === "production"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground/70"
                )}
              >
                Shipped
              </button>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setViewMode("cards")}
                className={cn(
                  "rounded-md p-1.5 transition-colors",
                  viewMode === "cards"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground/70"
                )}
                aria-label="Card view"
              >
                <Icon icon="solar:widget-5-bold" className="size-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "rounded-md p-1.5 transition-colors",
                  viewMode === "list"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground/70"
                )}
                aria-label="List view"
              >
                <Icon icon="solar:smartphone-2-bold" className="size-4" />
              </button>
            </div>
          </div>

          <div
            ref={gridRef}
            className={cn(
              "grid grid-cols-1 gap-2 md:grid-cols-2",
              viewMode !== "cards" && "hidden"
            )}
          >
            {filteredProjects.map((project, i) => (
                <ProjectCard key={project.name} project={project} index={i} />
              ))}
          </div>

          {viewMode === "list" && (
            <div ref={listRef} className="flex flex-col gap-3">
              {filteredProjects.map((project) => (
                    <div key={project.name} className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        {project.url ? (
                          <HoverLink href={project.url} className="font-medium no-underline decoration-transparent hover:decoration-foreground">
                            {project.name}
                          </HoverLink>
                        ) : (
                          <span className="font-medium text-foreground">{project.name}</span>
                        )}
                        {shortcutMap.get(project.name) && (
                          <Kbd className="hidden md:inline-flex">{shortcutMap.get(project.name)!.toUpperCase()}</Kbd>
                        )}
                      </div>
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="truncate text-sm text-muted-foreground">{project.description}</span>
                        {project.status === "building" && (
                          <Badge className="shrink-0 bg-[#3A81F5]/15 text-[#3A81F5] border-transparent text-[11px]">Building</Badge>
                        )}
                      </div>
                    </div>
                  ))}
            </div>
          )}
        </section>
      </motion.div>

      {/* Writing — Notion CMS */}
      <Section title="Writing" href="/writing">
        <WritingSection variant="default" />
      </Section>

      {/* Learning */}
      <motion.div variants={item}>
        <Section title="Learning">
          <div className="flex flex-col gap-3">
            {learning.map((item) => (
              <div key={item.name} className="flex items-baseline gap-2 min-w-0">
                {item.url ? (
                  <HoverLink href={item.url} className="shrink-0 font-medium no-underline decoration-transparent hover:decoration-foreground">
                    {item.name}
                  </HoverLink>
                ) : (
                  <span className="shrink-0 font-medium text-foreground">{item.name}</span>
                )}
                <span className="truncate text-sm text-muted-foreground">{item.description}</span>
              </div>
            ))}
          </div>
        </Section>
      </motion.div>

      {/* Hobbies */}
      <motion.div variants={item}>
        <Section title="Hobbies">
          <div className="flex flex-col gap-3">
            {hobbies.map((hobby) => {
              // Pokemon cards entry gets the interactive fan component
              if (hobby.name === "Pokemon cards") {
                return (
                  <div key={hobby.name} className="flex items-baseline gap-2 min-w-0">
                    <PokemonCards />
                    <span className="truncate text-sm text-muted-foreground">
                      {hobby.description}
                    </span>
                  </div>
                )
              }
              return (
                <div key={hobby.name} className="flex items-baseline gap-2 min-w-0">
                  {hobby.url ? (
                    <HoverLink href={hobby.url} className="shrink-0 font-medium no-underline decoration-transparent hover:decoration-foreground">
                      {hobby.name}
                    </HoverLink>
                  ) : (
                    <span className="shrink-0 font-medium text-foreground">{hobby.name}</span>
                  )}
                  <span className="truncate text-sm text-muted-foreground">{hobby.description}</span>
                </div>
              )
            })}
          </div>
        </Section>
      </motion.div>

      {/* About */}
      <Section title="About" href="/about">
        <p className="text-sm text-muted-foreground">
          Design manifesto, tools, and&nbsp;hobbies.
        </p>
      </Section>

      <SiteFooter />

      <CursorTrail />
    </main>
  )
}
