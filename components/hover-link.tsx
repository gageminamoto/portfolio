"use client"

import { ArrowUpRight } from "lucide-react"

interface HoverLinkProps {
  href: string
  children: React.ReactNode
  external?: boolean
  showArrow?: boolean
  className?: string
}

export function HoverLink({
  href,
  children,
  external = true,
  showArrow = false,
  className = "",
}: HoverLinkProps) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`group inline-flex items-center gap-1 text-foreground underline decoration-muted-foreground/40 underline-offset-4 transition-all duration-200 hover:decoration-foreground ${className}`}
    >
      <span>{children}</span>
      {showArrow && (
        <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </a>
  )
}
