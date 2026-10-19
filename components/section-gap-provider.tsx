"use client"

import type { CSSProperties, ReactNode } from "react"
import { useSectionGap } from "@/hooks/use-section-gap"

export function SectionGapProvider({ children }: { children: ReactNode }) {
  const { gap } = useSectionGap()

  return (
    <div
      className="contents"
      style={{ "--page-section-gap": `${gap}px` } as CSSProperties}
    >
      {children}
    </div>
  )
}
