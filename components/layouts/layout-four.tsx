"use client"

// Layout Four: Tab-based navigation
// Content divided into Writing, Projects, and About tabs.
// Active tab styled as a raised card, inactive as plain muted text.

import { useState } from "react"
import { portfolioData } from "@/lib/portfolio-data"
import { HoverLink } from "@/components/hover-link"
import { ThemeToggle } from "@/components/theme-toggle"
import { BioSection } from "@/components/bio-section"
import { SocialIcons } from "@/components/social-icons"
import { SiteFooter } from "@/components/site-footer"
import { WritingSection } from "@/components/writing-section"

type Tab = "projects" | "writing" | "about" | "tools"

const tabs: { id: Tab; label: string }[] = [
  { id: "projects", label: "Projects" },
  { id: "writing", label: "Writing" },
  { id: "about", label: "About" },
  { id: "tools", label: "Tools" },
]

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

export function LayoutFour() {
  const [activeTab, setActiveTab] = useState<Tab>("projects")
  const { name, bio, socials, build, productivity, hobbies, projects } = portfolioData

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-12 px-6 py-16 md:py-24">
      {/* Header */}
      <header className="flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {name}
          </h1>
          <ThemeToggle />
        </div>
        <BioSection bio={bio} />
        <SocialIcons socials={socials} />
      </header>

      {/* Tab bar */}
      <div className="flex items-end gap-0 overflow-x-auto border-b border-border scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`cursor-pointer relative -mb-px px-4 py-2 text-sm font-medium transition-[color,background-color,border-color] duration-150 ease-out ${
              activeTab === tab.id
                ? "rounded-t-md border border-b-background border-border bg-background text-foreground"
                : "border border-transparent text-muted-foreground hover:text-foreground"
            }`}
            aria-selected={activeTab === tab.id}
            role="tab"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div role="tabpanel" className="flex flex-col gap-10">

        {activeTab === "projects" && (
          <div className="flex flex-col gap-4">
            {projects.length === 0 ? (
              <p className="text-sm text-muted-foreground">No projects yet.</p>
            ) : (
              projects.map((project) => (
                <div key={project.name} className="flex flex-col gap-1">
                  {project.url ? (
                    <HoverLink href={project.url} className="font-medium no-underline decoration-transparent hover:decoration-foreground">
                      {project.name}
                    </HoverLink>
                  ) : (
                    <span className="font-medium text-foreground">{project.name}</span>
                  )}
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "writing" && (
          <WritingSection variant="card" />
        )}

        {activeTab === "about" && (
          <p className="text-sm text-muted-foreground">
            Something's cooking here. Check back soon — this page is still figuring itself out.
          </p>
        )}

        {activeTab === "tools" && (
          <div className="flex flex-col gap-10">
            {/* Build */}
            <section className="flex flex-col gap-4">
              <h2 className="text-sm text-muted-foreground">Build</h2>
              <div className="flex flex-col gap-3">
                {build.map((tool) => (
                  <ToolRow key={tool.name} {...tool} />
                ))}
              </div>
            </section>

            {/* Productivity */}
            <section className="flex flex-col gap-4">
              <h2 className="text-sm text-muted-foreground">Productivity</h2>
              <div className="flex flex-col gap-3">
                {productivity.map((tool) => (
                  <ToolRow key={tool.name} {...tool} />
                ))}
              </div>
            </section>

            {/* Hobbies */}
            <section className="flex flex-col gap-4">
              <h2 className="text-sm text-muted-foreground">Hobbies</h2>
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
            </section>
          </div>
        )}
      </div>

      <SiteFooter />
    </main>
  )
}
