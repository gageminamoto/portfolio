"use client"

import { useState, useRef, useCallback, useEffect, useSyncExternalStore } from "react"
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion"
import { X } from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Data                                                              */
/* ------------------------------------------------------------------ */

interface PokemonCard {
  id: string
  name: string
  image: string
}

const CARDS: PokemonCard[] = [
  {
    id: "wailord",
    name: "Wailord",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/623589_in_1000x1000-Ni6buFNtZzrOBW9a4wh3vWHQURbGW6.jpg",
  },
  {
    id: "ditto",
    name: "Ditto",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/475445_in_1000x1000-X3YEJ4R6ESkSCz62244k9AT0uNLhzv.jpg",
  },
  {
    id: "pikachu",
    name: "Flying Pikachu VMAX",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/250305_in_1000x1000-QJBGhbcTCekjIDGuvPdXBiyGAk69Fm.jpg",
  },
]

const CARD_BACK =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pokemon_card_back-dXWV0DNIYtGMZQ1FuvhU38VcKlM7eb.png"

// All image sources for preloading
const ALL_IMAGE_SRCS = [...CARDS.map((c) => c.image), CARD_BACK]

function preloadImages(srcs: string[]) {
  srcs.forEach((src) => {
    const img = new Image()
    img.src = src
  })
}

// Card native ratio 719:1000
const CARD_RATIO = 719 / 1000

// Fan thumbnail size
const FAN_CARD_H = 140
const FAN_CARD_W = Math.round(FAN_CARD_H * CARD_RATIO) // ~100

// Fan spread configs (relative to center)
const FAN_CONFIGS = [
  { rotate: -10, x: -14, y: -20 },
  { rotate: 0, x: 0, y: -34 },
  { rotate: 18, x: 28, y: -20 },
]

/* ------------------------------------------------------------------ */
/*  Holographic Overlay Component                                     */
/* ------------------------------------------------------------------ */

