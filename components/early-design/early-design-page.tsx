"use client"

import { motion, useReducedMotion } from "framer-motion"
import { BackLink } from "@/components/back-link"
import { ListRow } from "@/components/list-row"
import { SiteFooter } from "@/components/site-footer"
import { PageActions } from "@/components/page-actions"
import {
  earlyDesignResources,
  getResourceHost,
} from "@/lib/early-design-resources"
import { fadeUp, noMotion, stagger } from "@/lib/animations"

const linkRowClass =
  "focus-within:bg-transparent focus-within:px-0 focus-visible:bg-muted focus-visible:px-3"

export function EarlyDesignPage() {
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
        <nav className="flex items-center justify-between">
          <BackLink href="/">Home</BackLink>
          <PageActions />
        </nav>
      </motion.header>

      <motion.div variants={item}>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground [text-wrap:balance]">
          Early design resources
        </h1>
      </motion.div>

      <motion.div variants={item}>
        <ul className="flex flex-col">
          {earlyDesignResources.map((resource) => (
            <li key={resource.title}>
              <ListRow
                href={resource.url}
                external={Boolean(resource.url)}
                name={resource.title}
                meta={
                  resource.url ? getResourceHost(resource.url) : undefined
                }
                aria-label={
                  resource.url
                    ? `${resource.title} (opens in new tab)`
                    : resource.title
                }
                className={resource.url ? linkRowClass : undefined}
              />
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div variants={item}>
        <SiteFooter />
      </motion.div>
    </motion.main>
  )
}
