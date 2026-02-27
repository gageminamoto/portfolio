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
import { CommitsSection } from "@/components/commits-section"

type Tab = "projects" | "writing" | "commits" | "about" | "tools"

const tabs: { id: Tab; label: string }[] = [
  { id: "projects", label: "Projects" },
  { id: "writing", label: "Writing" },
  { id: "commits", label: "Commits" },
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
  const { name, bio, socials, build, productivity, hobbies, projects, learning } = portfolioData

  const handleKeyDown = (e: React.KeyboardEvent, currentId: Tab) => {
    const ids = tabs.map((t) => t.id)
    const idx = ids.indexOf(currentId)
    if (e.key === "ArrowRight") {
      e.preventDefault()
      setActiveTab(ids[(idx + 1) % ids.length])
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      setActiveTab(ids[(idx - 1 + ids.length) % ids.length])
    }
  }

  return (
    <main id="main-content" className="mx-auto flex min-h-screen max-w-xl flex-col gap-12 px-6 py-16 md:py-24">
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
      <div role="tablist" aria-label="Portfolio sections" className="flex items-end gap-0 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, tab.id)}
            className={`cursor-pointer relative -mb-px px-4 py-2 text-sm font-medium transition-[color,background-color,border-color] duration-150 ease-out ${activeTab === tab.id
                ? "rounded-t-md border border-b-background border-border bg-background text-foreground"
                : "border border-transparent text-muted-foreground hover:text-foreground"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div
        id={`tabpanel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        className="flex flex-col gap-10"
      >

        {activeTab === "projects" && (
          <div className="flex flex-col gap-10">
            {/* In Production */}
            <section className="flex flex-col gap-4">
              <h2 className="text-sm text-muted-foreground">In Production</h2>
              <div className="flex flex-col gap-4">
                {projects.filter((p) => p.status === "production").map((project) => (
                  <div key={project.name} className="flex flex-col gap-0.5">
                    {project.url ? (
                      <HoverLink href={project.url} className="font-medium no-underline decoration-transparent hover:decoration-foreground">
                        {project.name}
                      </HoverLink>
                    ) : (
                      <span className="font-medium text-foreground">{project.name}</span>
                    )}
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Building */}
            <section className="flex flex-col gap-4">
              <h2 className="text-sm text-muted-foreground">Building</h2>
              <div className="flex flex-col gap-4">
                {projects.filter((p) => p.status === "building").map((project) => (
                  <div key={project.name} className="flex flex-col gap-0.5">
                    {project.url ? (
                      <HoverLink href={project.url} className="font-medium no-underline decoration-transparent hover:decoration-foreground">
                        {project.name}
                      </HoverLink>
                    ) : (
                      <span className="font-medium text-foreground">{project.name}</span>
                    )}
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === "writing" && (
          <WritingSection variant="card" />
        )}

        {activeTab === "commits" && (
          <CommitsSection />
        )}

        {activeTab === "about" && (
          <div className="flex flex-col gap-10">
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

            {/* Learning */}
            <section className="flex flex-col gap-4">
              <h2 className="text-sm text-muted-foreground">Learning</h2>
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
            </section>
          </div>
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
          </div>
        )}
      </div>

      <SiteFooter />
    </main>
  )
}
