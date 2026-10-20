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
      <div
        className="h-[560px] min-w-0 md:-ml-6 md:h-auto md:w-[calc(50vw+50%)]"
      >
        <Lifeline
          markers={markers}
          birthYear={0}
          title="Work and projects timeline"
          mode="embed"
          className="md:h-auto md:pt-0"
          axisLabels={["Entry", "Period"]}
          showSecondaryAxis={false}
        />
      </div>
    </section>
  )
}
