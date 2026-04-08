import { WorkHistoryAccordion } from "@/components/work-history-accordion"
import type { WorkHistoryItem } from "@/lib/portfolio-data"

export function WorkHistorySection({ items }: { items: WorkHistoryItem[] }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-sm text-muted-foreground">Work History</h2>
      <WorkHistoryAccordion items={items} />
    </section>
  )
}
