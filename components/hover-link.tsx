"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { useWorkHover, workItemElementId } from "@/components/work-hover-context"

interface HoverLinkProps {
  href: string
  children: React.ReactNode
  external?: boolean
  showArrow?: boolean
  previewImage?: string
  syncWorkId?: string
  className?: string
}

export function HoverLink({
  href,
  children,
  external = true,
  showArrow = false,
  previewImage,
  syncWorkId,
  className = "",
}: HoverLinkProps) {
  const { setHoveredWorkId } = useWorkHover()
  const linkClassName = `group inline-flex items-center gap-1 text-foreground underline decoration-dashed decoration-2 decoration-muted-foreground/40 underline-offset-4 transition-[color,text-decoration-color] duration-150 ease-out hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm ${className}`

  const handleSyncClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!syncWorkId) return
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    const target = document.getElementById(workItemElementId(syncWorkId))
    if (!target) return
    e.preventDefault()
    target.scrollIntoView({ block: "start", behavior: "smooth" })
  }

  const syncHandlers = syncWorkId
    ? {
        onMouseEnter: () => setHoveredWorkId(syncWorkId),
        onMouseLeave: () => setHoveredWorkId(null),
        onFocus: () => setHoveredWorkId(syncWorkId),
        onBlur: () => setHoveredWorkId(null),
        onClick: handleSyncClick,
      }
    : {}

  const inner = (
    <>
      <span>{children}</span>
      {showArrow && (
        <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-[opacity,transform] duration-150 ease-out group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </>
  )

  const wrapWithPreview = (link: React.ReactNode) => {
    if (!previewImage || syncWorkId) return link
    return (
      <span className="group/preview relative inline-block">
        {link}
        <span
          className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden -translate-x-1/2 scale-95 opacity-0 transition-[transform,opacity] duration-200 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] origin-bottom group-hover/preview:scale-100 group-hover/preview:opacity-100 sm:block"
          style={{ width: 256, height: 144 }}
        >
          <img
            src={previewImage}
            alt=""
            className="block h-full w-full rounded-lg border border-border/50 bg-muted object-cover object-center shadow-lg"
          />
        </span>
      </span>
    )
  }

  if (external) {
    return wrapWithPreview(
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClassName}
        {...syncHandlers}
      >
        {inner}
      </a>
    )
  }

  return wrapWithPreview(
    <Link href={href} className={linkClassName} {...syncHandlers}>
      {inner}
    </Link>
  )
}
