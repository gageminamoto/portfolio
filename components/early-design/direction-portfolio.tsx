"use client"

import { ArrowUpRight } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { BackLink } from "@/components/back-link"
import { SiteFooter } from "@/components/site-footer"
import { ViewSwitch } from "@/components/early-design/view-switch"
import { earlyDesignResources } from "@/lib/early-design-resources"
import { fadeUp, noMotion, stagger } from "@/lib/animations"
import { cn } from "@/lib/utils"
import type { EarlyDesignView } from "@/lib/early-design-resources"

type DirectionPortfolioProps = {
  view: EarlyDesignView
  onViewChange: (view: EarlyDesignView) => void
}

function ResourceRow({
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
  const label = `${index + 1}. ${title}`

  const titleNode = url ? (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-1 text-sm font-medium text-foreground underline decoration-dashed decoration-2 decoration-transparent transition-colors duration-150 hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
    >
      {title}
      <ArrowUpRight
        size={12}
        className="shrink-0 text-muted-foreground/60 transition-colors group-hover:text-muted-foreground"
        aria-hidden
      />
      <span className="sr-only"> (opens in new tab)</span>
    </a>
  ) : (
    <span className="text-sm font-medium text-foreground">{title}</span>
  )

  return (
    <article className="flex flex-col gap-1 border-b border-border/40 py-4 first:pt-0 last:border-b-0">
      <div className="flex items-baseline gap-2">
        <span className="w-6 shrink-0 font-mono text-xs tabular-nums text-muted-foreground/70">
          {String(index + 1).padStart(2, "0")}
        </span>
        {titleNode}
      </div>
      {draftWhy ? (
        <p className="pl-8 text-xs leading-relaxed text-muted-foreground/80">
          <span className="font-medium text-muted-foreground/60">Draft — </span>
          {draftWhy.replace(/^Draft:\s*/i, "")}
        </p>
      ) : null}
    </article>
  )
}

export function DirectionPortfolio({ view, onViewChange }: DirectionPortfolioProps) {
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
      <motion.header variants={item}>
        <BackLink href="/">Home</BackLink>
      </motion.header>

      <motion.div variants={item} className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground [text-wrap:balance]">
          Early design resources
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          A short list for people getting started — readings and practices I return to.
        </p>
        <ViewSwitch view={view} onChange={onViewChange} />
      </motion.div>

      <motion.div
        variants={item}
        role="tabpanel"
        id={`early-design-panel-${view}`}
        aria-labelledby={`early-design-tab-${view}`}
        className="flex flex-col"
      >
        <p className="mb-2 text-xs text-muted-foreground/70">
          Draft &ldquo;why&rdquo; lines below are placeholders for Gage to edit.
        </p>
        <div className={cn("flex flex-col")}>
          {earlyDesignResources.map((resource, index) => (
            <ResourceRow
              key={resource.title}
              index={index}
              title={resource.title}
              url={resource.url}
              draftWhy={resource.draftWhy}
            />
          ))}
        </div>
      </motion.div>

      <motion.div variants={item}>
        <SiteFooter />
      </motion.div>
    </motion.main>
  )
}
