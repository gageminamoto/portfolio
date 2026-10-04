"use client"

import { motion, useReducedMotion } from "framer-motion"
import { BackLink } from "@/components/back-link"
import { SiteFooter } from "@/components/site-footer"
import { ViewSwitch } from "@/components/early-design/view-switch"
import {
  earlyDesignResources,
  getResourceHost,
} from "@/lib/early-design-resources"
import { fadeUp, noMotion, stagger } from "@/lib/animations"
import { cn } from "@/lib/utils"
import type { EarlyDesignResource, EarlyDesignView } from "@/lib/early-design-resources"
import type { Variants } from "framer-motion"

type DirectionEditorialProps = {
  view: EarlyDesignView
  onViewChange: (view: EarlyDesignView) => void
}

const rowClass =
  "grid grid-cols-1 gap-x-8 gap-y-0.5 px-3 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline"
const titleClass =
  "text-[15px] font-medium leading-snug tracking-[-0.01em] text-foreground [text-wrap:pretty]"
const hostClass = "text-[13px] leading-snug text-muted-foreground sm:text-right"

function IndexRow({
  resource,
  variants,
}: {
  resource: EarlyDesignResource
  variants: Variants
}) {
  const { title, url } = resource

  if (!url) {
    return (
      <motion.li variants={variants} className="border-b border-border">
        <div className={rowClass}>
          <span className={titleClass}>{title}</span>
        </div>
      </motion.li>
    )
  }

  return (
    <motion.li variants={variants} className="border-b border-border">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          rowClass,
          "group transition-colors duration-150 ease-out hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring motion-reduce:transition-none",
        )}
      >
        <span className={titleClass}>
          {title}
          <span className="sr-only"> (opens in new tab)</span>
        </span>
        <span
          className={cn(
            hostClass,
            "transition-colors duration-150 ease-out group-hover:text-foreground group-focus-visible:text-foreground motion-reduce:transition-none",
          )}
        >
          {getResourceHost(url)}
        </span>
      </a>
    </motion.li>
  )
}

export function DirectionEditorial({ view, onViewChange }: DirectionEditorialProps) {
  const shouldReduceMotion = useReducedMotion()
  const item = shouldReduceMotion ? noMotion : fadeUp

  return (
    <motion.main
      id="main-content"
      className="flex min-h-screen flex-col px-6 py-10 md:py-14"
      variants={shouldReduceMotion ? undefined : stagger}
      initial="hidden"
      animate="show"
    >
      <motion.header
        variants={item}
        className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4"
      >
        <BackLink href="/">Home</BackLink>
        <ViewSwitch view={view} onChange={onViewChange} />
      </motion.header>

      <motion.div variants={item} className="mx-auto w-full max-w-5xl py-20 md:py-32">
        <h1 className="text-center text-[clamp(2.75rem,9vw,6rem)] font-semibold uppercase leading-[0.88] tracking-[-0.045em] text-foreground [text-wrap:balance]">
          Early design resources
        </h1>
      </motion.div>

      <motion.div
        variants={shouldReduceMotion ? undefined : stagger}
        role="tabpanel"
        id={`early-design-panel-${view}`}
        aria-labelledby={`early-design-tab-${view}`}
        className="mx-auto w-full max-w-2xl"
      >
        <ul className="-mx-3 border-t border-foreground">
          {earlyDesignResources.map((resource) => (
            <IndexRow key={resource.title} resource={resource} variants={item} />
          ))}
        </ul>
      </motion.div>

      <motion.div variants={item} className="mx-auto mt-20 w-full max-w-2xl md:mt-28">
        <SiteFooter />
      </motion.div>
    </motion.main>
  )
}
