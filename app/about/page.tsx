"use client"

import { useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { useTheme } from "next-themes"
import { BackLink } from "@/components/back-link"
import { SiteFooter } from "@/components/site-footer"
import { Section } from "@/components/section"
import { BioSection, bodyCopyClassName } from "@/components/bio-section"
import { HoverLink } from "@/components/hover-link"
import { CursorTrail } from "@/components/cursor-trail"
import { ProjectCarousel } from "@/components/project-carousel"
import { useGradientWord } from "@/components/gradient-word-context"
import { IconMessage, IconPin, IconSparkles, IconSuitcase } from "@/components/site-icons"
import { portfolioData } from "@/lib/portfolio-data"
import { formatFeatureDescriptionMobile } from "@/lib/timeline-period"
import { TimelineSection } from "@/components/timeline-section"
import { fadeUp, noMotion, stagger } from "@/lib/animations"
import dynamic from "next/dynamic"

const Penflow = dynamic(
  () => import("penflow/react").then((m) => m.Penflow),
  {
    ssr: false,
    // Penflow is client-only. Keep its final canvas footprint in the initial
    // render so loading the module and font cannot move the content below it.
    loading: () => <span aria-hidden="true" className="block h-[79px] w-[160px]" />,
  }
)

export default function AboutPage() {
  const { extendedBio, speaking, timeline, projects } = portfolioData
  const [penflowKey, setPenflowKey] = useState(0)
  const { setActiveWord, setCursorTrailActive } = useGradientWord()
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
        <BackLink href="/">Home</BackLink>
      </motion.header>

      {/* Title + Extended About */}
      <motion.div variants={item} className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground [text-wrap:balance]">
          About
        </h1>
        <BioSection
          bio={extendedBio}
          onWordChange={(word) => { setActiveWord(word) }}
          onUserClick={() => { setCursorTrailActive(true) }}
        />
        <button
          type="button"
          className="mt-2 h-[79px] w-fit cursor-pointer overflow-hidden [&_canvas]:!w-auto [&_canvas]:-mt-4"
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
        {/* Timeline */}
        <div className="pb-8">
          <TimelineSection
            items={timeline}
            icon={<IconSuitcase className="h-3.5 w-3.5" />}
          />
        </div>

        {/* Side projects */}
        <div className="py-8">
          <Section title="Projects" icon={<IconPin className="h-3.5 w-3.5" />}>
            <div className={`${bodyCopyClassName} text-muted-foreground`}>
              <p>
                More often than not, I&apos;ll be working on a side project, testing a tool, making something I need that doesn&apos;t exist, or just scratching a creative itch.
              </p>
            </div>
            <div className="min-w-0 max-w-full">
              <ProjectCarousel projects={projects} />
            </div>
          </Section>
        </div>

        {/* Hobbies */}
        <div className="py-8">
        <Section title="Hobbies" icon={<IconSparkles className="h-3.5 w-3.5" />}>
          <div className={`${bodyCopyClassName} text-foreground`}>
            <p>
              Pokémon cards, TTRPGs, developing PICO-8 games, analog photography, design books, camping
            </p>
          </div>
        </Section>
        </div>


        {/* Features */}
        <div className="py-8">
        <Section title="Features" icon={<IconMessage className="h-3.5 w-3.5" />}>
          <div className="flex flex-col gap-3">
            {speaking.map((item) => (
              <div key={item.name} className="flex items-baseline gap-2 min-w-0 overflow-hidden">
                {item.url ? (
                  <HoverLink
                    href={item.url}
                    truncate
                    className="min-w-0 flex-1 font-medium no-underline decoration-transparent hover:decoration-primary"
                  >
                    {item.name}
                  </HoverLink>
                ) : (
                  <span className="min-w-0 flex-1 truncate font-medium text-foreground">{item.name}</span>
                )}
                {item.description && (
                  <>
                    <span className="shrink-0 text-sm text-muted-foreground md:hidden">
                      {formatFeatureDescriptionMobile(item.description)}
                    </span>
                    <span className="hidden shrink-0 text-sm text-muted-foreground md:inline">
                      {item.description}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        </Section>
        </div>

      </motion.div>

      <motion.div variants={item}>
        <SiteFooter />
      </motion.div>
      <CursorTrail />
    </motion.main>
  )
}
