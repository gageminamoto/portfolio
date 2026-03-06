"use client"

import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { SiteFooter } from "@/components/site-footer"
import { Section } from "@/components/section"
import { ToolRow } from "@/components/tool-row"
import { BioSection } from "@/components/bio-section"
import { HoverLink } from "@/components/hover-link"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { portfolioData } from "@/lib/portfolio-data"
import dynamic from "next/dynamic"

const PokemonCards = dynamic(
  () => import("@/components/pokemon-cards").then((m) => m.PokemonCards),
  { ssr: false, loading: () => <span className="font-medium text-foreground">Pokemon cards</span> }
)

export default function AboutPage() {
  const { extendedBio, designManifesto, build, productivity, learning, hobbies } = portfolioData

  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-screen max-w-xl flex-col gap-12 px-6 py-16 md:py-24"
    >
      {/* Header */}
      <header className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
        >
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Home
        </Link>
        <ThemeToggle />
      </header>

      {/* Title + Extended About */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground [text-wrap:balance]">
          About
        </h1>
        <BioSection bio={extendedBio} />
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-8">
        {/* Design Manifesto */}
        <Section title="Design Manifesto">
          {designManifesto.length > 0 ? (
            <div className="flex flex-col gap-3">
              {designManifesto.map((item) => (
                <div key={item.principle} className="flex flex-col gap-0.5">
                  <span className="font-medium text-foreground">{item.principle}</span>
                  <span className="text-sm text-muted-foreground">{item.description}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Coming soon ☺︎</p>
          )}
        </Section>

        {/* Tools */}
        <Tabs defaultValue="all" className="flex flex-col gap-4">
          <TabsList className="h-auto bg-transparent p-0 gap-3">
            <TabsTrigger value="all" className="h-auto bg-transparent p-0 text-sm font-normal shadow-none border-none cursor-pointer text-muted-foreground transition-opacity duration-150 ease-out hover:opacity-70 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:font-medium data-[state=active]:opacity-100 data-[state=active]:hover:opacity-70 dark:data-[state=active]:bg-transparent dark:data-[state=active]:border-transparent">Tools</TabsTrigger>
            <TabsTrigger value="build" className="h-auto bg-transparent p-0 text-sm font-normal shadow-none border-none cursor-pointer text-muted-foreground transition-opacity duration-150 ease-out hover:opacity-70 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:font-medium data-[state=active]:opacity-100 data-[state=active]:hover:opacity-70 dark:data-[state=active]:bg-transparent dark:data-[state=active]:border-transparent">Build</TabsTrigger>
            <TabsTrigger value="productivity" className="h-auto bg-transparent p-0 text-sm font-normal shadow-none border-none cursor-pointer text-muted-foreground transition-opacity duration-150 ease-out hover:opacity-70 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:font-medium data-[state=active]:opacity-100 data-[state=active]:hover:opacity-70 dark:data-[state=active]:bg-transparent dark:data-[state=active]:border-transparent">Productivity</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <div className="flex flex-col gap-3">
              {[...build, ...productivity].map((tool) => (
                <ToolRow key={tool.name} {...tool} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="build">
            <div className="flex flex-col gap-3">
              {build.map((tool) => (
                <ToolRow key={tool.name} {...tool} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="productivity">
            <div className="flex flex-col gap-3">
              {productivity.map((tool) => (
                <ToolRow key={tool.name} {...tool} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Learning */}
        <Section title="Learning">
          <div className="flex flex-col gap-3">
            {learning.map((item) => (
              <div key={item.name} className="flex items-baseline gap-2 min-w-0">
                {item.url ? (
                  <HoverLink href={item.url} className="shrink-0 font-medium no-underline decoration-transparent hover:decoration-foreground">
                    {item.name}
                  </HoverLink>
                ) : (
                  <span className="shrink-0 font-medium text-foreground">{item.name}</span>
                )}
                <span className="truncate text-sm text-muted-foreground">{item.description}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Hobbies */}
        <Section title="Hobbies">
          <div className="flex flex-col gap-3">
            {hobbies.map((hobby) => {
              if (hobby.name === "Pokemon cards") {
                return (
                  <div key={hobby.name} className="flex items-baseline gap-2 min-w-0">
                    <PokemonCards />
                    <span className="truncate text-sm text-muted-foreground">
                      {hobby.description}
                    </span>
                  </div>
                )
              }
              return (
                <div key={hobby.name} className="flex items-baseline gap-2 min-w-0">
                  {hobby.url ? (
                    <HoverLink href={hobby.url} className="shrink-0 font-medium no-underline decoration-transparent hover:decoration-foreground">
                      {hobby.name}
                    </HoverLink>
                  ) : (
                    <span className="shrink-0 font-medium text-foreground">{hobby.name}</span>
                  )}
                  <span className="truncate text-sm text-muted-foreground">
                    {hobby.description}
                  </span>
                </div>
              )
            })}
          </div>
        </Section>
      </div>

      <SiteFooter />
    </main>
  )
}
