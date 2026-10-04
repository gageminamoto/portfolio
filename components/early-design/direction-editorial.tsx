"use client"

import { ArrowUpRight } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import Link from "next/link"
import { BackLink } from "@/components/back-link"
import { SiteFooter } from "@/components/site-footer"
import { ViewSwitch } from "@/components/early-design/view-switch"
import { earlyDesignResources } from "@/lib/early-design-resources"
import { fadeUp, noMotion, stagger } from "@/lib/animations"
import type { EarlyDesignView } from "@/lib/early-design-resources"

type DirectionEditorialProps = {
  view: EarlyDesignView
  onViewChange: (view: EarlyDesignView) => void
}

function EditorialCard({
  index,
  title,
  url,
  draftWhy,
}: {
  index: number
  title: string
  url?: string
  draftWhy?: string
}) {
  const inner = (
    <>
      <span
        className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/50"
        aria-hidden
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-2 md:flex-row md:items-start md:justify-between md:gap-8">
        <h2 className="text-lg font-semibold leading-snug tracking-tight text-foreground md:text-xl [text-wrap:balance]">
          {title}
        </h2>
        {url ? (
          <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium uppercase tracking-wide text-primary">
            Read
            <ArrowUpRight size={14} aria-hidden />
          </span>
        ) : (
          <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-muted-foreground/50">
            No link yet
          </span>
        )}
      </div>
      {draftWhy ? (
        <p className="text-sm leading-relaxed text-muted-foreground md:col-span-2 md:pl-0">
          <span className="mr-1 rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
            Draft
          </span>
          {draftWhy.replace(/^Draft:\s*/i, "")}
        </p>
      ) : null}
    </>
  )

  const cardClass =
    "group relative grid grid-cols-1 gap-3 border border-border/70 bg-card/40 p-5 transition-colors duration-200 hover:border-foreground/25 hover:bg-muted/30 focus-within:border-foreground/25 focus-within:bg-muted/30 md:grid-cols-[auto_1fr] md:gap-x-6 md:gap-y-3"

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClass + " rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"}
        aria-label={`${title} (opens in new tab)`}
      >
        {inner}
      </a>
    )
  }

  return <article className={cardClass + " rounded-2xl"}>{inner}</article>
}

export function DirectionEditorial({ view, onViewChange }: DirectionEditorialProps) {
  const shouldReduceMotion = useReducedMotion()
  const item = shouldReduceMotion ? noMotion : fadeUp

  return (
    <motion.main
      id="main-content"
      className="relative mx-auto flex min-h-screen max-w-3xl flex-col gap-12 px-6 py-16 md:px-10 md:py-24"
      variants={shouldReduceMotion ? undefined : stagger}
      initial="hidden"
      animate="show"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"
        aria-hidden
      />

      <motion.header variants={item} className="relative">
        <BackLink href="/">Home</BackLink>
      </motion.header>

      <motion.div variants={item} className="relative flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Starter shelf
          </p>
          <h1 className="max-w-2xl text-3xl font-semibold leading-[1.1] tracking-tight text-foreground md:text-4xl [text-wrap:balance]">
            Early design resources
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
            Ten things worth your time when you&apos;re learning how design shows up in real
            products — not a syllabus, just a shelf I&apos;d hand someone on day one.
          </p>
        </div>
        <ViewSwitch view={view} onChange={onViewChange} />
      </motion.div>

      <motion.div
        variants={item}
        role="tabpanel"
        id={`early-design-panel-${view}`}
        aria-labelledby={`early-design-tab-${view}`}
        className="relative flex flex-col gap-3"
      >
        {earlyDesignResources.map((resource, index) => (
          <EditorialCard
            key={resource.title}
            index={index}
            title={resource.title}
            url={resource.url}
            draftWhy={resource.draftWhy}
          />
        ))}
      </motion.div>

      <motion.footer variants={item} className="relative flex flex-col gap-6 border-t border-dashed border-border/80 pt-8">
        <p className="text-xs text-muted-foreground">
          Curated from Gage&apos;s Notion list. Share this page with{" "}
          <Link
            href="/early-design?view=a"
            className="font-medium text-foreground underline decoration-dashed decoration-2 underline-offset-4 hover:decoration-primary"
          >
            ?view=a
          </Link>{" "}
          or{" "}
          <Link
            href="/early-design?view=b"
            className="font-medium text-foreground underline decoration-dashed decoration-2 underline-offset-4 hover:decoration-primary"
          >
            ?view=b
          </Link>{" "}
          to compare layouts.
        </p>
        <SiteFooter />
      </motion.footer>
    </motion.main>
  )
}
