"use client"

import { useState, useRef, useEffect, useLayoutEffect, useMemo, useCallback } from "react"
import { portfolioData } from "@/lib/portfolio-data"
import { SocialIcons } from "@/components/social-icons"
import { HoverLink } from "@/components/hover-link"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"
import { ProjectPreviewCard } from "@/components/project-preview-card"
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

  useLayoutEffect(() => {
    const activeRef = viewMode === "cards" ? gridRef : listRef
    const maxH = viewMode === "cards" ? gridMaxH : listMaxH
    if (!activeRef.current) return
    activeRef.current.style.minHeight = "0px"
    const natural = activeRef.current.scrollHeight
    maxH.current = Math.max(maxH.current, natural)
    activeRef.current.style.minHeight = `${maxH.current}px`
  }, [viewMode])

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
            <h2 className="text-sm text-muted-foreground">Projects</h2>
            <button
              onClick={() => setViewMode(viewMode === "cards" ? "list" : "cards")}
              className="rounded-md p-1.5 text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground/70"
              aria-label={viewMode === "cards" ? "Switch to list view" : "Switch to card view"}
            >
              <Icon
                icon={viewMode === "cards" ? "solar:smartphone-2-bold" : "solar:widget-5-bold"}
                className="size-4"
              />
            </button>
          </div>

          <div
            ref={gridRef}
            className={cn(
              "grid grid-cols-1 gap-2 md:grid-cols-2",
              viewMode !== "cards" && "hidden"
            )}
          >
            {projects.map((project, i) => (
              <ProjectCard key={project.name} project={project} index={i} />
            ))}
          </div>

          {viewMode === "list" && (
            <div ref={listRef} className="flex flex-col gap-3">
              {projects.map((project) => (
                <div key={project.name} className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    {project.url ? (
                      <HoverCard openDelay={300} closeDelay={100}>
                        <HoverCardTrigger asChild>
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-1 font-medium text-foreground underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-150 ease-out hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                          >
                            <span>{project.name}</span>
                          </a>
                        </HoverCardTrigger>
                        <HoverCardContent side="top" align="start" sideOffset={8} className="w-64 p-0 overflow-hidden">
                          <ProjectPreviewCard project={project} />
                        </HoverCardContent>
                      </HoverCard>
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
