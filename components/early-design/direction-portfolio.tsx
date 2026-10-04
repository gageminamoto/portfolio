"use client"

import { motion, useReducedMotion } from "framer-motion"
import { BackLink } from "@/components/back-link"
import { ListRow } from "@/components/list-row"
import { SiteFooter } from "@/components/site-footer"
import { ViewSwitch } from "@/components/early-design/view-switch"
import { earlyDesignResources } from "@/lib/early-design-resources"
import { fadeUp, noMotion, stagger } from "@/lib/animations"
import type { EarlyDesignView } from "@/lib/early-design-resources"

type DirectionPortfolioProps = {
  view: EarlyDesignView
  onViewChange: (view: EarlyDesignView) => void
}

export function DirectionPortfolio({ view, onViewChange }: DirectionPortfolioProps) {
  const shouldReduceMotion = useReducedMotion()
  const item = shouldReduceMotion ? noMotion : fadeUp

  return (
    <motion.main
      id="main-content"
      className="mx-auto flex min-h-screen max-w-xl flex-col gap-10 px-6 py-16 md:py-24"
      variants={shouldReduceMotion ? undefined : stagger}
      initial="hidden"
      animate="show"
    >
      <motion.header variants={item}>
        <BackLink href="/">Home</BackLink>
      </motion.header>

      <motion.div variants={item} className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground [text-wrap:balance]">
          Early design resources
        </h1>
        <ViewSwitch view={view} onChange={onViewChange} />
      </motion.div>

      <motion.div
        variants={item}
        role="tabpanel"
        id={`early-design-panel-${view}`}
        aria-labelledby={`early-design-tab-${view}`}
        className="flex flex-col"
      >
        {earlyDesignResources.map((resource) => (
          <ListRow
            key={resource.title}
            href={resource.url ?? null}
            external={Boolean(resource.url)}
            name={resource.title}
            aria-label={
              resource.url ? `${resource.title} (opens in new tab)` : resource.title
            }
          />
        ))}
      </motion.div>

      <motion.div variants={item}>
        <SiteFooter />
      </motion.div>
    </motion.main>
  )
}
