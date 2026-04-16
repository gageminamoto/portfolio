"use client"

import { useState, useRef, useCallback } from "react"
import { ChevronDown } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useFinePointerHover } from "@/hooks/use-fine-pointer-hover"
import {
  fluidHoverPadStyle,
  fluidHoverTextStyle,
  fluidHoverHighlightStyle,
} from "@/lib/hover-constants"
import { NvidiaHover } from "@/components/nvidia-hover"
import type { WorkHistoryItem } from "@/lib/portfolio-data"

const hoverComponents: Record<string, React.ComponentType> = {
  nvidia: NvidiaHover,
}

export function WorkHistoryAccordion({ items }: { items: WorkHistoryItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const floaterRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const prefersFinePointer = useFinePointerHover()
  const useFluidHover = Boolean(!shouldReduceMotion && prefersFinePointer)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!floaterRef.current) return
    floaterRef.current.style.left = `${e.clientX}px`
    floaterRef.current.style.top = `${e.clientY - 160}px`
  }, [])

  const hoveredItem = hoveredIndex !== null ? items[hoveredIndex] : null
  const hasHover = hoveredItem?.hoverImage || hoveredItem?.hoverComponent
  const HoverComp = hoveredItem?.hoverComponent ? hoverComponents[hoveredItem.hoverComponent] : null

  return (
    <div
      className="relative flex flex-col"
      onMouseMove={useFluidHover ? handleMouseMove : undefined}
      onMouseLeave={useFluidHover ? () => setHoveredIndex(null) : undefined}
    >
      {useFluidHover && hasHover && (
        <div
          ref={floaterRef}
          className="pointer-events-none fixed z-50"
          style={{ width: 256, height: 144, transform: "translateX(-50%)" }}
        >
          {HoverComp ? (
            <HoverComp />
          ) : (
            <img
              src={hoveredItem!.hoverImage}
              alt=""
              className="block h-full w-full rounded-lg border border-border/50 bg-muted object-cover shadow-lg"
            />
          )}
        </div>
      )}
      {items.map((item, i) => {
        const isActive = hoveredIndex === i || openIndex === i

        return (
          <div key={item.company} className="relative">
            {useFluidHover ? (
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                onMouseEnter={() => setHoveredIndex(i)}
                onFocus={() => setHoveredIndex(i)}
                onBlur={(e) => {
                  const next = e.relatedTarget
                  const row = e.currentTarget
                  if (next && row?.contains(next)) return
                  setHoveredIndex((h) => (h === i ? null : h))
                }}
                className={cn(
                  "relative flex w-full items-center gap-3 overflow-hidden rounded-lg py-3 text-left transition-[padding] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isActive ? "px-3" : "px-0",
                )}
                style={fluidHoverPadStyle}
              >
                <div
                  className="pointer-events-none absolute inset-0 rounded-lg bg-muted/40 transition-opacity motion-reduce:transition-none"
                  style={{
                    opacity: isActive ? 1 : 0,
                    ...fluidHoverHighlightStyle,
                  }}
                  aria-hidden
                />
                <div className="relative z-10 flex min-w-0 flex-1 items-center gap-3">
                  {item.icon ? (
                    <img
                      src={item.icon}
                      alt=""
                      width={16}
                      height={16}
                      className="h-4 w-4 shrink-0 rounded-sm object-contain"
                    />
                  ) : (
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm bg-muted text-[10px] font-medium text-muted-foreground">
                      {item.company.charAt(0)}
                    </span>
                  )}
                  <span
                    className={cn(
                      "shrink-0 font-medium transition-colors",
                      isActive ? "text-foreground" : "text-muted-foreground",
                    )}
                    style={fluidHoverTextStyle}
                  >
                    {item.company}
                  </span>
                  <span
                    className={cn(
                      "min-w-0 truncate text-sm transition-colors",
                      isActive
                        ? "text-muted-foreground"
                        : "text-muted-foreground/55",
                    )}
                    style={fluidHoverTextStyle}
                  >
                    {item.role}
                  </span>
                  <span
                    className={cn(
                      "ml-auto shrink-0 text-sm transition-colors",
                      isActive
                        ? "text-muted-foreground"
                        : "text-muted-foreground/55",
                    )}
                    style={fluidHoverTextStyle}
                  >
                    {item.period}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
                      isActive
                        ? "text-muted-foreground"
                        : "text-muted-foreground/55",
                      openIndex === i && "rotate-180",
                    )}
                    style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
                    aria-hidden="true"
                  />
                </div>
              </button>
            ) : (
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="cursor-pointer flex w-full items-center gap-3 rounded-lg px-0 py-3 text-left transition-[padding,background-color] motion-reduce:transition-none hover:bg-muted/30 hover:px-3"
              >
                {item.icon ? (
                  <img
                    src={item.icon}
                    alt=""
                    width={16}
                    height={16}
                    className="h-4 w-4 shrink-0 rounded-sm object-contain"
                  />
                ) : (
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm bg-muted text-[10px] font-medium text-muted-foreground">
                    {item.company.charAt(0)}
                  </span>
                )}
                <span className="shrink-0 font-medium text-foreground">{item.company}</span>
                <span className="min-w-0 truncate text-sm text-muted-foreground">{item.role}</span>
                <span className="ml-auto shrink-0 text-sm text-muted-foreground">{item.period}</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200 ${openIndex === i ? "rotate-180" : ""}`}
                  style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
                  aria-hidden="true"
                />
              </button>
            )}
            <AnimatePresence initial={false}>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: { duration: 0.2, ease: [0.23, 1, 0.32, 1] },
                    opacity: { duration: 0.15, ease: [0.23, 1, 0.32, 1] },
                  }}
                  className="overflow-hidden"
                >
                  <div className="px-3 pt-1 pb-5">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
