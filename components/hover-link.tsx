"use client"

import Link from "next/link"
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
  const linkClassName = `group inline-flex items-center gap-1 text-foreground underline decoration-muted-foreground/40 underline-offset-4 transition-[color,text-decoration-color] duration-150 ease-out hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm ${className}`

  const inner = (
    <>
      <span>{children}</span>
      {showArrow && (
        <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-[opacity,transform] duration-150 ease-out group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </>
  )

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClassName}
      >
        {inner}
      </a>
    )
  }

  return (
    <Link href={href} className={linkClassName}>
      {inner}
    </Link>
  )
}
