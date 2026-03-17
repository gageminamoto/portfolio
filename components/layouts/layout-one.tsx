"use client"

import { useState } from "react"
import { HamburgerMenu, Pin, Widget2 } from "@solar-icons/react"
import { portfolioData } from "@/lib/portfolio-data"
import { SocialIcons } from "@/components/social-icons"
import { HoverLink } from "@/components/hover-link"
import { ThemeToggle } from "@/components/theme-toggle"
import { BioSection } from "@/components/bio-section"
import { SiteFooter } from "@/components/site-footer"
import { WritingSection } from "@/components/writing-section"
import { Section } from "@/components/section"
import { ProjectCard } from "@/components/project-card"
import { useGradientWord } from "@/components/gradient-word-context"
import { CursorTrail } from "@/components/cursor-trail"

export function LayoutOne() {
  const { name, bio, socials, email, projects } = portfolioData
  const { setActiveWord, setCursorTrailActive } = useGradientWord()
  const [projectView, setProjectView] = useState<"list" | "card">("card")

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
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Pin size={14} weight="Bold" />
            Recent Projects
          </h2>
          <button
            onClick={() => setProjectView(projectView === "list" ? "card" : "list")}
            className="rounded-md p-1 text-muted-foreground/50 transition-colors hover:text-muted-foreground"
            aria-label={projectView === "list" ? "Switch to card view" : "Switch to list view"}
          >
            {projectView === "list" ? (
              <Widget2 size={14} weight="Bold" />
            ) : (
              <HamburgerMenu size={14} weight="Bold" />
            )}
          </button>
        </div>

        {projectView === "list" ? (
          <div className="flex flex-col gap-4">
            {projects.map((project) => (
              <div key={project.name} className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  {project.favicon && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={project.favicon} alt="" className="size-4 rounded-sm" />
                  )}
                  {project.url ? (
                    <HoverLink href={project.url} className="font-medium no-underline decoration-transparent hover:decoration-foreground">
                      {project.name}
                    </HoverLink>
                  ) : (
                    <span className="font-medium text-foreground">{project.name}</span>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">{project.description}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {projects.map((project, index) => (
              <ProjectCard key={project.name} project={project} index={index} />
            ))}
          </div>
        )}
      </section>

      {/* Writing — Notion CMS */}
      <Section title="Writing" href="/writing">
        <WritingSection variant="default" />
      </Section>

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
