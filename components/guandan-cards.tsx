"use client"

import { useReducedMotion } from "framer-motion"

type CardSpec = {
  rank: string
  suit: "♠" | "♥" | "♦" | "♣"
  color: "black" | "red"
}

const CARDS: CardSpec[] = [
  { rank: "2", suit: "♣", color: "black" },
  { rank: "5", suit: "♥", color: "red" },
  { rank: "10", suit: "♠", color: "black" },
  { rank: "J", suit: "♦", color: "red" },
  { rank: "A", suit: "♠", color: "black" },
]

const CARD_W = 26
const CARD_H = 36
const CONTAINER_W = 90
const CONTAINER_H = 50
const BASE_LEFT = CONTAINER_W / 2 - CARD_W / 2
const BASE_TOP = 7

const CLOSED = [
  { dx: -8, dy: 2, rot: -6 },
  { dx: -4, dy: 1, rot: -3 },
  { dx: 0, dy: 0, rot: 0 },
  { dx: 4, dy: 1, rot: 3 },
  { dx: 8, dy: 2, rot: 6 },
]

const OPEN = [
  { dx: -28, dy: 8, rot: -14 },
  { dx: -14, dy: 3, rot: -7 },
  { dx: 0, dy: 0, rot: 0 },
  { dx: 14, dy: 3, rot: 7 },
  { dx: 28, dy: 8, rot: 14 },
]

const EASE_OUT_CUBIC = "cubic-bezier(0.215, 0.61, 0.355, 1)"

export function GuandanCards({
  isHovered = false,
  className,
}: {
  isHovered?: boolean
  className?: string
}) {
  const reduceMotion = useReducedMotion()

  return (
    <div
      className={`relative shrink-0 ${className ?? ""}`}
      style={{ width: CONTAINER_W, height: CONTAINER_H }}
      aria-hidden
    >
      {CARDS.map((card, i) => {
        const color = card.color === "red" ? "#C0362C" : "#1A1A1A"
        const state = isHovered ? OPEN[i] : CLOSED[i]
        return (
          <div
            key={i}
            className="absolute flex flex-col rounded-[3px] bg-[#FDFCFA]"
            style={{
              left: BASE_LEFT,
              top: BASE_TOP,
              width: CARD_W,
              height: CARD_H,
              padding: "2px 3px",
              transform: `translate3d(${state.dx}px, ${state.dy}px, 0) rotate(${state.rot}deg)`,
              transformOrigin: "center center",
              willChange: "transform",
              boxShadow:
                "inset 0 0 0 0.75px #16120C14, 1px 1px 1px #16120C29",
              transition: reduceMotion
                ? "none"
                : `transform 200ms ${EASE_OUT_CUBIC}`,
            }}
          >
            <div className="flex flex-col items-start leading-none">
              <span
                className="font-semibold"
                style={{
                  color,
                  fontFamily: "'IBM Plex Serif', system-ui, sans-serif",
                  fontSize: 8,
                  letterSpacing: card.rank === "10" ? "-0.04em" : undefined,
                }}
              >
                {card.rank}
              </span>
              <span style={{ color, fontSize: 6, lineHeight: 1 }}>
                {card.suit}
              </span>
            </div>
            <div
              className="flex flex-1 items-center justify-center"
              style={{ color, fontSize: 13, lineHeight: 1 }}
            >
              {card.suit}
            </div>
          </div>
        )
      })}
    </div>
  )
}
