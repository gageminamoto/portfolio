"use client"

import { useMemo, type ReactNode } from "react"
import { Lifeline } from "@/components/lifeline"
import { createPortfolioMarkers } from "@/lib/portfolio-lifeline"
import type { TimelineItem } from "@/lib/portfolio-data"

export function TimelineSection({
  items,
  icon,
}: {
  items: TimelineItem[]
  icon?: ReactNode
}) {
  const markers = useMemo(() => createPortfolioMarkers(items), [items])

  return (
    <section aria-labelledby="timeline-heading" className="flex min-w-0 flex-col gap-4">
      <h2 id="timeline-heading" className="flex items-center gap-1.5 text-sm text-muted-foreground">
        {icon}
        Timeline
      </h2>
      <p id="timeline-instructions" className="text-xs text-muted-foreground">
        <span className="hidden md:inline">Scroll or drag to explore. Use arrow keys when the timeline is focused.</span>
        <span className="md:hidden">Scroll through the timeline. Tap a preview icon to see the work.</span>
      </p>
      <div
        aria-describedby="timeline-instructions"
        className="h-[560px] min-w-0 md:relative md:left-1/2 md:w-[min(64rem,calc(100vw-3rem))] md:-translate-x-1/2"
      >
        <Lifeline
          markers={markers}
          birthYear={0}
          title="Work and projects timeline"
          mode="embed"
          axisLabels={["Entry", "Period"]}
        />
      </div>
    </section>
  )
}
