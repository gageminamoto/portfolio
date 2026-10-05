"use client"

import { Fragment } from "react"
import { motion, useReducedMotion, type Variants } from "framer-motion"
import { BackLink } from "@/components/back-link"
import { ListRow } from "@/components/list-row"
import { SiteFooter } from "@/components/site-footer"
import {
  earlyDesignResources,
  getResourceHost,
  groupResourcesByLink,
} from "@/lib/early-design-resources"
import { noMotion } from "@/lib/animations"

const resourceGroups = groupResourcesByLink(earlyDesignResources)

const earlyDesignStagger: Variants = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.04,
      staggerChildren: 0.05,
    },
  },
}

const earlyDesignItem: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.26,
      ease: [0.23, 1, 0.32, 1],
    },
  },
}

export function EarlyDesignPage() {
  const shouldReduceMotion = useReducedMotion()
  const item = shouldReduceMotion ? noMotion : earlyDesignItem

  return (
    <motion.main
      id="main-content"
      className="mx-auto flex min-h-screen max-w-xl flex-col gap-12 px-6 py-16 md:py-24"
      variants={shouldReduceMotion ? undefined : earlyDesignStagger}
      initial="hidden"
      animate="show"
    >
      <motion.header variants={item}>
        <BackLink href="/">Home</BackLink>
      </motion.header>

      <motion.div variants={item}>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground [text-wrap:balance]">
          Early design resources
        </h1>
      </motion.div>

      <motion.div variants={item} className="flex flex-col">
        {resourceGroups.map((group, groupIndex) => (
          <Fragment key={group[0].title}>
            {groupIndex > 0 && (
              <hr className="mx-auto my-6 w-1/3 border-t border-dashed border-border/80" />
            )}
            <ul className="flex flex-col">
              {group.map((resource) => (
                <li key={resource.title}>
                  {resource.url ? (
                    <ListRow
                      href={resource.url}
                      external
                      name={resource.title}
                      meta={getResourceHost(resource.url)}
                      aria-label={`${resource.title} (opens in new tab)`}
                    />
                  ) : (
                    <ListRow
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
