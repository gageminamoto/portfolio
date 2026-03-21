"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { HamburgerMenu, Layers, Pen, Pin, UserCircle, Widget2 } from "@solar-icons/react"
import { portfolioData } from "@/lib/portfolio-data"
import { SocialIcons } from "@/components/social-icons"
import { ThemeToggle } from "@/components/theme-toggle"
import { BioSection } from "@/components/bio-section"
import { SiteFooter } from "@/components/site-footer"
import { WritingSection } from "@/components/writing-section"
import { Section } from "@/components/section"
import { ProjectCard } from "@/components/project-card"
import { useGradientWord } from "@/components/gradient-word-context"
import { CursorTrail } from "@/components/cursor-trail"
import type { ProjectItem } from "@/lib/portfolio-data"

function ProjectListItem({ project }: { project: ProjectItem }) {
  const [badgeTilt] = useState(() => Math.random() * 14 - 7)

  return (
    <div className="group relative flex items-center gap-3 rounded-xl border border-border/50 bg-card px-4 py-3 transition-[transform,background-color,border-color,box-shadow] duration-150 [transition-timing-function:cubic-bezier(0.215,0.61,0.355,1)] hover:-translate-y-px hover:bg-accent/50 hover:shadow-sm">
      {project.url && (
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-0 rounded-xl"
          aria-label={project.name}
          tabIndex={0}
        />
      )}
        {project.status === "building" && (
          <motion.span
            className="absolute -right-1.5 -top-1.5 z-10 cursor-default rounded-full bg-[#3A81F5] px-2 py-0.5 text-[11px] font-medium text-white shadow-sm"
            initial={{ rotate: 0 }}
            animate={{ rotate: badgeTilt }}
            whileHover={{ scale: 1.1, rotate: badgeTilt * 1.5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          >
            Building
          </motion.span>
        )}
        {project.favicon && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={project.favicon} alt="" width={32} height={32} className="size-8 shrink-0 rounded-lg" />
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-sm font-medium text-foreground">{project.name}</span>
          <span className="truncate text-xs text-muted-foreground">{project.description}</span>
        </div>
    </div>
  )
}

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
          <div className="flex flex-col gap-2">
            {projects.map((project) => (
              <ProjectListItem key={project.name} project={project} />
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
      <Section title="Writing" href="/writing" icon={<Pen size={14} weight="Bold" />}>
        <WritingSection variant="default" />
      </Section>

      {/* Tools */}
      <Section title="Tools" href="/tools" icon={<Layers size={14} weight="Bold" />}>
        <p className="text-sm text-muted-foreground">
          Everything I build with.
        </p>
      </Section>

      {/* About */}
      <Section title="About" href="/about" icon={<UserCircle size={14} weight="Bold" />}>
        <p className="text-sm text-muted-foreground">
          Design manifesto and&nbsp;hobbies.
        </p>
      </Section>

      <SiteFooter />

      <CursorTrail />
    </main>
  )
}
