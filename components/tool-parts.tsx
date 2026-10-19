"use client"

import { useState } from "react"
import { OptimizedImage } from "@/components/optimized-image"
import { faviconHostname } from "@/lib/affiliate-links"

/** Shared pieces of a tool row, used by the tools page and the homepage list. */

export function AffiliateLabel() {
  return (
    <span className="shrink-0 text-[10px] font-medium tracking-wide text-muted-foreground/50">
      Affiliate
    </span>
  )
}

export function toolAriaLabel(
  displayName: string,
  description: string,
  affiliate: boolean,
): string {
  const base = `${displayName} — ${description}`
  return affiliate ? `${base} (affiliate)` : base
}

export function ToolIcon({ name, url }: { name: string; url: string | null }) {
  const initials = name.slice(0, 2)
  const [failed, setFailed] = useState(false)
  const hostname = url ? faviconHostname(url) : null

  if (hostname && !failed) {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
        <OptimizedImage
          src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`}
          alt=""
          width={20}
          height={20}
          className="size-5 rounded-sm bg-transparent"
          imageClassName="size-full rounded-sm object-contain"
          onError={() => setFailed(true)}
        />
      </div>
    )
  }

  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
      <span className="font-mono text-[11px] font-semibold text-muted-foreground">
        {initials}
      </span>
    </div>
  )
}
