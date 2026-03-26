"use client"

import { useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { useTheme } from "next-themes"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { SiteFooter } from "@/components/site-footer"
import { BentoCard } from "@/components/bento-card"
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
  const { extendedBio, designManifesto, learning, hobbies, speaking, workHistory } = portfolioData
  const [penflowKey, setPenflowKey] = useState(0)
  const { resolvedTheme } = useTheme()
  const shouldReduceMotion = useReducedMotion()
  const item = shouldReduceMotion ? noMotion : fadeUp
  const penflowColor = resolvedTheme === "dark" ? "#ffffff" : "#0f1117"
  return (
    <motion.main
      id="main-content"
      className="mx-auto flex min-h-screen max-w-xl flex-col gap-8 px-6 py-16 md:py-24"
      variants={shouldReduceMotion ? undefined : stagger}
      initial="hidden"
      animate="show"
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

      {/* Bio */}
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

      {/* Bento Grid */}
      <motion.div
        className="grid grid-cols-1 gap-3 md:grid-cols-2"
        variants={shouldReduceMotion ? undefined : stagger}
        initial="hidden"
        animate="show"
      >
        {/* Work History — full width */}
        <motion.div variants={item} className="col-span-1 md:col-span-2">
          <BentoCard className="h-full">
            <WorkHistorySection items={workHistory} />
          </BentoCard>
        </motion.div>

        {/* Hobbies */}
        <motion.div variants={item} className="relative z-10 col-span-1">
          <BentoCard label="Hobbies" className="h-full overflow-visible">
            <div className="flex flex-col gap-4">
              {hobbies.map((hobby) => (
                <div key={hobby.name} className="flex flex-col gap-0.5">
                  {hobby.name === "Pokemon cards" ? (
                    <span className="shrink-0"><PokemonCards /></span>
                  ) : hobby.url ? (
                    <HoverLink href={hobby.url} className="font-medium no-underline decoration-transparent hover:decoration-foreground">
                      {hobby.name}
                    </HoverLink>
                  ) : (
                    <span className="font-medium text-foreground">{hobby.name}</span>
                  )}
                  {hobby.description && (
                    <span className="text-sm text-muted-foreground/80">
                      {hobby.description}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </BentoCard>
        </motion.div>

        {/* Speaking */}
        <motion.div variants={item} className="col-span-1">
          <BentoCard label="Speaking" className="h-full">
            <div className="flex flex-col gap-4">
              {speaking.map((item) => (
                <div key={item.name} className="flex flex-col gap-0.5">
                  <span className="font-medium text-foreground">{item.name}</span>
                  {item.description && (
                    <span className="text-sm text-muted-foreground/80">
                      {item.description}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </BentoCard>
        </motion.div>

        {/* Design Manifesto */}
        <motion.div variants={item} className="col-span-1">
          <BentoCard label="Design Manifesto" className="h-full">
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
          </BentoCard>
        </motion.div>

        {/* Learning */}
        <motion.div variants={item} className="col-span-1">
          <BentoCard label="Learning" className="h-full">
            <div className="flex flex-col gap-3">
              {learning.map((item) => (
                <ToolRow key={item.name} {...item} />
              ))}
            </div>
          </BentoCard>
        </motion.div>
      </motion.div>

      <motion.div variants={item}>
        <SiteFooter />
      </motion.div>
    </motion.main>
  )
}
