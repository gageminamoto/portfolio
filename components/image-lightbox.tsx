"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

export interface LightboxRect {
  top: number
  left: number
  width: number
  height: number
}

export interface LightboxItem {
  src: string
  alt: string
  url?: string
  aspectRatio?: string // e.g. "16/9", "5/4", "1/1"
}

interface ImageLightboxProps {
  items: LightboxItem[]
  activeIndex: number
  rect: LightboxRect
  borderRadius: number
  onClose: () => void
}

const PADDING = 40

const ease = [0.23, 1, 0.32, 1] as const

/** Parse "w/h" string into a numeric ratio, defaulting to 1. */
function parseAspectRatio(ar?: string): number {
  if (!ar) return 1
  const [w, h] = ar.split("/").map(Number)
  return w && h ? w / h : 1
}

/** Compute the largest width/height that fits in the viewport for a given aspect ratio. */
function fitToViewport(ratio: number) {
  const maxW = window.innerWidth - PADDING * 2
  const maxH = window.innerHeight - PADDING * 2

  let w = maxW
  let h = w / ratio
  if (h > maxH) {
    h = maxH
    w = h * ratio
  }
  return { width: w, height: h }
}

function getScaleAndTranslate(rect: LightboxRect) {
  const vw = window.innerWidth
  const vh = window.innerHeight

  const targetW = vw - PADDING * 2
  const targetH = vh - PADDING * 2

  const scale = Math.min(targetW / rect.width, targetH / rect.height)

  const cardCenterX = rect.left + rect.width / 2
  const cardCenterY = rect.top + rect.height / 2

  const viewCenterX = vw / 2
  const viewCenterY = vh / 2

  const translateX = viewCenterX - cardCenterX
  const translateY = viewCenterY - cardCenterY

  return { scale, translateX, translateY }
}

export function ImageLightbox({ items, activeIndex, rect, borderRadius, onClose }: ImageLightboxProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(activeIndex)
  const [loadedSrcs, setLoadedSrcs] = useState<Set<string>>(() => new Set())

  const markLoaded = useCallback((src: string) => {
    setLoadedSrcs((prev) => {
      const next = new Set(prev)
      next.add(src)
      return next
    })
  }, [])

  const current = items[index]
  const hasPrev = index > 0
  const hasNext = index < items.length - 1

  const goPrev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), [])
  const goNext = useCallback(() => setIndex((i) => Math.min(items.length - 1, i + 1)), [items.length])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "ArrowRight") goNext()
    },
    [onClose, goPrev, goNext],
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [handleKeyDown])

  const { scale, translateX, translateY } = getScaleAndTranslate(rect)

  // Whether we're showing the originally-clicked image (scale animation) or a navigated one (crossfade)
  const isOriginal = index === activeIndex

  return (
    <motion.div
      ref={overlayRef}
      className="fixed inset-0 z-50 cursor-zoom-out"
      onClick={onClose}
      initial={{ backgroundColor: "rgba(0,0,0,0)" }}
      animate={{ backgroundColor: "rgba(0,0,0,0.8)" }}
      exit={{ backgroundColor: "rgba(0,0,0,0)" }}
      transition={{ duration: 0.35, ease }}
    >
      {/* Scale-animated container for the originally clicked image */}
      <motion.div
        className="absolute overflow-hidden"
        style={{
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          borderRadius,
          transformOrigin: "center center",
        }}
        initial={{ scale: 1, x: 0, y: 0 }}
        animate={{
          scale: isOriginal ? scale : scale,
          x: translateX,
          y: translateY,
          opacity: isOriginal ? 1 : 0,
        }}
        exit={{ scale: 1, x: 0, y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease }}
        onClick={(e) => e.stopPropagation()}
      >
        {!loadedSrcs.has(items[activeIndex].src) && (
          <div className="absolute inset-0 animate-pulse rounded-inherit bg-white/10" />
        )}
        <Image
          src={items[activeIndex].src}
          alt={items[activeIndex].alt}
          fill
          sizes="100vw"
          className={`cursor-default object-cover transition-opacity duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${loadedSrcs.has(items[activeIndex].src) ? "opacity-100" : "opacity-0"}`}
          unoptimized={items[activeIndex].src.endsWith(".gif")}
          onLoad={() => markLoaded(items[activeIndex].src)}
          priority
        />
      </motion.div>

      {/* Crossfade container for navigated images — aspect ratio adapts per image */}
      {!isOriginal && (
        <motion.div
          className="fixed inset-0 z-[51] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, ease }}
          onClick={onClose}
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              key={current.src}
              className="relative overflow-hidden rounded-xl"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                width: fitToViewport(parseAspectRatio(current.aspectRatio)).width,
                height: fitToViewport(parseAspectRatio(current.aspectRatio)).height,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease }}
              onClick={(e) => e.stopPropagation()}
            >
              {!loadedSrcs.has(current.src) && (
                <div className="absolute inset-0 animate-pulse bg-white/10" />
              )}
              <Image
                src={current.src}
                alt={current.alt}
                fill
                sizes="100vw"
                className={`cursor-default object-cover transition-opacity duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${loadedSrcs.has(current.src) ? "opacity-100" : "opacity-0"}`}
                unoptimized={current.src.endsWith(".gif")}
                onLoad={() => markLoaded(current.src)}
                priority
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}

      {/* Navigation arrows */}
      <div className="fixed inset-x-0 top-1/2 z-[52] flex -translate-y-1/2 justify-between px-4 pointer-events-none">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); goPrev() }}
          disabled={!hasPrev}
          className="pointer-events-auto flex size-10 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-lg backdrop-blur-sm transition-all hover:bg-white disabled:pointer-events-none disabled:opacity-0 dark:bg-white/15 dark:text-white dark:hover:bg-white/25"
          aria-label="Previous image"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 12 6 8l4-4" />
          </svg>
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); goNext() }}
          disabled={!hasNext}
          className="pointer-events-auto flex size-10 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-lg backdrop-blur-sm transition-all hover:bg-white disabled:pointer-events-none disabled:opacity-0 dark:bg-white/15 dark:text-white dark:hover:bg-white/25"
          aria-label="Next image"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 4 4 4-4 4" />
          </svg>
        </button>
      </div>

      {/* Bottom bar: external link + counter */}
      <motion.div
        className="fixed bottom-6 left-1/2 z-[52] flex items-center gap-3"
        style={{ x: "-50%" }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.3, ease, delay: 0.1 }}
        onClick={(e) => e.stopPropagation()}
      >
        {current.url && (
          <a
            href={current.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-neutral-900 shadow-lg backdrop-blur-sm transition-colors hover:bg-white dark:bg-white/15 dark:text-white dark:hover:bg-white/25"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 7.5V11a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h3.5M8 2h4v4M6 8l6-6" />
            </svg>
            {current.alt}
          </a>
        )}
        <span className="rounded-full bg-white/90 px-3 py-2 text-xs font-medium tabular-nums text-neutral-500 shadow-lg backdrop-blur-sm dark:bg-white/15 dark:text-white/60">
          {index + 1} / {items.length}
        </span>
      </motion.div>
    </motion.div>
  )
}
