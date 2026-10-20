import { createElement } from "react"

import { NvidiaHover } from "@/components/nvidia-hover"
import type { LifelineMarker } from "@/components/lifeline"
import type { TimelineItem } from "@/lib/portfolio-data"

// Custom (non-image) hover previews, keyed by TimelineItem.hoverComponent.
const hoverPreviews: Record<string, () => ReturnType<typeof createElement>> = {
  nvidia: () => createElement(NvidiaHover),
}

function hoverMedia(item: TimelineItem) {
  if (item.hoverImage) {
    return { src: item.hoverImage, alt: `${item.company} preview` }
  }
  const preview = item.hoverComponent && hoverPreviews[item.hoverComponent]
  return preview
    ? { src: "", alt: `${item.company} preview`, node: preview() }
    : undefined
}

function startYear(period: string) {
  const year = period.match(/\b\d{4}\b/)
  return year ? Number(year[0]) : Number.POSITIVE_INFINITY
}

export function createPortfolioMarkers(items: TimelineItem[]): LifelineMarker[] {
  // The numeric axis represents entries, not invented dates for undated projects.
  // Stable sorting preserves the source order for entries with the same year.
  return [...items]
    .sort((a, b) => startYear(a.period) - startYear(b.period))
    .map((item, index) => ({
      id: item.company,
      year: index,
      age: String(index + 1).padStart(2, "0"),
      label: item.period,
      badges: item.icon ? [{ src: item.icon, alt: `${item.company} logo` }] : undefined,
      events: [
        item.url
          ? [{ type: "link", value: item.company, href: item.url }]
          : item.company,
        item.role,
        {
          text: item.description,
          image: hoverMedia(item),
        },
      ],
    }))
}
