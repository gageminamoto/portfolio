"use client"

import { Fragment } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { BackLink } from "@/components/back-link"
import { ListRow } from "@/components/list-row"
import { SiteFooter } from "@/components/site-footer"
import { ViewSwitch } from "@/components/early-design/view-switch"
import {
  earlyDesignResources,
  getResourceHost,
  groupResourcesByLink,
} from "@/lib/early-design-resources"
import { fadeUp, noMotion, stagger } from "@/lib/animations"
import type { EarlyDesignView } from "@/lib/early-design-resources"

type DirectionPortfolioProps = {
  view: EarlyDesignView
  onViewChange: (view: EarlyDesignView) => void
}

const resourceGroups = groupResourcesByLink(earlyDesignResources)

export function DirectionPortfolio({ view, onViewChange }: DirectionPortfolioProps) {
  const shouldReduceMotion = useReducedMotion()
  const item = shouldReduceMotion ? noMotion : fadeUp
  const list = shouldReduceMotion ? undefined : stagger

  return (
    <motion.main
      id="main-content"
      className="mx-auto flex min-h-screen max-w-xl flex-col gap-12 px-6 py-16 md:py-24"
      variants={shouldReduceMotion ? undefined : stagger}
      initial="hidden"
      animate="show"
    >
      <motion.header variants={item} className="flex items-center justify-between gap-4">
        <BackLink href="/">Home</BackLink>
        <ViewSwitch view={view} onChange={onViewChange} />
      </motion.header>

      <motion.div variants={item}>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground [text-wrap:balance]">
          Early design resources
        </h1>
      </motion.div>

      <motion.div
        variants={list}
        role="tabpanel"
        id={`early-design-panel-${view}`}
        aria-labelledby={`early-design-tab-${view}`}
        className="flex flex-col"
      >
        {resourceGroups.map((group, groupIndex) => (
          <Fragment key={group[0].title}>
            {groupIndex > 0 && (
              <motion.hr
                variants={item}
                className="mx-auto my-6 w-1/3 border-t border-dashed border-border/80"
              />
            )}
            <ul className="flex flex-col">
              {group.map((resource) => (
                <li key={resource.title}>
                  {resource.url ? (
                    <ListRow
                      variants={item}
                      href={resource.url}
                      external
                      name={
                        <span className="underline decoration-dashed decoration-2 decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-150 ease-out group-hover:decoration-muted-foreground/40 group-focus-visible:decoration-muted-foreground/40 motion-reduce:transition-none">
                          {resource.title}
                        </span>
                      }
                      meta={
                        <span className="transition-colors duration-150 ease-out group-hover:text-foreground group-focus-visible:text-foreground motion-reduce:transition-none">
                          {getResourceHost(resource.url)}
                        </span>
                      }
                      aria-label={`${resource.title} (opens in new tab)`}
                      className="group"
                    />
                  ) : (
                    <ListRow
                      variants={item}
                      name={resource.title}
                      className="hover:bg-transparent hover:px-0"
                    />
                  )}
                </li>
              ))}
            </ul>
          </Fragment>
        ))}
      </motion.div>

      <motion.div variants={item}>
        <SiteFooter />
      </motion.div>
    </motion.main>
  )
}
