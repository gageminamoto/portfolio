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

export function LayoutOne() {
  const { name, bio, socials, build, productivity, hobbies, learning } = portfolioData

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
        <SocialIcons socials={socials} />
      </header>

      {/* Writing — Notion CMS */}
      <Section title="Writing">
        <WritingSection variant="default" />
      </Section>

      {/* Build tools */}
      <Section title="Build">
        <div className="flex flex-col gap-3">
          {build.map((tool) => (
            <ToolRow key={tool.name} {...tool} />
          ))}
        </div>
      </Section>

      {/* Productivity */}
      <Section title="Productivity">
        <div className="flex flex-col gap-3">
          {productivity.map((tool) => (
            <ToolRow key={tool.name} {...tool} />
          ))}
        </div>
      </Section>

      {/* Hobbies */}
      <Section title="Hobbies">
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
              <span className="text-sm text-muted-foreground">
                {hobby.description}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* Learning */}
      <Section title="Learning">
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
      </Section>

      <SiteFooter />
    </main>
  )
}
