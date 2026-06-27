"use client"

import { useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Layers, Pen, Pin, Suitcase, UserCircle } from "@solar-icons/react"
import { portfolioData } from "@/lib/portfolio-data"
import { SocialIcons } from "@/components/social-icons"
import { BioSection } from "@/components/bio-section"
import { SiteFooter } from "@/components/site-footer"
import { WritingSection } from "@/components/writing-section"
import { Section } from "@/components/section"
import { ProjectCard } from "@/components/project-card"
import { WorkSection, WorkFilterTabs, type WorkFilter } from "@/components/work-section"
import { WorkHoverProvider } from "@/components/work-hover-context"
import { useGradientWord } from "@/components/gradient-word-context"
import { CursorTrail } from "@/components/cursor-trail"
import { fadeUp, noMotion, stagger } from "@/lib/animations"

export function LayoutOne() {
  const { name, bio, socials, email, projects } = portfolioData
  const { setActiveWord, setCursorTrailActive } = useGradientWord()
  const [workFilter, setWorkFilter] = useState<WorkFilter>(null)
  const shouldReduceMotion = useReducedMotion()
  const item = shouldReduceMotion ? noMotion : fadeUp

  return (
    <WorkHoverProvider>
    <motion.main
      id="main-content"
      className="relative z-10 mx-auto flex min-h-screen max-w-xl min-w-0 flex-col gap-12 px-6 py-16 md:gap-14 md:py-24"
      variants={shouldReduceMotion ? undefined : stagger}
      initial="hidden"
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
          <WorkFilterTabs active={workFilter} onChange={setWorkFilter} />
        </div>
        <div className="min-w-0 max-w-full">
          <WorkSection filter={workFilter} />
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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.name}
              project={project}
              index={index}
              guandanVariant="cards"
            />
          ))}
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
          <WritingSection variant="default" />
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
