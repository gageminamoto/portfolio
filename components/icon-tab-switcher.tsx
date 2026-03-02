"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { motion, useSpring, useTransform } from "framer-motion"
import { Icon } from "@iconify/react"

export interface IconTab {
  id: string
  label: string
  icon: string
}

interface TabRect {
  left: number
  width: number
}

const SPRING = { stiffness: 200, damping: 24, mass: 0.8 }
const PILL_PAD = 4

export function IconTabSwitcher({
  tabs,
  activeTab,
  onTabChange,
}: {
  tabs: IconTab[]
  activeTab: string
  onTabChange: (id: string) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const baseTabRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const overlayActiveRef = useRef<HTMLDivElement>(null)

  const [containerW, setContainerW] = useState(0)
  const [baseRects, setBaseRects] = useState<Map<string, TabRect>>(new Map())
  const [activeOverlayW, setActiveOverlayW] = useState(0)

  const measure = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const cRect = container.getBoundingClientRect()
    setContainerW(cRect.width)

    // Measure base icon-only tabs
    const next = new Map<string, TabRect>()
    baseTabRefs.current.forEach((el, id) => {
      const r = el.getBoundingClientRect()
      next.set(id, { left: r.left - cRect.left, width: r.width })
    })
    setBaseRects(next)

    // Measure overlay active tab (icon + label)
    if (overlayActiveRef.current) {
      setActiveOverlayW(overlayActiveRef.current.getBoundingClientRect().width)
    }
  }, [])

  useEffect(() => {
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [measure])

  // Remeasure after activeTab changes so the overlay label renders and is measured
  useEffect(() => {
    const id = requestAnimationFrame(measure)
    return () => cancelAnimationFrame(id)
  }, [activeTab, measure])

  const activeBaseRect = baseRects.get(activeTab)

  // Clip left edge = active base tab's left
  // Clip right edge = active base tab's left + overlay active width (icon+label)
  const clipLeft = useSpring(activeBaseRect ? activeBaseRect.left - PILL_PAD : 0, SPRING)
  const clipRight = useSpring(
    activeBaseRect && activeOverlayW
      ? containerW - (activeBaseRect.left + activeOverlayW) - PILL_PAD
      : 0,
    SPRING,
  )

  useEffect(() => {
    if (!activeBaseRect) return
    clipLeft.set(activeBaseRect.left - PILL_PAD)
    clipRight.set(
      containerW - (activeBaseRect.left + (activeOverlayW || activeBaseRect.width)) - PILL_PAD,
    )
  }, [activeBaseRect, activeOverlayW, containerW, clipLeft, clipRight])

  const clipPath = useTransform(
    [clipLeft, clipRight],
    ([l, r]: number[]) =>
      `inset(-2px ${Math.max(0, r)}px -2px ${Math.max(0, l)}px round 9999px)`,
  )

  const setBaseRef = (id: string) => (el: HTMLButtonElement | null) => {
    if (el) baseTabRefs.current.set(id, el)
    else baseTabRefs.current.delete(id)
  }

  return (
    <div ref={containerRef} className="relative inline-flex">
      {/* Base layer: icon-only tabs, muted */}
      <div className="flex items-center gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            ref={setBaseRef(tab.id)}
            onClick={() => onTabChange(tab.id)}
            className="flex cursor-pointer items-center rounded-full border-0 bg-transparent px-3 py-2.5 text-sm font-medium text-muted-foreground outline-none"
            aria-pressed={activeTab === tab.id}
            aria-label={tab.label}
          >
            <Icon icon={tab.icon} className="h-5 w-5" />
          </button>
        ))}
      </div>

      {/* Overlay layer: clipped to reveal active pill */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-accent"
        style={{ clipPath, borderRadius: "9999px" }}
        aria-hidden="true"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const rect = baseRects.get(tab.id)
          if (!rect) return null
          return (
            <div
              key={tab.id}
              ref={isActive ? overlayActiveRef : undefined}
              className="absolute top-0 flex h-full items-center gap-2 px-3 text-sm font-medium text-foreground whitespace-nowrap"
              style={{ left: rect.left }}
            >
              <Icon icon={tab.icon} className="h-5 w-5 shrink-0" />
              {isActive && <span>{tab.label}</span>}
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}
