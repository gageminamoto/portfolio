"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { SiteFooter } from "@/components/site-footer"
import { Section } from "@/components/section"
import { ToolRow } from "@/components/tool-row"
import { BioSection } from "@/components/bio-section"
import { HoverLink } from "@/components/hover-link"
import { portfolioData } from "@/lib/portfolio-data"
import dynamic from "next/dynamic"

const Penflow = dynamic(
  () => import("penflow/react").then((m) => m.Penflow),
  { ssr: false }
)

const PokemonCards = dynamic(
  () => import("@/components/pokemon-cards").then((m) => m.PokemonCards),
  { ssr: false, loading: () => <span className="relative inline-flex font-medium text-foreground">Pokemon cards</span> }
)

export default function AboutPage() {
  const { extendedBio, designManifesto, learning, hobbies, speaking } = portfolioData
  const [penflowKey, setPenflowKey] = useState(0)
  const { resolvedTheme } = useTheme()
  const penflowColor = resolvedTheme === "dark" ? "#ffffff" : "#0f1117"
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
        <div
          className="mt-2 w-fit cursor-pointer overflow-hidden [&_canvas]:!w-auto [&_canvas]:-mt-4"
          onClick={() => setPenflowKey((k) => k + 1)}
        >
          <Penflow
            text="gage"
            fontUrl="/fonts/BrittanySignature.ttf"
            color={penflowColor}
            size={48}
            lineHeight={1.6}
            animate
            playheadKey={penflowKey}
          />
        </div>
      </div>

      {/* Sections */}
      <div className="flex flex-col">
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
                  <div key={hobby.name} className="flex items-baseline gap-2 min-w-0 overflow-hidden">
                    <span className="shrink-0"><PokemonCards /></span>
                    <span className="truncate text-sm text-muted-foreground">
                      {hobby.description}
                    </span>
                  </div>
                )
              }
              return (
                <div key={hobby.name} className="flex items-baseline gap-2 min-w-0 overflow-hidden">
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

        {/* Speaking */}
        <div className="py-8">
        <Section title="Speaking">
          <div className="flex flex-col gap-3">
            {speaking.map((item) => (
              <div key={item.name} className="flex items-baseline gap-2 min-w-0 overflow-hidden">
                <span className="truncate font-medium text-foreground">{item.name}</span>
                {item.description && (
                  <span className="shrink-0 text-sm text-muted-foreground">
                    {item.description}
                  </span>
                )}
              </div>
            ))}
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

      </div>

      <SiteFooter />
    </main>
  )
}
