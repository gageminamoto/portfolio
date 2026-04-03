"use client"

import { motion } from "framer-motion"
import type { CSSProperties, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ListRowProps {
  href?: string | null
  external?: boolean
  icon?: ReactNode
  name: ReactNode
  meta?: ReactNode
  variants?: Parameters<typeof motion.a>[0]["variants"]
  style?: CSSProperties
  className?: string
  "aria-label"?: string
}

export function ListRow({
  href,
  external,
  icon,
  name,
  meta,
  variants,
  style,
  className,
  "aria-label": ariaLabel,
}: ListRowProps) {
  const rowClass = cn(
    "flex items-center gap-3 rounded-lg px-0 py-3 transition-[padding,background-color] motion-reduce:transition-none",
    href
      ? "hover:bg-muted/30 hover:px-3 focus-within:bg-muted/30 focus-within:px-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      : "hover:bg-muted/30 hover:px-3",
    className,
  )

  const inner = (
    <>
      {icon}
      <span className="shrink-0 text-sm font-medium text-foreground">{name}</span>
      {meta != null && (
        <span className="min-w-0 flex-1 truncate text-right text-xs text-muted-foreground">
          {meta}
        </span>
      )}
    </>
  )

  if (href) {
    return (
      <motion.a
        variants={variants}
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={rowClass}
        style={style}
        aria-label={ariaLabel}
      >
        {inner}
      </motion.a>
    )
  }

  return (
    <motion.div variants={variants} className={rowClass} style={style}>
      {inner}
    </motion.div>
  )
}
