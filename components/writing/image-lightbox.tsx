"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"

interface ImageLightboxProps {
  src: string
  alt: string
  onClose: () => void
}

const MIN_SCALE = 1
const MAX_SCALE = 4
const ZOOM_STEP = 0.5

export function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [loaded, setLoaded] = useState(false)
  const [scale, setScale] = useState(1)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const pointerDown = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const translateStart = useRef({ x: 0, y: 0 })

  const isZoomed = scale > 1

  const clampTranslate = useCallback(
    (x: number, y: number, s: number) => {
      if (s <= 1) return { x: 0, y: 0 }
      const img = imgRef.current
      if (!img) return { x, y }

      // Use natural dimensions divided by devicePixelRatio for approximate rendered size
      const imgW = img.offsetWidth
      const imgH = img.offsetHeight

      const maxX = ((s - 1) * imgW) / 2
      const maxY = ((s - 1) * imgH) / 2

      return {
        x: Math.max(-maxX, Math.min(maxX, x)),
        y: Math.max(-maxY, Math.min(maxY, y)),
      }
    },
    []
  )

  const resetZoom = useCallback(() => {
    setScale(1)
    setTranslate({ x: 0, y: 0 })
  }, [])

  useEffect(() => {
    closeRef.current?.focus()

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (isZoomed) {
          resetZoom()
        } else {
          onClose()
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose, isZoomed, resetZoom])

  // Scroll wheel zoom
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    function handleWheel(e: WheelEvent) {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP
      setScale((prev) => {
        const next = Math.max(MIN_SCALE, Math.min(MAX_SCALE, prev + delta))
        if (next <= 1) setTranslate({ x: 0, y: 0 })
        return next
      })
    }

    container.addEventListener("wheel", handleWheel, { passive: false })
    return () => container.removeEventListener("wheel", handleWheel)
  }, [])

  function handleImageClick(e: React.MouseEvent) {
    e.stopPropagation()
    if (isDragging) return

    if (isZoomed) {
      resetZoom()
    } else {
      setScale(2.5)
    }
  }

  function handlePointerDown(e: React.PointerEvent) {
    if (!isZoomed) return
    e.preventDefault()
    pointerDown.current = true
    setIsDragging(false)
    dragStart.current = { x: e.clientX, y: e.clientY }
    translateStart.current = { ...translate }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!isZoomed || !pointerDown.current) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y

    if (!isDragging && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
      setIsDragging(true)
    }

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      const newTranslate = clampTranslate(
        translateStart.current.x + dx,
        translateStart.current.y + dy,
        scale
      )
      setTranslate(newTranslate)
    }
  }

  function handlePointerUp() {
    pointerDown.current = false
    // Reset dragging flag after a tick so click handler can check it
    setTimeout(() => setIsDragging(false), 0)
  }

  function handleBackdropClick() {
    if (isZoomed) {
      resetZoom()
    } else {
      onClose()
    }
  }

  return (
    <motion.div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Expanded image"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      style={{ overscrollBehavior: "contain" }}
      onClick={handleBackdropClick}
    >
      <button
        ref={closeRef}
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        aria-label="Close"
        className="absolute right-4 top-4 z-10 rounded-md p-2 text-white/70 transition-colors duration-150 ease-out hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Loading spinner */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
        </div>
      )}

      {/* Outer motion.div handles enter/exit animation only */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: loaded ? 1 : 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={handleImageClick}
        style={{
          cursor: isZoomed ? "grab" : "zoom-in",
        }}
      >
        {/* Inner div handles zoom/pan transforms without Framer Motion conflict */}
        <div
          style={{
            transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
            transition: isDragging ? "none" : "transform 0.2s ease-out",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            width={2400}
            height={1350}
            onLoad={() => setLoaded(true)}
            className="max-h-[85vh] max-w-[95vw] rounded-lg object-contain md:max-w-4xl"
            style={{
              userSelect: "none",
              touchAction: "none",
            }}
            draggable={false}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
