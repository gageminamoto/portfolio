"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { EarlyDesignResource } from "@/lib/early-design-resources"
import { getResourceHost } from "@/lib/early-design-resources"

type EarlyDesignResourcePanelProps = {
  resource: EarlyDesignResource
  noteId: string
}

export function EarlyDesignResourcePanel({
  resource,
  noteId,
}: EarlyDesignResourcePanelProps) {
  const shouldReduceMotion = useReducedMotion()
  const host = resource.url ? getResourceHost(resource.url) : null

  return (
    <motion.div
      key={resource.title}
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="flex flex-col gap-3"
    >
      <div className="space-y-1">
        <p className="text-sm font-semibold leading-snug text-foreground [text-wrap:balance]">
          {resource.title}
        </p>
        {host ? (
          <p className="text-xs text-muted-foreground">{host}</p>
        ) : null}
      </div>
      {resource.note ? (
        <p
          id={noteId}
          className="text-pretty text-sm leading-relaxed text-muted-foreground"
        >
          {resource.note}
        </p>
      ) : null}
    </motion.div>
  )
}
