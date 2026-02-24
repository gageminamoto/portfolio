"use client"

// Layout Two: Inspired by Jakub Krehel
// Avatar + name inline, bio paragraph with inline links,
// card-based tool grid, writing list with dates.

import { portfolioData } from "@/lib/portfolio-data"
import { SocialIcons } from "@/components/social-icons"
import { HoverLink } from "@/components/hover-link"
import { ThemeToggle } from "@/components/theme-toggle"
import { BioSection } from "@/components/bio-section"

function ToolCard({
  name,
  url,
  description,
}: {
  name: string
  url: string
  description: string
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-3 rounded-lg border border-border bg-card p-5 transition-colors duration-200 hover:bg-accent"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-muted-foreground">
        <span className="text-sm font-semibold">{name.charAt(0)}</span>
      </div>
      <div>
        <p className="font-medium text-card-foreground">{name}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </a>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-5">
      <h2 className="text-sm font-medium text-foreground">{title}</h2>
      {children}
    </section>
  )
}

export function LayoutTwo() {
  const { name, bio, socials, build, productivity, writing, hobbies } = portfolioData

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-20 px-6 py-16 md:py-24">
      {/* Header */}
      <header className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
              <span className="text-lg font-semibold text-secondary-foreground">
                {name.split(" ").map((n) => n[0]).join("")}
              </span>
            </div>
            <div>
              <h1 className="text-base font-semibold text-foreground">{name}</h1>
              <p className="text-sm text-muted-foreground">Designer</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
        <BioSection bio={bio} className="max-w-lg" />
        <SocialIcons socials={socials} size="sm" />
      </header>

      {/* Build tools as cards */}
      <Section title="Build">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {build.map((tool) => (
            <ToolCard key={tool.name} {...tool} />
          ))}
        </div>
      </Section>

      {/* Productivity as cards */}
      <Section title="Productivity">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {productivity.map((tool) => (
            <ToolCard key={tool.name} {...tool} />
          ))}
        </div>
      </Section>

      {/* Writing - future Notion CMS */}
      <Section title="Writing">
        <div className="flex flex-col gap-1">
          {writing.map((post) => (
            <a
              key={post.slug}
              href={`/writing/${post.slug}`}
              className="group flex items-center justify-between rounded-md px-3 py-3 transition-colors duration-200 hover:bg-accent"
            >
              <span className="text-sm font-medium text-foreground">
                {post.title}
              </span>
              {post.date && (
                <span className="text-xs text-muted-foreground">
                  {post.date}
                </span>
              )}
            </a>
          ))}
        </div>
      </Section>

      {/* Hobbies */}
      <Section title="Hobbies">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {hobbies.map((hobby) => (
            <div
              key={hobby.name}
              className="flex flex-col gap-1 rounded-lg border border-border bg-card p-5"
            >
              <p className="font-medium text-card-foreground">{hobby.name}</p>
              <p className="text-sm text-muted-foreground">{hobby.description}</p>
            </div>
          ))}
        </div>
      </Section>
    </main>
  )
}
