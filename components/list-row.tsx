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
    "flex items-center gap-3 rounded-xl px-0 py-2.5 transition-[padding,background-color,box-shadow] motion-reduce:transition-none",
    href
      ? "hover:bg-background/70 hover:px-3 hover:shadow-sm focus-within:bg-background/70 focus-within:px-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      : "hover:bg-background/70 hover:px-3",
    className,
  )

  const inner = (
    <>
      {icon}
      <span className="shrink-0 text-sm font-semibold tracking-[-0.02em] text-foreground">{name}</span>
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
