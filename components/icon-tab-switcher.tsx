"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion"
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
const PILL_PAD = 4 // px of breathing room on each side of the clip

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
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

  // Track the container width so we can compute inset-right as (container - (left + width))
  const [containerW, setContainerW] = useState(0)
  const [rects, setRects] = useState<Map<string, TabRect>>(new Map())

  const measure = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const cRect = container.getBoundingClientRect()
    setContainerW(cRect.width)
    const next = new Map<string, TabRect>()
    tabRefs.current.forEach((el, id) => {
      const r = el.getBoundingClientRect()
      next.set(id, { left: r.left - cRect.left, width: r.width })
    })
    setRects(next)
  }, [])

  useEffect(() => {
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [measure])

  // Remeasure when activeTab changes (overlay labels change widths)
  useEffect(() => {
    // Small raf to let the DOM settle after the overlay re-renders
    const id = requestAnimationFrame(measure)
    return () => cancelAnimationFrame(id)
  }, [activeTab, measure])

  const activeRect = rects.get(activeTab)

  // Animated inset values: inset(top right bottom left round radius)
  const clipLeft = useSpring(activeRect ? activeRect.left - PILL_PAD : 0, SPRING)
  const clipRight = useSpring(
    activeRect ? containerW - (activeRect.left + activeRect.width) - PILL_PAD : 0,
    SPRING,
  )

  // Whenever the active tab changes, push new targets
  useEffect(() => {
    if (!activeRect) return
    clipLeft.set(activeRect.left - PILL_PAD)
    clipRight.set(containerW - (activeRect.left + activeRect.width) - PILL_PAD)
  }, [activeRect, containerW, clipLeft, clipRight])

  const clipPath = useTransform(
    [clipLeft, clipRight],
    ([l, r]: number[]) =>
      `inset(-2px ${Math.max(0, r)}px -2px ${Math.max(0, l)}px round 9999px)`,
  )

  const setTabRef = (id: string) => (el: HTMLButtonElement | null) => {
    if (el) tabRefs.current.set(id, el)
    else tabRefs.current.delete(id)
  }

  // Base tab: icon only, muted color, handles clicks and measurement
  const renderBaseTab = (tab: IconTab) => (
    <button
      key={tab.id}
      ref={setTabRef(tab.id)}
      onClick={() => onTabChange(tab.id)}
      className="flex cursor-pointer items-center gap-2 rounded-full border-0 bg-transparent px-3 py-2.5 text-sm font-medium text-muted-foreground outline-none whitespace-nowrap"
      aria-pressed={activeTab === tab.id}
      aria-label={tab.label}
    >
      <Icon icon={tab.icon} className="h-5 w-5 shrink-0" />
    </button>
  )

  // Overlay tab: icon + label for active, icon-only for inactive
  // Each tab is absolutely positioned at its measured base rect
  const renderOverlayTab = (tab: IconTab) => {
    const isActive = activeTab === tab.id
    const rect = rects.get(tab.id)
    if (!rect) return null
    return (
      <button
        key={tab.id}
        className="absolute top-0 flex h-full cursor-pointer items-center gap-2 border-0 bg-transparent px-3 text-sm font-medium text-foreground outline-none whitespace-nowrap"
        style={{ left: rect.left, width: isActive ? "auto" : rect.width }}
        tabIndex={-1}
        aria-hidden="true"
      >
        <Icon icon={tab.icon} className="h-5 w-5 shrink-0" />
        {isActive && <span>{tab.label}</span>}
      </button>
    )
  }

  return (
    <div ref={containerRef} className="relative inline-flex">
      {/* Base layer: icon-only tabs, muted */}
      <div className="flex items-center gap-1">
        {tabs.map(renderBaseTab)}
      </div>

      {/* Overlay layer: clipped to active pill with accent background */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-accent"
        style={{ clipPath, borderRadius: "9999px" }}
        aria-hidden="true"
      >
        {tabs.map(renderOverlayTab)}
      </motion.div>
    </div>
  )
}
