"use client"

import { motion, useReducedMotion } from "framer-motion"
import { BackLink } from "@/components/back-link"
import { SiteFooter } from "@/components/site-footer"
import { ViewSwitch } from "@/components/early-design/view-switch"
import { earlyDesignResources } from "@/lib/early-design-resources"
import { fadeUp, noMotion, stagger } from "@/lib/animations"
import { cn } from "@/lib/utils"
import type { EarlyDesignView } from "@/lib/early-design-resources"

type DirectionEditorialProps = {
  view: EarlyDesignView
  onViewChange: (view: EarlyDesignView) => void
}

function EditorialRow({ title, url }: { title: string; url?: string }) {
  const className = cn(
    "block border-b border-border/60 py-4 text-lg font-medium tracking-tight text-foreground first:pt-0 last:border-b-0",
    url &&
      "underline decoration-dashed decoration-2 decoration-transparent transition-colors duration-150 hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm",
  )

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {title}
        <span className="sr-only"> (opens in new tab)</span>
      </a>
    )
  }

  return <p className={className}>{title}</p>
}

export function DirectionEditorial({ view, onViewChange }: DirectionEditorialProps) {
  const shouldReduceMotion = useReducedMotion()
  const item = shouldReduceMotion ? noMotion : fadeUp

  return (
    <motion.main
      id="main-content"
      className="mx-auto flex min-h-screen max-w-2xl flex-col gap-10 px-6 py-16 md:px-8 md:py-24"
      variants={shouldReduceMotion ? undefined : stagger}
      initial="hidden"
      animate="show"
    >
      <motion.header variants={item}>
        <BackLink href="/">Home</BackLink>
      </motion.header>

      <motion.div variants={item} className="flex flex-col gap-6">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground [text-wrap:balance] md:text-4xl">
          Early design resources
        </h1>
        <ViewSwitch view={view} onChange={onViewChange} />
      </motion.div>

      <motion.div
        variants={item}
        role="tabpanel"
        id={`early-design-panel-${view}`}
        aria-labelledby={`early-design-tab-${view}`}
      >
        {earlyDesignResources.map((resource) => (
          <EditorialRow
            key={resource.title}
            title={resource.title}
            url={resource.url}
          />
        ))}
      </motion.div>

      <motion.div variants={item}>
        <SiteFooter />
      </motion.div>
    </motion.main>
  )
}
