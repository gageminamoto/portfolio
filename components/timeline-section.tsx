import type { ReactNode } from "react"
import { TimelineAccordion } from "@/components/timeline-accordion"
import type { TimelineItem } from "@/lib/portfolio-data"

export function TimelineSection({
  items,
  icon,
}: {
  items: TimelineItem[]
  icon?: ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="flex items-center gap-1.5 text-sm text-muted-foreground">
        {icon}
        Timeline
      </h2>
      <TimelineAccordion items={items} />
    </section>
  )
}
