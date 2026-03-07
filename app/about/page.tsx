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
import { motion } from "framer-motion"
import { useEntranceMotion } from "@/lib/animations"
import dynamic from "next/dynamic"
import useSWR from "swr"
import type { NotionToolItem } from "@/lib/notion"

const PokemonCards = dynamic(
  () => import("@/components/pokemon-cards").then((m) => m.PokemonCards),
  { ssr: false, loading: () => <span className="font-medium text-foreground">Pokemon cards</span> }
)

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function formatLastUpdated(dateStr: string | null): string {
  if (!dateStr) return ""
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function ToolSkeletonRow() {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="h-4 w-32 shrink-0 animate-pulse rounded bg-muted" />
      <div className="h-3 w-40 animate-pulse rounded bg-muted" />
    </div>
  )
}

export default function AboutPage() {
  const { extendedBio, designManifesto, learning, hobbies } = portfolioData
  const { data: toolsData, isLoading: toolsLoading } = useSWR<{
    tools: NotionToolItem[]
    lastUpdated: string | null
  }>("/api/tools", fetcher, { revalidateOnFocus: false })

  const build = toolsData?.tools.filter((t) => t.category === "Build") ?? []
  const productivity = toolsData?.tools.filter((t) => t.category === "Productivity") ?? []
  const skills = toolsData?.tools.filter((t) => t.category === "Skills") ?? []
  const { item, containerProps } = useEntranceMotion()

  return (
    <motion.main
      id="main-content"
      className="mx-auto flex min-h-screen max-w-xl flex-col gap-12 px-6 py-16 md:py-24"
      {...containerProps}
    >
      {/* Header */}
      <motion.header variants={item} className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
        >
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Home
        </Link>
        <ThemeToggle />
      </motion.header>

      {/* Title + Extended About */}
      <motion.div variants={item} className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground [text-wrap:balance]">
          About
        </h1>
        <BioSection bio={extendedBio} />
      </motion.div>

      {/* Sections */}
      <motion.div variants={item} className="flex flex-col">
        {/* Design Manifesto */}
        <div className="pb-8">
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
        </div>

        <hr className="mx-auto w-1/3 border-t border-dashed border-border/80" />

        {/* Hobbies */}
        <div className="py-8">
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

        <hr className="mx-auto w-1/3 border-t border-dashed border-border/80" />

        {/* Learning */}
        <div className="py-8">
        <Section title="Learning">
          <div className="flex flex-col gap-3">
            {learning.map((item) => (
              <ToolRow key={item.name} {...item} />
            ))}
          </div>
        </Section>
        </div>

        <hr className="mx-auto w-1/3 border-t border-dashed border-border/80" />

        {/* Tools */}
        <div className="pt-8">
        <Tabs defaultValue="all" className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between gap-3">
            <TabsList className="h-auto bg-transparent p-0 gap-3">
              {[
                { value: "all", label: "Tools" },
                { value: "build", label: "Build" },
                { value: "productivity", label: "Productivity" },
                { value: "skills", label: "Skills" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="h-auto rounded-none bg-transparent! p-0 text-sm font-normal shadow-none! border-none! cursor-pointer text-muted-foreground transition-opacity duration-150 ease-out hover:opacity-70 data-[state=active]:bg-transparent! data-[state=active]:text-foreground data-[state=active]:shadow-none! data-[state=active]:font-medium data-[state=active]:underline data-[state=active]:underline-offset-4 data-[state=active]:decoration-foreground/50 data-[state=active]:opacity-100 data-[state=active]:hover:opacity-70"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {toolsData?.lastUpdated && (
              <span className="text-xs text-muted-foreground/60">
                Updated {formatLastUpdated(toolsData.lastUpdated)}
              </span>
            )}
          </div>
          {toolsLoading ? (
            <div className="flex flex-col gap-3" aria-busy="true" aria-label="Loading tools">
              {[0, 1, 2, 3, 4].map((i) => (
                <ToolSkeletonRow key={i} />
              ))}
            </div>
          ) : (
            <>
              <TabsContent value="all">
                <div className="flex flex-col gap-3">
                  {[
                    ...build.map((t) => ({ ...t, tag: "Build" as const })),
                    ...productivity.map((t) => ({ ...t, tag: "Productivity" as const })),
                    ...skills.map((s) => ({ ...s, tag: "Skills" as const, isSkill: true })),
                  ].map((item) => (
                    <ToolRow key={item.name} name={item.name} url={item.url ?? undefined} description={item.description} tag={item.tag} isSkill={"isSkill" in item ? item.isSkill : undefined} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="build">
                <div className="flex flex-col gap-3">
                  {build.map((tool) => (
                    <ToolRow key={tool.name} name={tool.name} url={tool.url ?? undefined} description={tool.description} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="productivity">
                <div className="flex flex-col gap-3">
                  {productivity.map((tool) => (
                    <ToolRow key={tool.name} name={tool.name} url={tool.url ?? undefined} description={tool.description} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="skills">
                <div className="flex flex-col gap-3">
                  {skills.map((skill) => (
                    <ToolRow key={skill.name} name={skill.name} url={skill.url ?? undefined} description={skill.description} isSkill />
                  ))}
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <SiteFooter />
      </motion.div>
    </motion.main>
  )
}
