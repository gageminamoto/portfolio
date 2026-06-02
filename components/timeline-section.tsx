import { TimelineAccordion } from "@/components/timeline-accordion"
import type { TimelineItem } from "@/lib/portfolio-data"

export function TimelineSection({ items }: { items: TimelineItem[] }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-sm text-muted-foreground">Timeline</h2>
      <TimelineAccordion items={items} />
    </section>
  )
}
