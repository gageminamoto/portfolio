"use client"

import { motion } from "framer-motion"
import type { CSSProperties, FocusEvent, ReactNode } from "react"
import { cn } from "@/lib/utils"

export type ListRowFluidHover = {
  emphasized: boolean
  highlighted: boolean
  padTransitionStyle?: CSSProperties
  textTransitionStyle?: CSSProperties
  highlightFadeStyle?: CSSProperties
  onMouseEnter?: () => void
  onFocus?: () => void
  onBlur?: (e: FocusEvent<HTMLElement>) => void
}

interface ListRowProps {
  href?: string | null
  external?: boolean
  rel?: string
  icon?: ReactNode
  name: ReactNode
  meta?: ReactNode
  variants?: Parameters<typeof motion.a>[0]["variants"]
  style?: CSSProperties
  className?: string
  fluidHover?: ListRowFluidHover
  "aria-label"?: string
  "aria-describedby"?: string
}

export function ListRow({
  href,
  external,
  rel,
  icon,
  name,
  meta,
  variants,
  style,
  className,
  fluidHover,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
}: ListRowProps) {
  const rowClass = fluidHover
    ? cn(
        "relative flex w-full items-center gap-3 overflow-hidden rounded-lg py-3 transition-[padding]",
        fluidHover.highlighted ? "px-3" : "px-0",
        href &&
          "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )
    : cn(
        "flex items-center gap-3 rounded-lg px-0 py-3 transition-[padding,background-color] motion-reduce:transition-none",
        href
          ? "hover:bg-muted hover:px-3 focus-within:bg-muted focus-within:px-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          : "hover:bg-muted hover:px-3",
        className,
      )

  const rowStyle = fluidHover
    ? { ...fluidHover.padTransitionStyle, ...style }
    : style

  const rowHandlers = fluidHover
    ? {
        onMouseEnter: fluidHover.onMouseEnter,
        onFocus: fluidHover.onFocus,
        onBlur: fluidHover.onBlur,
      }
    : undefined

  const inner = fluidHover ? (
    <>
      <div
        className="pointer-events-none absolute inset-0 rounded-lg bg-muted/40 transition-opacity motion-reduce:transition-none"
        style={{
          opacity: fluidHover.highlighted ? 1 : 0,
          ...fluidHover.highlightFadeStyle,
        }}
        aria-hidden
      />
      <div className="relative z-10 flex min-w-0 flex-1 items-center gap-3">
        {icon}
        <span
          className={cn(
            "min-w-0 shrink truncate text-sm font-medium transition-colors",
            fluidHover.emphasized ? "text-foreground" : "text-muted-foreground",
          )}
          style={fluidHover.textTransitionStyle}
        >
          {name}
        </span>
        {meta != null && (
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-right text-xs transition-colors",
              fluidHover.emphasized
                ? "text-muted-foreground"
                : "text-muted-foreground/55",
            )}
            style={fluidHover.textTransitionStyle}
          >
            {meta}
          </span>
        )}
      </div>
    </>
  ) : (
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
    if (variants) {
      return (
        <motion.a
          variants={variants}
          href={href}
          {...(external
            ? { target: "_blank", rel: rel ?? "noopener noreferrer" }
            : {})}
          className={rowClass}
          style={rowStyle}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          {...rowHandlers}
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
        style={rowStyle}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        {...rowHandlers}
      >
        {inner}
      </a>
    )
  }

  if (variants) {
    return (
      <motion.div
        variants={variants}
        className={rowClass}
        style={rowStyle}
        {...rowHandlers}
      >
        {inner}
      </motion.div>
    )
  }

  return (
    <div className={rowClass} style={rowStyle} {...rowHandlers}>
      {inner}
    </div>
  )
}
