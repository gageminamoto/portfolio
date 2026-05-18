"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { useWorkHover, workItemElementId } from "@/components/work-hover-context"

interface WorkItem {
  name: string
  url: string
  image: string
  type: string
}

const workItems: WorkItem[] = [
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
        className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-150 ${
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
        className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-150 ${
          active ? "opacity-100" : "opacity-0"
        }`}
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
      className="group block scroll-mt-8 focus-visible:outline-none"
      aria-label={item.name}
    >
      <div
        className={`overflow-hidden rounded-[1.25rem] border bg-card/80 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition-[transform,border-color,box-shadow] duration-150 ease-out group-focus-visible:ring-2 group-focus-visible:ring-ring ${
          active
            ? "-translate-y-px border-[color:var(--prototype-accent)] shadow-[0_18px_48px_rgba(15,23,42,0.1)]"
            : "border-border/60"
        }`}
      >
        <HoverPlayMedia src={item.image} alt={item.name} active={active} />
      </div>
      <div className="mt-2.5 flex items-baseline justify-between gap-3 px-1 text-sm">
        <span className="font-semibold tracking-[-0.02em] text-foreground">{item.name}</span>
        <span className="rounded-full bg-[var(--prototype-accent-soft)] px-2 py-0.5 text-[11px] font-medium text-[var(--prototype-accent)]">{item.type}</span>
      </div>
    </a>
  )
}

export const WORK_FILTERS = ["Product", "Brand", "Web"] as const
export type WorkFilter = (typeof WORK_FILTERS)[number] | null

export function WorkFilterTabs({ active, onChange }: { active: WorkFilter; onChange: (f: WorkFilter) => void }) {
  return (
    <div className="flex gap-1 rounded-full border border-border/60 bg-background/60 p-1 shadow-sm">
      {WORK_FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => onChange(active === f ? null : f)}
          className={`cursor-pointer rounded-full px-2.5 py-1 text-xs font-medium transition-[background-color,color,box-shadow] duration-150 ease ${
            active === f
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground/60 hover:text-muted-foreground"
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  )
}

export function WorkSection({ filter }: { filter: WorkFilter }) {
  const shouldReduceMotion = useReducedMotion()
  const filtered = filter === null
    ? workItems
    : workItems.filter((item) => item.type === filter)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={filter ?? "all"}
        className="flex flex-col gap-5"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -4 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.15, ease: [0.215, 0.61, 0.355, 1] }}
      >
        {filtered.map((item) => (
          <WorkItemCard key={item.name} item={item} />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
