"use client"

// Layout One: Inspired by Brian Lovin
// Left-aligned vertical flow with generous whitespace.
// Social icons row, writing as a flat list, tools with bold name + lighter description.

import { portfolioData } from "@/lib/portfolio-data"
import { SocialIcons } from "@/components/social-icons"
import { HoverLink } from "@/components/hover-link"
import { ThemeToggle } from "@/components/theme-toggle"
import { BioSection } from "@/components/bio-section"
import { SiteFooter } from "@/components/site-footer"
import { WritingSection } from "@/components/writing-section"
import { IconTabSwitcher } from "@/components/icon-tab-switcher"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-sm text-muted-foreground">{title}</h2>
      {children}
    </section>
  )
}

function ToolRow({
  name,
  url,
  description,
}: {
  name: string
  url: string
  description: string
}) {
  return (
    <div className="flex items-baseline gap-2">
      <HoverLink href={url} className="font-medium no-underline decoration-transparent hover:decoration-foreground">
        {name}
      </HoverLink>
      <span className="text-sm text-muted-foreground">{description}</span>
    </div>
  )
}

const tabConfig = [
  { id: "tools", label: "Tools", icon: "solar:suitcase-bold" },
  { id: "hobbies", label: "Hobbies", icon: "solar:ghost-bold" },
  { id: "play", label: "Play", icon: "solar:bag-smile-bold" },
  { id: "learning", label: "Learning", icon: "solar:user-bold" },
]

function TabbedSection({
  build,
  productivity,
  hobbies,
  learning,
}: {
  build: { name: string; url: string; description: string }[]
  productivity: { name: string; url: string; description: string }[]
  hobbies: { name: string; url?: string; description: string }[]
  learning: { name: string; url?: string; description: string }[]
}) {
  const [activeTab, setActiveTab] = useState("tools")

  const toolsAll = [...build, ...productivity]

  return (
    <section className="flex flex-col gap-6">
      <IconTabSwitcher tabs={tabConfig} activeTab={activeTab} onTabChange={setActiveTab} />
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {activeTab === "tools" && (
            <div className="flex flex-col gap-3">
              {toolsAll.map((tool) => (
                <ToolRow key={tool.name} {...tool} />
              ))}
            </div>
          )}
          {activeTab === "hobbies" && (
            <div className="flex flex-col gap-3">
              {hobbies.map((hobby) => (
                <div key={hobby.name} className="flex items-baseline gap-2">
                  {hobby.url ? (
                    <HoverLink href={hobby.url} className="font-medium no-underline decoration-transparent hover:decoration-foreground">
                      {hobby.name}
                    </HoverLink>
                  ) : (
                    <span className="font-medium text-foreground">{hobby.name}</span>
                  )}
                  <span className="text-sm text-muted-foreground">{hobby.description}</span>
                </div>
              ))}
            </div>
          )}
          {activeTab === "play" && (
            <div className="flex flex-col gap-3">
              {hobbies.filter(h => h.url).map((hobby) => (
                <div key={hobby.name} className="flex items-baseline gap-2">
                  <HoverLink href={hobby.url!} className="font-medium no-underline decoration-transparent hover:decoration-foreground">
                    {hobby.name}
                  </HoverLink>
                  <span className="text-sm text-muted-foreground">{hobby.description}</span>
                </div>
              ))}
            </div>
          )}
          {activeTab === "learning" && (
            <div className="flex flex-col gap-3">
              {learning.map((item) => (
                <div key={item.name} className="flex items-baseline gap-2">
                  {item.url ? (
                    <HoverLink href={item.url} className="font-medium no-underline decoration-transparent hover:decoration-foreground">
                      {item.name}
                    </HoverLink>
                  ) : (
                    <span className="font-medium text-foreground">{item.name}</span>
                  )}
                  <span className="text-sm text-muted-foreground">{item.description}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}

export function LayoutOne() {
  const { name, bio, socials, email, build, productivity, projects, hobbies, learning } = portfolioData

  return (
    <main id="main-content" className="mx-auto flex min-h-screen max-w-xl flex-col gap-16 px-6 py-16 md:py-24">
      {/* Header */}
      <header className="flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {name}
            </h1>
            <BioSection bio={bio} />
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
      <Section title="Writing">
        <WritingSection variant="default" />
      </Section>

      {/* Tabbed: Tools, Hobbies, Play, Learning */}
      <TabbedSection
        build={build}
        productivity={productivity}
        hobbies={hobbies}
        learning={learning}
      />

      <SiteFooter />
    </main>
  )
}
