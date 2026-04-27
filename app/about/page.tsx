"use client"

import { useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { useTheme } from "next-themes"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { SiteFooter } from "@/components/site-footer"
import { Section } from "@/components/section"
import { ToolRow } from "@/components/tool-row"
import { BioSection } from "@/components/bio-section"
import { HoverLink } from "@/components/hover-link"
import { portfolioData } from "@/lib/portfolio-data"
import { WorkHistorySection } from "@/components/work-history-section"
import { fadeUp, noMotion, stagger } from "@/lib/animations"
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
  const { extendedBio, learning, hobbies, speaking, workHistory } = portfolioData
  const [penflowKey, setPenflowKey] = useState(0)
  const { resolvedTheme } = useTheme()
  const shouldReduceMotion = useReducedMotion()
  const item = shouldReduceMotion ? noMotion : fadeUp
  const penflowColor = resolvedTheme === "dark" ? "#ffffff" : "#0f1117"
  return (
    <motion.main
      id="main-content"
      className="mx-auto flex min-h-screen max-w-xl flex-col gap-12 px-6 py-16 md:py-24"
      variants={shouldReduceMotion ? undefined : stagger}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.header variants={item}>
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
        >
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Home
        </Link>
      </motion.header>

      {/* Title + Extended About */}
      <motion.div variants={item} className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground [text-wrap:balance]">
          About
        </h1>
        <BioSection bio={extendedBio} />
        <button
          type="button"
          className="mt-2 w-fit cursor-pointer overflow-hidden [&_canvas]:!w-auto [&_canvas]:-mt-4"
          onClick={() => setPenflowKey((k) => k + 1)}
          aria-label="Replay signature animation"
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
        </button>
      </motion.div>

      {/* Sections */}
      <motion.div variants={item} className="flex flex-col">
        {/* Work History */}
        <div className="pb-8">
          <WorkHistorySection items={workHistory} />
        </div>


        {/* Hobbies */}
        <div className="py-8">
        <Section title="Hobbies">
          <div className="flex flex-col gap-3">
            {hobbies.map((hobby) => {
              if (hobby.name === "Pokemon cards") {
                return (
                  <div key={hobby.name} className="flex items-baseline gap-2 min-w-0">
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
                    <HoverLink href={hobby.url} className="shrink-0 font-medium no-underline decoration-transparent hover:decoration-primary">
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


        {/* Speaking */}
        <div className="py-8">
        <Section title="Speaking">
          <div className="flex flex-col gap-3">
            {speaking.map((item) => (
              <div key={item.name} className="flex items-baseline gap-2 min-w-0 overflow-hidden">
                {item.url ? (
                  <HoverLink href={item.url} className="truncate font-medium no-underline decoration-transparent hover:decoration-primary">
                    {item.name}
                  </HoverLink>
                ) : (
                  <span className="truncate font-medium text-foreground">{item.name}</span>
                )}
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

      </motion.div>

      <motion.div variants={item}>
        <SiteFooter />
      </motion.div>
    </motion.main>
  )
}
