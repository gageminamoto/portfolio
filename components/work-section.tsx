"use client"

import { type CSSProperties, useEffect, useLayoutEffect, useRef, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { useWorkHover, workItemElementId } from "@/components/work-hover-context"

interface WorkItem {
  name: string
  url: string
  image: string
  type: string
}

const workItems: WorkItem[] = [
  { name: "Mizen", url: "https://www.mizen.recipes/", image: "/images/mizen-hover.gif", type: "Product" },
  { name: "Aura", url: "https://aurafinance.io", image: "/images/aura-hover.gif", type: "Product" },
  { name: "Kilo", url: "https://kilohnl.com/", image: "/images/kilo-hover.jpg", type: "Brand" },
  { name: "Umi", url: "https://umiapp.co/", image: "/images/umi-hover.gif", type: "Product" },
  { name: "Piʻiku", url: "https://piiku.co/", image: "/images/piiku-hover.gif", type: "Brand" },
  { name: "Spero", url: "https://spero.vc/", image: "/images/spero-hover.gif", type: "Web" },
  { name: "MemberSpace", url: "https://www.memberspace.com/", image: "/images/memberspace-hover.gif", type: "Brand" },
  { name: "Servco", url: "https://www.servco.com/", image: "/images/servco-hover.gif", type: "Brand" },
]

function HoverPlayMedia({ src, alt, active }: { src: string; alt: string; active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext("2d")
      ctx?.drawImage(img, 0, 0)
    }
    img.src = src
  }, [src])

  return (
    <div className="relative aspect-video w-full overflow-hidden">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`absolute inset-0 z-10 h-full w-full object-cover object-center transition-opacity duration-150 ${
          active ? "opacity-0" : "opacity-100"
        }`}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="eager"
        decoding="async"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
    </div>
  )
}

function WorkItemCard({ item }: { item: WorkItem }) {
  const [localHover, setLocalHover] = useState(false)
  const { hoveredWorkId } = useWorkHover()

  const remoteHover = hoveredWorkId === item.name
  const active = localHover || remoteHover

  return (
    <a
      id={workItemElementId(item.name)}
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setLocalHover(true)}
      onMouseLeave={() => setLocalHover(false)}
      onFocus={() => setLocalHover(true)}
      onBlur={() => setLocalHover(false)}
      className="block scroll-mt-8 focus-visible:outline-none"
      aria-label={item.name}
    >
      <div
        className={`overflow-hidden rounded-xl border bg-card transition-[transform,border-color,box-shadow] duration-150 ease-out group-focus-visible:ring-2 group-focus-visible:ring-ring ${
          active
            ? "-translate-y-px border-border shadow-sm"
            : "border-border/50"
        }`}
      >
        <HoverPlayMedia src={item.image} alt={item.name} active={active} />
      </div>
      <div className="mt-2 flex items-baseline gap-1.5 text-sm">
        <span className="text-muted-foreground">{item.name}</span>
        <span className="text-muted-foreground/40">{item.type}</span>
      </div>
    </a>
  )
}

export const WORK_FILTERS = ["Product", "Brand", "Web"] as const
export type WorkFilter = (typeof WORK_FILTERS)[number] | null

export function WorkFilterTabs({ active, onChange }: { active: WorkFilter; onChange: (f: WorkFilter) => void }) {
  return (
    <div className="flex flex-wrap justify-end gap-x-3 gap-y-1">
      {WORK_FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => onChange(active === f ? null : f)}
          className={`cursor-pointer text-xs transition-colors duration-150 ease sm:text-sm ${
            active === f
              ? "text-foreground"
              : "text-muted-foreground/40 hover:text-muted-foreground"
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  )
}

function WorkBleedCarousel({ items, filterKey }: { items: WorkItem[]; filterKey: string }) {
  const shouldReduceMotion = useReducedMotion()
  const railRef = useRef<HTMLDivElement>(null)
  const [bleedMetrics, setBleedMetrics] = useState({ left: 0, right: 0, width: 0 })
  const railStyle = {
    "--work-start-inset": `${bleedMetrics.left}px`,
    "--work-end-inset": `${bleedMetrics.right}px`,
    "--work-viewport-width": bleedMetrics.width ? `${bleedMetrics.width}px` : "100%",
  } as CSSProperties

  useLayoutEffect(() => {
    const rail = railRef.current
    const parent = rail?.parentElement
    if (!parent) return

    const updateInset = () => {
      const rect = parent.getBoundingClientRect()
      const viewportWidth = window.visualViewport?.width ?? window.innerWidth

      setBleedMetrics({
        left: Math.max(0, Math.round(rect.left)),
        right: Math.max(0, Math.round(viewportWidth - rect.right)),
        width: Math.round(viewportWidth),
      })
    }

    updateInset()
    window.addEventListener("resize", updateInset)
    window.visualViewport?.addEventListener("resize", updateInset)
    window.visualViewport?.addEventListener("scroll", updateInset)

    return () => {
      window.removeEventListener("resize", updateInset)
      window.visualViewport?.removeEventListener("resize", updateInset)
      window.visualViewport?.removeEventListener("scroll", updateInset)
    }
  }, [])

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    requestAnimationFrame(() => {
      rail.scrollLeft = 0
    })
  }, [filterKey])

  return (
    <div
      className="-ml-[var(--work-start-inset)] w-[var(--work-viewport-width)] max-w-[100vw] overflow-x-clip overflow-y-visible"
      style={railStyle}
    >
      <AnimatePresence mode="wait">
        <motion.div
          ref={railRef}
          key={filterKey}
          className="-mt-2 flex w-full snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-pl-[var(--work-start-inset)] scroll-pr-[var(--work-end-inset)] pb-1 pl-[var(--work-start-inset)] pr-[var(--work-end-inset)] pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -4 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.15, ease: [0.215, 0.61, 0.355, 1] }}
        >
          {items.map((item, index) => (
            <div
              key={item.name}
              className={`shrink-0 ${index === items.length - 1 ? "snap-end" : "snap-start"}`}
              style={{ width: "min(82vw, 36rem)" }}
            >
              <WorkItemCard item={item} />
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export function WorkSection({ filter }: { filter: WorkFilter }) {
  const filtered = filter === null
    ? workItems
    : workItems.filter((item) => item.type === filter)

  return <WorkBleedCarousel filterKey={filter ?? "all"} items={filtered} />
}
