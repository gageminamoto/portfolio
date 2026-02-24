"use client"

import { useState } from "react"
import { LayoutOne } from "@/components/layouts/layout-one"
import { LayoutFour } from "@/components/layouts/layout-four"

const layouts = [
  { id: "1", label: "I", component: LayoutOne },
  { id: "2", label: "II", component: LayoutFour },
] as const

export function LayoutSwitcher() {
  const [activeLayout, setActiveLayout] = useState("1")

  const ActiveComponent =
    layouts.find((l) => l.id === activeLayout)?.component ?? LayoutOne

  return (
    <>
      {/* Floating switcher */}
      <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
        <div className="flex items-center gap-1 rounded-full border border-border bg-card/80 px-1.5 py-1.5 shadow-lg backdrop-blur-md">
          {layouts.map((layout) => (
            <button
              key={layout.id}
              onClick={() => setActiveLayout(layout.id)}
              className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-xs font-medium transition-[background-color,color] duration-150 ease-out ${
                activeLayout === layout.id
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label={`Switch to layout ${layout.label}`}
              aria-pressed={activeLayout === layout.id}
            >
              {layout.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active layout */}
      <ActiveComponent />
    </>
  )
}
