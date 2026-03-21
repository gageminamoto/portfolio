"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTheme } from "next-themes"
import type { WorkHistoryItem } from "@/lib/portfolio-data"

// Each entry: [hue, chroma] from the oklch palette
const TAB_HUES: [number, number][] = [
  [290, 0.15],  // purple  — Freelance
  [250, 0.14],  // blue    — Becoming Impossible to Ignore
  [130, 0.20],  // NVIDIA lime green — NVIDIA
  [165, 0.15],  // UH deep green — UH Esports
  [255, 0.15],  // indigo blue — Umi
  [85, 0.12],   // tan gold — Gen.G
  [210, 0.14],  // sky blue — Servco
  [340, 0.17],  // pink
  [95, 0.15],   // yellow
]

function tabStyles(i: number, isActive: boolean, isDark: boolean) {
  const [hue, chroma] = TAB_HUES[i % TAB_HUES.length]
  if (isDark) {
    if (isActive) {
      return {
        backgroundColor: `oklch(0.28 ${chroma * 0.25} ${hue})`,
        color: `oklch(0.85 ${chroma * 0.4} ${hue})`,
        borderColor: `oklch(0.35 ${chroma * 0.15} ${hue})`,
      }
    }
    return {
      backgroundColor: "transparent",
      color: `oklch(0.6 ${chroma * 0.2} ${hue})`,
      borderColor: `oklch(0.25 ${chroma * 0.08} ${hue})`,
    }
  }
  // Light mode
  if (isActive) {
    return {
      backgroundColor: `oklch(0.95 ${chroma * 0.15} ${hue})`,
      color: `oklch(0.4 ${chroma * 0.5} ${hue})`,
      borderColor: `oklch(0.88 ${chroma * 0.12} ${hue})`,
    }
  }
  return {
    backgroundColor: "transparent",
    color: `oklch(0.55 ${chroma * 0.25} ${hue})`,
    borderColor: `oklch(0.85 ${chroma * 0.06} ${hue})`,
  }
}

function panelStyles(i: number, isDark: boolean) {
  const [hue, chroma] = TAB_HUES[i % TAB_HUES.length]
  if (isDark) {
    return {
      backgroundColor: `oklch(0.28 ${chroma * 0.25} ${hue})`,
      borderColor: `oklch(0.35 ${chroma * 0.15} ${hue})`,
      titleColor: `oklch(0.88 ${chroma * 0.35} ${hue})`,
      mutedColor: `oklch(0.65 ${chroma * 0.2} ${hue})`,
      bodyColor: `oklch(0.72 ${chroma * 0.15} ${hue})`,
    }
  }
  // Light mode
  return {
    backgroundColor: `oklch(0.95 ${chroma * 0.15} ${hue})`,
    borderColor: `oklch(0.88 ${chroma * 0.12} ${hue})`,
    titleColor: `oklch(0.3 ${chroma * 0.45} ${hue})`,
    mutedColor: `oklch(0.5 ${chroma * 0.2} ${hue})`,
    bodyColor: `oklch(0.4 ${chroma * 0.15} ${hue})`,
  }
}

export function WorkHistoryFolderTabs({ items }: { items: WorkHistoryItem[] }) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
  }, [])

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener("scroll", checkScroll, { passive: true })
    window.addEventListener("resize", checkScroll)
    return () => {
      el.removeEventListener("scroll", checkScroll)
      window.removeEventListener("resize", checkScroll)
    }
  }, [checkScroll])

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -120 : 120,
      behavior: "smooth",
    })
  }

  const panel = panelStyles(activeIndex, isDark)

  return (
    <div className="flex flex-col">
      {/* Tab bar */}
      <div className="relative mb-[-1px] flex items-end">
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="cursor-pointer absolute left-0 bottom-[1px] z-20 flex h-[calc(100%-1px)] items-center bg-gradient-to-r from-background via-background/80 to-transparent pr-3 pl-0.5 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Scroll tabs left"
          >
            <ChevronLeft className="h-3 w-3" />
          </button>
        )}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
        >
          {items.map((item, i) => {
            const isActive = activeIndex === i
            const styles = tabStyles(i, isActive, isDark)
            return (
              <button
                key={item.company}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveIndex(i)}
                className={`cursor-pointer relative shrink-0 whitespace-nowrap rounded-t-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-100 ease-out ${
                  isActive ? "z-10" : "z-0 hover:opacity-90"
                }`}
                style={styles}
              >
                <span className="flex items-center gap-1.5">
                  {item.icon ? (
                    <img
                      src={item.icon}
                      alt=""
                      width={12}
                      height={12}
                      className="h-3 w-3 shrink-0 rounded-sm object-contain"
                    />
                  ) : (
                    <span className="flex h-3 w-3 shrink-0 items-center justify-center rounded-sm bg-current/10 text-[8px] font-medium opacity-60">
                      {item.company.charAt(0)}
                    </span>
                  )}
                  {item.company}
                </span>
              </button>
            )
          })}
        </div>
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="cursor-pointer absolute right-0 bottom-[1px] z-20 flex h-[calc(100%-1px)] items-center bg-gradient-to-l from-background via-background/80 to-transparent pr-0.5 pl-3 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Scroll tabs right"
          >
            <ChevronRight className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Content panel */}
      <div
        className="rounded-b-lg rounded-tr-lg p-4 transition-colors duration-100"
        style={{
          backgroundColor: panel.backgroundColor,
        }}
      >
        {/* Grid stacks all items in the same cell so the tallest sets the height */}
        <div className="grid">
          {items.map((item, i) => {
            const isActive = activeIndex === i
            const p = panelStyles(i, isDark)
            return (
              <div
                key={item.company}
                className="col-start-1 row-start-1 transition-all duration-100 ease-out"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? "translateY(0)" : "translateY(3px)",
                  pointerEvents: isActive ? "auto" : "none",
                }}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    {item.icon ? (
                      <img
                        src={item.icon}
                        alt=""
                        width={16}
                        height={16}
                        className="h-4 w-4 shrink-0 rounded-sm object-contain"
                      />
                    ) : (
                      <span
                        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm text-[10px] font-medium"
                        style={{ backgroundColor: `oklch(0 0 0 / 0.1)`, color: p.mutedColor }}
                      >
                        {item.company.charAt(0)}
                      </span>
                    )}
                    <span className="font-medium" style={{ color: p.titleColor }}>
                      {item.company}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm" style={{ color: p.mutedColor }}>
                    <span>{item.role}</span>
                    <span style={{ opacity: 0.4 }}>·</span>
                    <span>{item.period}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: p.bodyColor }}>
                    {item.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
