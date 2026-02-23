"use client"

// Layout Three: Inspired by Noah Dunnagan
// Ultra-minimal, uppercase section headers, em-dash separated items,
// single column, text-only. Maximum restraint.

import { portfolioData } from "@/lib/portfolio-data"
import { HoverLink } from "@/components/hover-link"
import { ThemeToggle } from "@/components/theme-toggle"

function CategorySection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {title}
      </h3>
      {children}
    </section>
  )
}

function DashItem({
  name,
  url,
  description,
}: {
  name: string
  url?: string
  description: string
}) {
  return (
    <div className="flex items-baseline gap-0">
      {url ? (
        <HoverLink
          href={url}
          className="shrink-0 font-medium no-underline decoration-transparent hover:decoration-foreground"
        >
          {name}
        </HoverLink>
      ) : (
        <span className="shrink-0 font-medium text-foreground">{name}</span>
      )}
      <span className="mx-2 text-muted-foreground">{'\u2014'}</span>
      <span className="text-muted-foreground">{description}</span>
    </div>
  )
}

export function LayoutThree() {
  const { name, bio, build, productivity, writing, hobbies } = portfolioData

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col gap-14 px-6 py-16 md:py-24">
      {/* Header */}
      <header className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            {name}
          </h1>
          <ThemeToggle />
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{bio}</p>
      </header>

      {/* Build */}
      <div className="flex flex-col gap-8">
        <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Apps
        </h2>

        <CategorySection title="Build">
          <div className="flex flex-col gap-2.5">
            {build.map((tool) => (
              <DashItem key={tool.name} {...tool} />
            ))}
          </div>
        </CategorySection>

        <CategorySection title="Productivity">
          <div className="flex flex-col gap-2.5">
            {productivity.map((tool) => (
              <DashItem key={tool.name} {...tool} />
            ))}
          </div>
        </CategorySection>
      </div>

      {/* Writing - future Notion CMS */}
      <div className="flex flex-col gap-6">
        <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Writing
        </h2>
        <div className="flex flex-col gap-2.5">
          {writing.map((post) => (
            <a
              key={post.slug}
              href={`/writing/${post.slug}`}
              className="font-medium text-foreground transition-colors duration-200 hover:text-muted-foreground"
            >
              {post.title}
            </a>
          ))}
        </div>
      </div>

      {/* Hobbies */}
      <div className="flex flex-col gap-6">
        <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Hobbies
        </h2>
        <div className="flex flex-col gap-2.5">
          {hobbies.map((hobby) => (
            <DashItem
              key={hobby.name}
              name={hobby.name}
              url={hobby.url}
              description={hobby.description}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
