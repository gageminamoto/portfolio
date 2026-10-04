"use client"

import { cn } from "@/lib/utils"
import type { EarlyDesignView } from "@/lib/early-design-resources"

type ViewSwitchProps = {
  view: EarlyDesignView
  onChange: (view: EarlyDesignView) => void
  className?: string
}

const options: { value: EarlyDesignView; label: string }[] = [
  { value: "a", label: "Portfolio" },
  { value: "b", label: "Index" },
]

export function ViewSwitch({ view, onChange, className }: ViewSwitchProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
    event.preventDefault()
    const index = options.findIndex((opt) => opt.value === view)
    const delta = event.key === "ArrowRight" ? 1 : -1
    const next = options[(index + delta + options.length) % options.length]
    onChange(next.value)
    document.getElementById(`early-design-tab-${next.value}`)?.focus()
  }

  return (
    <div
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-0.5 rounded-full border border-border/70 bg-background p-0.5",
        className,
      )}
      role="tablist"
      aria-label="Layout"
      onKeyDown={handleKeyDown}
    >
      {options.map((opt) => {
        const selected = view === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            id={`early-design-tab-${opt.value}`}
            aria-selected={selected}
            aria-controls={selected ? `early-design-panel-${opt.value}` : undefined}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(opt.value)}
            className={cn(
              "cursor-pointer rounded-full px-2.5 py-1 text-xs font-medium transition-colors duration-150 ease-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              selected
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