function HoloOverlay({
  rotateX,
  rotateY,
  intensity = 1,
}: {
  rotateX: ReturnType<typeof useSpring>
  rotateY: ReturnType<typeof useSpring>
  intensity?: number
}) {
  // Derive the "light source" position from the tilt values
  const bgPosX = useTransform(rotateY, [-25, 25], [0, 100])
  const bgPosY = useTransform(rotateX, [-25, 25], [0, 100])

  // Rainbow gradient that shifts with tilt
  const holoGradient = useTransform(
    [bgPosX, bgPosY],
    ([px, py]: number[]) => {
      const angle = Math.atan2(py - 50, px - 50) * (180 / Math.PI) + 180
      return `
        linear-gradient(
          ${angle}deg,
          rgba(255, 0, 0, 0.15) 0%,
          rgba(255, 154, 0, 0.15) 10%,
          rgba(208, 222, 33, 0.15) 20%,
          rgba(79, 220, 74, 0.15) 30%,
          rgba(63, 218, 216, 0.15) 40%,
          rgba(47, 201, 226, 0.15) 50%,
          rgba(28, 127, 238, 0.15) 60%,
          rgba(95, 21, 242, 0.15) 70%,
          rgba(186, 12, 248, 0.15) 80%,
          rgba(251, 7, 217, 0.15) 90%,
          rgba(255, 0, 0, 0.15) 100%
        )
      `
    }
  )

  // Moving specular highlight
  const specularGradient = useTransform(
    [bgPosX, bgPosY],
    ([px, py]: number[]) =>
      `radial-gradient(
        ellipse at ${px}% ${py}%,
        rgba(255, 255, 255, ${0.4 * intensity}) 0%,
        rgba(255, 255, 255, ${0.1 * intensity}) 30%,
        transparent 70%
      )`
  )

  // Fine rainbow grain / diffraction pattern
  const grainGradient = useTransform(
    [bgPosX, bgPosY],
    ([px, py]: number[]) => {
      const offset = (px + py) / 2
      return `
        repeating-linear-gradient(
          ${offset + 45}deg,
          rgba(255, 0, 100, 0.06) 0px,
          rgba(0, 255, 200, 0.06) 2px,
          rgba(100, 0, 255, 0.06) 4px,
          rgba(255, 200, 0, 0.06) 6px,
          transparent 8px,
          transparent 12px
        )
      `
    }
  )

  // Overall opacity based on tilt magnitude
  const holoOpacity = useTransform(
    [rotateX, rotateY],
    ([rx, ry]: number[]) => {
      const tiltMagnitude = Math.sqrt(rx * rx + ry * ry)
      return Math.min(0.15 + (tiltMagnitude / 25) * 0.85, 1) * intensity
    }
  )

  return (
    <>
      {/* Rainbow refraction layer */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-xl mix-blend-color-dodge"
        style={{
          background: holoGradient,
          opacity: holoOpacity,
        }}
      />
      {/* Fine diffraction grain */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-xl mix-blend-overlay"
        style={{
          background: grainGradient,
          opacity: holoOpacity,
        }}
      />
      {/* Specular highlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-xl mix-blend-overlay"
        style={{
          background: specularGradient,
          opacity: holoOpacity,
        }}
      />
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Static Holo Overlay for fan thumbnails                            */
/* ------------------------------------------------------------------ */

function StaticHoloOverlay() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 rounded-lg opacity-30 mix-blend-color-dodge"
        style={{
          background: `linear-gradient(
            135deg,
            rgba(255, 0, 0, 0.2) 0%,
            rgba(255, 154, 0, 0.2) 14%,
            rgba(208, 222, 33, 0.2) 28%,
            rgba(79, 220, 74, 0.2) 42%,
            rgba(63, 218, 216, 0.2) 56%,
            rgba(28, 127, 238, 0.2) 70%,
            rgba(95, 21, 242, 0.2) 84%,
            rgba(251, 7, 217, 0.2) 100%
          )`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-lg opacity-20 mix-blend-overlay"
        style={{
          background: `radial-gradient(
            ellipse at 30% 20%,
            rgba(255, 255, 255, 0.5) 0%,
            transparent 60%
          )`,
        }}
      />
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  3D Modal with Flip + Holo Shader                                  */
/* ------------------------------------------------------------------ */

function Card3DModal({
  card,
  onClose,
  isTouchDevice,
}: {
  card: PokemonCard
  onClose: () => void
  isTouchDevice: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const lastMouse = useRef({ x: 0, y: 0 })
  const [isFlipped, setIsFlipped] = useState(false)

  // Motion values for 3D tilt
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { stiffness: 150, damping: 20 }
  const springRotateX = useSpring(rotateX, springConfig)
  const springRotateY = useSpring(rotateY, springConfig)
  const springX = useSpring(x, { stiffness: 200, damping: 25 })
  const springY = useSpring(y, { stiffness: 200, damping: 25 })

  // Drag threshold to differentiate click vs drag
  const DRAG_THRESHOLD = 5

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!containerRef.current) return

      if (isDragging.current) {
        const dx = e.clientX - lastMouse.current.x
        const dy = e.clientY - lastMouse.current.y
        x.set(x.get() + dx)
        y.set(y.get() + dy)
        lastMouse.current = { x: e.clientX, y: e.clientY }
      } else {
        // Tilt based on pointer position relative to card center
        const rect = containerRef.current.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const mx = e.clientX - cx
        const my = e.clientY - cy
        rotateY.set((mx / (rect.width / 2)) * 12)
        rotateX.set(-(my / (rect.height / 2)) * 12)
      }
    },
    [rotateX, rotateY, x, y]
  )

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true
    dragStart.current = { x: e.clientX, y: e.clientY }
    lastMouse.current = { x: e.clientX, y: e.clientY }
      ; (e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }, [])

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    const dx = Math.abs(e.clientX - dragStart.current.x)
    const dy = Math.abs(e.clientY - dragStart.current.y)
    const wasDrag = dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD

    if (!wasDrag) {
      setIsFlipped((f) => !f)
    }

    isDragging.current = false
  }, [])

  const handlePointerLeave = useCallback(() => {
    if (!isDragging.current) {
      rotateX.set(0)
      rotateY.set(0)
    }
  }, [rotateX, rotateY])

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onPointerMove={handlePointerMove}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-[60] rounded-full bg-foreground/10 p-2 text-foreground/70 backdrop-blur-sm transition-colors duration-200 hover:bg-foreground/20 hover:text-foreground"
        aria-label="Close card view"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Hint text */}
      <motion.p
        className="pointer-events-none absolute bottom-8 left-1/2 z-[60] -translate-x-1/2 whitespace-nowrap text-sm text-foreground/40 select-none"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        {isTouchDevice
          ? "Drag to move \u00B7 Touch to tilt \u00B7 Tap to flip"
          : "Drag to move \u00B7 Hover to tilt \u00B7 Click to flip"}
      </motion.p>

      {/* 3D Card with flip + holo shader */}
      <motion.div
        ref={containerRef}
        className="relative z-[55] cursor-grab select-none active:cursor-grabbing"
        style={{
          x: springX,
          y: springY,
          rotateX: springRotateX,
          rotateY: springRotateY,
          perspective: 1200,
          transformStyle: "preserve-3d",
          width: "min(370px, 80vw)",
          aspectRatio: `${CARD_RATIO}`,
        }}
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.3, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 22,
          mass: 1,
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
      >
        {/* Inner wrapper that flips */}
        <motion.div
          className="relative h-full w-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Front face */}
          <div
            className="absolute inset-0 overflow-hidden rounded-xl shadow-2xl shadow-black/50"
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={card.image}
              alt={`${card.name} Pokemon card front`}
              className="pointer-events-none h-full w-full rounded-xl object-contain"
              draggable={false}
            />
            {/* Holo shader overlay */}
            <HoloOverlay
              rotateX={springRotateX}
              rotateY={springRotateY}
              intensity={1}
            />
            {/* Edge highlight */}
            <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/20" />
          </div>

          {/* Back face */}
          <div
            className="absolute inset-0 overflow-hidden rounded-xl shadow-2xl shadow-black/50"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={CARD_BACK}
              alt="Pokemon card back"
              className="pointer-events-none h-full w-full rounded-xl object-contain"
              draggable={false}
            />
            <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/20" />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Pokemon Cards (trigger + fan)                                     */
/* ------------------------------------------------------------------ */

export function PokemonCards() {
  const [isFanned, setIsFanned] = useState(false)
  const [selectedCard, setSelectedCard] = useState<PokemonCard | null>(null)
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const preloadedRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isTouchDevice = useSyncExternalStore(
    () => () => {},
    () => "ontouchstart" in window || navigator.maxTouchPoints > 0,
    () => false
  )

  const preloadAll = useCallback(() => {
    if (preloadedRef.current) return
    preloadedRef.current = true
    preloadImages(ALL_IMAGE_SRCS)
  }, [])

  // Preload images when the component approaches the viewport
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          preloadAll()
          observer.disconnect()
        }
      },
      { rootMargin: "200px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [preloadAll])

  const handleMouseEnter = useCallback(() => {
    preloadAll()
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    setIsFanned(true)
  }, [preloadAll])

  const handleMouseLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsFanned(false)
    }, 300)
  }, [])

  // Tap-to-toggle for mobile
  const handleTriggerClick = useCallback(() => {
    if (!isTouchDevice) return
    preloadAll()
    setIsFanned((f) => !f)
  }, [isTouchDevice, preloadAll])

  // Close fan when tapping outside on mobile
  useEffect(() => {
    if (!isFanned || !isTouchDevice) return
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsFanned(false)
      }
    }
    document.addEventListener("click", handleOutsideClick)
    return () => document.removeEventListener("click", handleOutsideClick)
  }, [isFanned, isTouchDevice])

  const handleCardClick = useCallback(
    (card: PokemonCard, e: React.MouseEvent) => {
      e.stopPropagation()
      setSelectedCard(card)
      setIsFanned(false)
    },
    []
  )

  const handleCloseModal = useCallback(() => {
    setSelectedCard(null)
  }, [])

  return (
    <>
      <div
        ref={containerRef}
        className="relative inline-flex"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Trigger text styled like other hobby links */}
        <span
          className="cursor-pointer font-medium text-foreground underline decoration-transparent underline-offset-4 transition-colors duration-200 hover:decoration-foreground"
          onClick={handleTriggerClick}
        >
          Pokemon cards
        </span>

        {/* Fan of cards peeking upward */}
        <AnimatePresence>
          {isFanned && (
            <div
              className="pointer-events-none absolute bottom-full left-1/2 z-40"
              style={{ transform: "translateX(-50%)" }}
            >
              {CARDS.map((card, index) => (
                <motion.div
                  key={card.id}
                  className="pointer-events-auto absolute cursor-pointer"
                  style={{
                    width: FAN_CARD_W,
                    height: FAN_CARD_H,
                    left: "50%",
                    bottom: 0,
                    marginLeft: -(FAN_CARD_W / 2),
                    transformOrigin: "50% 100%",
                  }}
                  initial={{
                    rotate: 0,
                    x: 0,
                    y: 30,
                    opacity: 0,
                    scale: 0.5,
                  }}
                  animate={{
                    rotate: FAN_CONFIGS[index].rotate,
                    x: FAN_CONFIGS[index].x,
                    y: FAN_CONFIGS[index].y,
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    rotate: 0,
                    x: 0,
                    y: 30,
                    opacity: 0,
                    scale: 0.5,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 320,
                    damping: 26,
                    mass: 0.7,
                    delay: index * 0.05,
                  }}
                  whileHover={{
                    scale: 1.12,
                    y: FAN_CONFIGS[index].y - 14,
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 20,
                    },
                  }}
                  whileTap={{ scale: 1.08 }}
                  onClick={(e) => handleCardClick(card, e)}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-lg shadow-lg shadow-black/40 ring-1 ring-white/10 transition-shadow duration-200 hover:shadow-xl hover:shadow-black/50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={card.image}
                      alt={`${card.name} Pokemon card`}
                      className="h-full w-full rounded-lg object-contain"
                      draggable={false}
                    />
                    {/* Static holo shimmer on fan cards */}
                    <StaticHoloOverlay />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Full-screen 3D modal */}
      <AnimatePresence>
        {selectedCard && (
          <Card3DModal card={selectedCard} onClose={handleCloseModal} isTouchDevice={isTouchDevice} />
        )}
      </AnimatePresence>
    </>
  )
}
