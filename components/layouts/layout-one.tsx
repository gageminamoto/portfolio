"use client"

import { portfolioData } from "@/lib/portfolio-data"
import { SocialIcons } from "@/components/social-icons"
import { HoverLink } from "@/components/hover-link"
import { ThemeToggle } from "@/components/theme-toggle"
import { BioSection } from "@/components/bio-section"
import { SiteFooter } from "@/components/site-footer"
import { WritingSection } from "@/components/writing-section"
import { Section } from "@/components/section"
import { useGradientWord } from "@/components/gradient-word-context"
import { CursorTrail } from "@/components/cursor-trail"

export function LayoutOne() {
  const { name, bio, socials, email, projects } = portfolioData
  const { setActiveWord, setCursorTrailActive } = useGradientWord()

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
      <Section title="Projects">
        <div className="flex flex-col gap-4">
          {projects.map((project) => (
            <div key={project.name} className="flex flex-col gap-0.5">
              {project.url ? (
                <HoverLink href={project.url} className="font-medium no-underline decoration-transparent hover:decoration-foreground">
                  {project.name}
                </HoverLink>
              ) : (
                <span className="font-medium text-foreground">{project.name}</span>
              )}
              <span className="text-sm text-muted-foreground">{project.description}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Writing — Notion CMS */}
      <Section title="Writing" href="/writing">
        <WritingSection variant="default" />
      </Section>

      {/* Tools */}
      <Section title="Tools" href="/tools">
        <p className="text-sm text-muted-foreground">
          Everything I build with.
        </p>
      </Section>

      {/* About */}
      <Section title="About" href="/about">
        <p className="text-sm text-muted-foreground">
          Design manifesto and&nbsp;hobbies.
        </p>
      </Section>

      <SiteFooter />

      <CursorTrail />
    </main>
  )
}
