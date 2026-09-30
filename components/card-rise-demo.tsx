"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { useFinePointerHover } from "@/hooks/use-fine-pointer-hover"

const SPRING = { type: "spring" as const, visualDuration: 0.4, bounce: 0.15 }

const CARD_W = 228
const CARD_H = 288
const FOCUS_W = 360
const FOCUS_H = 464

const FAN_WIDTH = 600
const STACK_Y = 220
const STACK_X = [-18, -9, 0, 9, 18] as const

const CARDS = [
  { id: "1", x: -210, y: -10, rotate: -8 },
  { id: "2", x: -105, y: 6, rotate: 4 },
  { id: "3", x: 0, y: -4, rotate: -2 },
  { id: "4", x: 105, y: 20, rotate: 1 },
  { id: "5", x: 210, y: 10, rotate: 5 },
] as const

function useFanLayoutScale() {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const update = () => {
      const available = window.innerWidth - 32
      setScale(Math.min(1, available / FAN_WIDTH))
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  return scale
}

export function CardRiseDemo() {
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const layoutScale = useFanLayoutScale()
  const reduceMotion = useReducedMotion()
  const finePointer = useFinePointerHover()

  const transition = reduceMotion ? { duration: 0.15 } : SPRING

  return (
    <main
      id="main-content"
      className="flex min-h-[100dvh] items-center justify-center bg-background px-4"
      onClick={() => setFocusedId(null)}
    >
      <div
        className="relative h-[600px] w-full max-w-[640px] origin-center"
        style={{ transform: `scale(${layoutScale})` }}
        aria-label="Card rise interaction demo"
      >
        {CARDS.map((card, index) => {
          const isFocused = focusedId === card.id
          const isStacked = focusedId !== null && !isFocused

          const width = isFocused ? FOCUS_W : CARD_W
          const height = isFocused ? FOCUS_H : CARD_H

          const isHovered =
            finePointer && focusedId === null && hoveredId === card.id && !reduceMotion

          const x = isFocused ? 0 : isStacked ? STACK_X[index] : card.x
          const y = isFocused ? 0 : isStacked ? STACK_Y : isHovered ? card.y - 8 : card.y
          const rotate = isFocused || isStacked ? 0 : card.rotate
          const scale = isStacked ? 0.7 : isHovered ? 1.03 : 1

          const zIndex = isFocused ? 50 : focusedId === null ? index + 1 : index

          return (
            <motion.div
              key={card.id}
              role="button"
              tabIndex={0}
              aria-pressed={isFocused}
              className="absolute left-1/2 top-1/2 cursor-pointer rounded-2xl bg-white shadow-lg"
              style={{ zIndex }}
              initial={false}
              animate={{
                x,
                y,
                rotate,
                scale,
                width,
                height,
                marginLeft: -width / 2,
                marginTop: -height / 2,
              }}
              transition={transition}
              onHoverStart={() => {
                if (focusedId === null) setHoveredId(card.id)
              }}
              onHoverEnd={() => {
                setHoveredId((current) => (current === card.id ? null : current))
              }}
              onClick={(event) => {
                event.stopPropagation()
                setFocusedId((current) => (current === card.id ? null : card.id))
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  event.stopPropagation()
                  setFocusedId((current) => (current === card.id ? null : card.id))
                }
              }}
            />
          )
        })}
      </div>
    </main>
  )
}
