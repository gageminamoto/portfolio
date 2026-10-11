"use client"

import { motion } from "framer-motion"
import type { CSSProperties, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ListRowProps {
  href?: string | null
  external?: boolean
  rel?: string
  icon?: ReactNode
  name: ReactNode
  /** Muted secondary line under the title (e.g. early-design resource notes). */
  description?: ReactNode
  meta?: ReactNode
  variants?: Parameters<typeof motion.a>[0]["variants"]
  style?: CSSProperties
  className?: string
  "aria-label"?: string
}

export function ListRow({
  href,
  external,
  rel,
  icon,
  name,
  description,
  meta,
  variants,
  style,
  className,
  "aria-label": ariaLabel,
}: ListRowProps) {
  const rowClass = cn(
    "flex gap-3 rounded-lg px-0 py-3 transition-[padding,background-color] motion-reduce:transition-none",
    description != null ? "items-start" : "items-center",
    href
      ? "hover:bg-muted hover:px-3 focus-within:bg-muted focus-within:px-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      : "hover:bg-muted hover:px-3",
    className,
  )

  const inner = (
    <>
      {icon}
      {description != null ? (
        <div className="min-w-0 flex-1">
          <span className="text-sm font-medium text-foreground">{name}</span>
          <p className="mt-0.5 text-pretty text-xs leading-snug text-muted-foreground">
            {description}
          </p>
        </div>
      ) : (
        <span className="shrink-0 text-sm font-medium text-foreground">
          {name}
        </span>
      )}
      {meta != null && (
        <span
          className={cn(
            "min-w-0 truncate text-right text-xs text-muted-foreground",
            description != null
              ? "max-w-[42%] shrink-0 pt-0.5"
              : "flex-1",
          )}
        >
          {meta}
        </span>
      )}
    </>
  )

  if (href) {
    if (variants) {
      return (
        <motion.a
          variants={variants}
          href={href}
          {...(external
            ? { target: "_blank", rel: rel ?? "noopener noreferrer" }
            : {})}
          className={rowClass}
          style={style}
          aria-label={ariaLabel}
        >
          {inner}
        </motion.a>
      )
    }

    return (
      <a
        href={href}
        {...(external
          ? { target: "_blank", rel: rel ?? "noopener noreferrer" }
          : {})}
        className={rowClass}
        style={style}
        aria-label={ariaLabel}
      >
        {inner}
      </a>
    )
  }

  if (variants) {
    return (
      <motion.div variants={variants} className={rowClass} style={style}>
        {inner}
      </motion.div>
    )
  }

  return (
    <div className={rowClass} style={style}>
      {inner}
    </div>
  )
}
