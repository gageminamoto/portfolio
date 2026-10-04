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
  { value: "b", label: "Editorial" },
]

export function ViewSwitch({ view, onChange, className }: ViewSwitchProps) {
  return (
    <div
      className={cn("inline-flex w-fit rounded-full border border-border/60 bg-background p-0.5", className)}
      role="tablist"
      aria-label="Layout"
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
              aria-controls={`early-design-panel-${opt.value}`}
              onClick={() => onChange(opt.value)}
              className={cn(
                "cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-150 ease motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                selected
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted/50",
              )}
            >
              {opt.label}
            </button>
          )
        })}
    </div>
  )
}
