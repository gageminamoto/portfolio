"use client"

import { motion, useReducedMotion } from "framer-motion"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { SiteFooter } from "@/components/site-footer"
import { fadeUp, noMotion, stagger } from "@/lib/animations"

export default function ColophonPage() {
  const shouldReduceMotion = useReducedMotion()
  const item = shouldReduceMotion ? noMotion : fadeUp

  return (
    <motion.main
      id="main-content"
      className="mx-auto flex min-h-screen max-w-xl flex-col gap-12 px-6 py-16 md:py-24"
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

      {/* Title */}
      <motion.div variants={item} className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground [text-wrap:balance]">
          Colophon
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          A few notes on how this site was made.
        </p>
      </motion.div>

      {/* Content */}
      <motion.div variants={item} className="flex flex-col">
        {/* Stack */}
        <div className="pb-8">
          <section className="flex flex-col gap-4">
            <h2 className="text-sm text-muted-foreground">Stack</h2>
            <div className="flex flex-col gap-3">
              <Row label="Framework" value="Next.js" />
              <Row label="Language" value="TypeScript" />
              <Row label="Styling" value="Tailwind CSS" />
              <Row label="Components" value="shadcn/ui" />
              <Row label="Animation" value="Framer Motion" />
              <Row label="Signature" value="Penflow" href="https://penflow.cretu.dev/" />
              <Row label="CMS" value="Notion API" />
              <Row label="Hosting" value="Vercel" />
            </div>
          </section>
        </div>

        <hr className="mx-auto w-1/3 border-t border-dashed border-border/80" />

        {/* Typography */}
        <div className="py-8">
          <section className="flex flex-col gap-4">
            <h2 className="text-sm text-muted-foreground">Typography</h2>
            <div className="flex flex-col gap-3">
              <Row label="Sans" value="Inter" />
              <Row label="Mono" value="JetBrains Mono" />
            </div>
          </section>
        </div>

        <hr className="mx-auto w-1/3 border-t border-dashed border-border/80" />

        {/* Tools */}
        <div className="py-8">
          <section className="flex flex-col gap-4">
            <h2 className="text-sm text-muted-foreground">Tools</h2>
            <div className="flex flex-col gap-3">
              <Row label="Design" value="Figma" />
              <Row label="AI" value="v0, Claude, Conductor" />
              <Row label="Browser tuning" value="Agentation, DialKit" />
              <Row label="Editor" value="Cursor" />
            </div>
          </section>
        </div>

        <hr className="mx-auto w-1/3 border-t border-dashed border-border/80" />

        {/* Philosophy */}
        <div className="py-8">
          <section className="flex flex-col gap-4">
            <h2 className="text-sm text-muted-foreground">Approach</h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              This site is designed to feel calm and simple. No analytics popups, no cookie
              banners, no clutter. Content is pulled from Notion so I can write and update
              without touching code. The source is{" "}
              <a
                href="https://github.com/gageminamoto/portfolio"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline decoration-transparent transition-colors duration-150 hover:decoration-foreground"
              >
                open on GitHub
              </a>
              .
            </p>
          </section>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <SiteFooter />
      </motion.div>
    </motion.main>
  )
}

function Row({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="flex items-baseline gap-2 min-w-0 overflow-hidden">
      <span className="shrink-0 font-medium text-foreground">{label}</span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="truncate text-sm text-muted-foreground underline decoration-transparent transition-colors duration-150 hover:text-foreground hover:decoration-foreground"
        >
          {value}
        </a>
      ) : (
        <span className="truncate text-sm text-muted-foreground">{value}</span>
      )}
    </div>
  )
}
