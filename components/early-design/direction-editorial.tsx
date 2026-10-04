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

function EditorialCell({
  resource,
  variants,
}: {
  resource: EarlyDesignResource
  variants: Variants
}) {
  const { title, url } = resource
  const itemClass =
    "flex border-b border-border last:border-b-0 md:odd:border-r md:[&:nth-last-child(2):nth-child(odd)]:border-b-0"
  const cellClass =
    "flex min-h-32 w-full flex-col justify-between gap-8 p-6 md:min-h-44 md:p-8"
  const titleClass =
    "text-2xl font-semibold leading-[1.05] tracking-[-0.03em] [text-wrap:balance] md:text-3xl"

  if (!url) {
    return (
      <motion.li variants={variants} className={itemClass}>
        <div className={cn(cellClass, "justify-end")}>
          <p className={cn(titleClass, "text-foreground")}>{title}</p>
        </div>
      </motion.li>
    )
  }

  return (
    <motion.li variants={variants} className={itemClass}>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          cellClass,
          "group text-foreground transition-colors duration-200 ease-out hover:bg-foreground hover:text-background focus-visible:bg-foreground focus-visible:text-background focus-visible:outline-none motion-reduce:transition-none",
        )}
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground transition-colors duration-200 ease-out group-hover:text-background/60 group-focus-visible:text-background/60 motion-reduce:transition-none">
          {getResourceHost(url)}
        </span>
        <span className={titleClass}>
          {title}
          <span className="sr-only"> (opens in new tab)</span>
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
      className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 pt-8 md:px-10 md:pt-10"
      variants={shouldReduceMotion ? undefined : stagger}
      initial="hidden"
      animate="show"
    >
      <motion.header
        variants={item}
        className="flex items-center justify-between gap-4 border-b border-foreground pb-4"
      >
        <BackLink href="/">Home</BackLink>
        <ViewSwitch view={view} onChange={onViewChange} />
      </motion.header>

      <motion.div variants={item} className="py-16 md:py-28">
        <h1 className="max-w-4xl text-[clamp(3rem,11vw,7.5rem)] font-semibold leading-[0.9] tracking-[-0.05em] text-foreground [text-wrap:balance]">
          Early design resources
        </h1>
      </motion.div>

      <motion.div
        variants={shouldReduceMotion ? undefined : stagger}
        role="tabpanel"
        id={`early-design-panel-${view}`}
        aria-labelledby={`early-design-tab-${view}`}
      >
        <ul className="grid grid-cols-1 border-y border-foreground md:grid-cols-2">
          {earlyDesignResources.map((resource) => (
            <EditorialCell key={resource.title} resource={resource} variants={item} />
          ))}
        </ul>
      </motion.div>

      <motion.div variants={item} className="mt-16 md:mt-24">
        <SiteFooter />
      </motion.div>
    </motion.main>
  )
}
