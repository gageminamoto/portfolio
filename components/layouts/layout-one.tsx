"use client"

import { motion, useReducedMotion } from "framer-motion"
import {
  IconLayers,
  IconPen,
  IconSuitcase,
  IconUser,
} from "@/components/site-icons"
import { portfolioData } from "@/lib/portfolio-data"
import { SocialIcons } from "@/components/social-icons"
import { BioSection } from "@/components/bio-section"
import { SiteFooter } from "@/components/site-footer"
import { WritingSection } from "@/components/writing-section"
import { Section } from "@/components/section"
import { WorkSection } from "@/components/work-section"
import { WorkHoverProvider } from "@/components/work-hover-context"
import { useGradientWord } from "@/components/gradient-word-context"
import { CursorTrail } from "@/components/cursor-trail"
import { fadeUp, noMotion, stagger } from "@/lib/animations"
import type { NotionWritingPost } from "@/lib/notion"

interface LayoutOneProps {
  initialPosts?: NotionWritingPost[]
}

export function LayoutOne({ initialPosts }: LayoutOneProps) {
  const { name, bio, socials, email } = portfolioData
  const { setActiveWord, setCursorTrailActive } = useGradientWord()
  const shouldReduceMotion = useReducedMotion()
  const item = shouldReduceMotion ? noMotion : fadeUp

  return (
    <WorkHoverProvider>
    <motion.main
      id="main-content"
      className="relative z-10 mx-auto flex min-h-screen max-w-xl min-w-0 flex-col gap-12 px-6 py-16 md:gap-14 md:py-24"
      variants={shouldReduceMotion ? undefined : stagger}
      // The homepage's introductory copy is the LCP candidate. Rendering its
      // children with the hidden variant leaves the server-rendered page at
      // opacity: 0 until the full client bundle has hydrated on mobile.
      // Preserve all interaction animations while making the initial content
      // paintable immediately.
      initial={false}
      animate="show"
    >
      {/* Header */}
      <motion.header variants={item} className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {name}
          </h1>
          <BioSection bio={bio} onWordChange={(word) => { setActiveWord(word) }} onUserClick={() => { setCursorTrailActive(true) }} />
        </div>
        <SocialIcons socials={socials} email={email} />
      </motion.header>

      {/* Work */}
      <motion.section variants={item} className="min-w-0 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <IconSuitcase className="h-3.5 w-3.5" />
            Work
          </h2>
        </div>
        <div className="min-w-0 max-w-full">
          <WorkSection />
        </div>
      </motion.section>

      {/* Details */}
      <motion.div variants={item} className="flex flex-col gap-8">
        <Section title="About" href="/about" icon={<IconUser className="h-3.5 w-3.5" />}>
          <p className="text-sm text-muted-foreground">
            More about me.
          </p>
        </Section>

        <Section title="Tools" href="/tools" icon={<IconLayers className="h-3.5 w-3.5" />}>
          <p className="text-sm text-muted-foreground">
            Everything I build with.
          </p>
        </Section>

        <Section title="Writing" href="/writing" icon={<IconPen className="h-3.5 w-3.5" />}>
          <WritingSection variant="default" initialPosts={initialPosts} />
        </Section>
      </motion.div>

      <motion.div variants={item}>
        <SiteFooter />
      </motion.div>

      <CursorTrail />
    </motion.main>
    </WorkHoverProvider>
  )
}
