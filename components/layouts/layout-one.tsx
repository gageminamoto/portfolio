"use client"

import { portfolioData } from "@/lib/portfolio-data"
import { SocialIcons } from "@/components/social-icons"
import { HoverLink } from "@/components/hover-link"
import { ThemeToggle } from "@/components/theme-toggle"
import { BioSection } from "@/components/bio-section"
import { SiteFooter } from "@/components/site-footer"
import { WritingSection } from "@/components/writing-section"
import { Section } from "@/components/section"
import { motion } from "framer-motion"
import { useEntranceMotion } from "@/lib/animations"

export function LayoutOne() {
  const { name, bio, socials, email, projects } = portfolioData
  const { item, containerProps } = useEntranceMotion()

  return (
    <motion.main
      id="main-content"
      className="mx-auto flex min-h-screen max-w-xl flex-col gap-8 px-6 py-16 md:py-24"
      {...containerProps}
    >
      {/* Header */}
      <motion.header variants={item} className="flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground [text-wrap:balance]">
              {name}
            </h1>
            <BioSection bio={bio} />
          </div>
          <ThemeToggle />
        </div>
        <SocialIcons socials={socials} email={email} />
      </motion.header>

      {/* Projects */}
      <motion.div variants={item}>
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
      </motion.div>

      {/* Writing — Notion CMS */}
      <motion.div variants={item}>
        <Section title="Writing" href="/writing">
          <WritingSection variant="default" />
        </Section>
      </motion.div>

      {/* About */}
      <motion.div variants={item}>
        <Section title="About" href="/about">
          <p className="text-sm text-muted-foreground">
            Design manifesto, tools, and&nbsp;hobbies.
          </p>
        </Section>
      </motion.div>

      <motion.div variants={item}>
        <SiteFooter />
      </motion.div>
    </motion.main>
  )
}
