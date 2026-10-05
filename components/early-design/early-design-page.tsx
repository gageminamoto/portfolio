"use client"

import { Fragment } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { BackLink } from "@/components/back-link"
import { SiteFooter } from "@/components/site-footer"
import {
  earlyDesignResources,
  getResourceHost,
  groupResourcesByLink,
} from "@/lib/early-design-resources"
import { fadeUp, noMotion, stagger } from "@/lib/animations"
import { cn } from "@/lib/utils"

const resourceGroups = groupResourcesByLink(earlyDesignResources)

function ResourceRow({
  title,
  url,
}: {
  title: string
  url?: string
}) {
  const rowClass = cn(
    "flex items-center gap-3 rounded-lg px-0 py-3 transition-[padding,background-color] motion-reduce:transition-none",
    url
      ? "hover:bg-muted hover:px-3 focus-visible:bg-muted focus-visible:px-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      : "hover:bg-muted hover:px-3",
  )

  const inner = (
    <>
      <span className="shrink-0 text-sm font-medium text-foreground">{title}</span>
      {url ? (
        <span className="min-w-0 flex-1 truncate text-right text-xs text-muted-foreground">
          {getResourceHost(url)}
        </span>
      ) : null}
    </>
  )

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={rowClass}
        aria-label={`${title} (opens in new tab)`}
      >
        {inner}
      </a>
    )
  }

  return <div className={rowClass}>{inner}</div>
}

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
                  <ResourceRow title={resource.title} url={resource.url} />
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
