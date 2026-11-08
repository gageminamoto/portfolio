"use client"

import { useId, type ReactNode } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { MacAppSlug } from "@/lib/mac-apps"
import {
  AGENTATION_MARK,
  GROK_BOT_MARK,
  LINEAR_MARK,
  RAYCAST_MARK,
} from "@/lib/mac-app-marks"

/* ─────────────────────────────────────────────────────────
 * macOS app icon, drawn to Apple's guidelines.
 *
 * Apple's macOS icon grid is a 1024 canvas with an 824 rounded square in the
 * middle and a soft drop shadow underneath. The same proportions here: a 124
 * canvas with a 100 squircle inset by 12, so a drawn icon sits at the same
 * size as a real exported .icns next to it.
 * ───────────────────────────────────────────────────────── */

const CANVAS = 124
const INSET = 12
const SQUIRCLE =
  "M50 0C73.4 0 85.1 0 92.5 7.5C100 15 100 26.6 100 50C100 73.4 100 85.1 92.5 92.5C85.1 100 73.4 100 50 100C26.6 100 15 100 7.5 92.5C0 85.1 0 73.4 0 50C0 26.6 0 15 7.5 7.5C15 0 26.6 0 50 0Z"

/** A 24×24 mark scaled to fill ~56% of the squircle, centred. */
function Mark24({
  d,
  fill = "#fff",
  fillRule,
}: {
  d: string
  fill?: string
  fillRule?: "nonzero" | "evenodd"
}) {
  return (
    <g transform="translate(22 22) scale(2.333)">
      <path d={d} fill={fill} fillRule={fillRule} />
    </g>
  )
}

function FigmaMark() {
  // Figma's mark on its 38×57 grid, scaled to half the icon height.
  return (
    <g transform="translate(33.3 25) scale(0.877)">
      <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 1 1-19 0z" fill="#1ABCFE" />
      <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83" />
      <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262" />
      <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
      <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
    </g>
  )
}

function PaperMark() {
  // A sheet with a folded corner.
  return (
    <g>
      <path
        d="M34 22h22l14 14v38a4 4 0 0 1-4 4H34a4 4 0 0 1-4-4V26a4 4 0 0 1 4-4z"
        fill="#1d1d1f"
      />
      <path d="M56 22v10a4 4 0 0 0 4 4h10z" fill="#8e8e93" />
      <g stroke="rgba(255,255,255,.35)" strokeWidth="3" strokeLinecap="round">
        <line x1="40" y1="52" x2="60" y2="52" />
        <line x1="40" y1="61" x2="60" y2="61" />
        <line x1="40" y1="70" x2="52" y2="70" />
      </g>
    </g>
  )
}

function AgentationMark() {
  // Agentation's script “A” (243×220 canvas) at 58 wide.
  return (
    <g transform="translate(21 23.7) scale(0.2387)">
      <path d={AGENTATION_MARK} fill="#111" fillRule="evenodd" />
    </g>
  )
}

function DialKitMark() {
  // A rotary dial: tick ring, knob, and pointer.
  const ticks = Array.from({ length: 11 }, (_, i) => -135 + i * 27)
  return (
    <g>
      <g stroke="rgba(255,255,255,.32)" strokeWidth="2.5" strokeLinecap="round">
        {ticks.map((deg) => (
          <line key={deg} x1="50" y1="12" x2="50" y2="17" transform={`rotate(${deg} 50 50)`} />
        ))}
      </g>
      <circle cx="50" cy="50" r="25" fill="#2c2c2e" stroke="rgba(255,255,255,.14)" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="25" fill="url(#knob-sheen)" />
      <line
        x1="50"
        y1="50"
        x2="50"
        y2="30"
        stroke="#fff"
        strokeWidth="4.5"
        strokeLinecap="round"
        transform="rotate(40 50 50)"
      />
    </g>
  )
}

function InflightMark() {
  // A paper plane in flight.
  return (
    <g>
      <path d="M22 48 78 24 62 76 48 60 40 72 40 56Z" fill="#fff" />
      <path d="M40 56 78 24 48 60Z" fill="rgba(0,0,0,.14)" />
    </g>
  )
}

function GranolaMark() {
  return (
    <text
      x="50"
      y="68"
      textAnchor="middle"
      fontSize="54"
      fontWeight="700"
      fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Rounded', 'Inter', system-ui, sans-serif"
      fill="#1d1d1f"
      letterSpacing="-2"
    >
      G
    </text>
  )
}

interface IconStyle {
  /** Top and bottom gradient stops for the squircle. */
  from: string
  to: string
  /** Light icons get a slightly stronger edge so they hold up on white. */
  light?: boolean
  mark: ReactNode
}

const ICONS: Record<MacAppSlug, IconStyle> = {
  figma: { from: "#2c2c2e", to: "#0f0f10", mark: <FigmaMark /> },
  paper: { from: "#ffffff", to: "#e9e9eb", light: true, mark: <PaperMark /> },
  linear: { from: "#7b86e0", to: "#5e6ad2", mark: <Mark24 d={LINEAR_MARK} /> },
  agentation: { from: "#ffffff", to: "#ececec", light: true, mark: <AgentationMark /> },
  dialkit: { from: "#4a4a4d", to: "#1c1c1e", mark: <DialKitMark /> },
  inflight: { from: "#64d2ff", to: "#0a84ff", mark: <InflightMark /> },
  "grok-bot": {
    from: "#3a3a3c",
    to: "#000000",
    mark: <Mark24 d={GROK_BOT_MARK} fillRule="evenodd" />,
  },
  raycast: { from: "#ff7a7a", to: "#e03e3e", mark: <Mark24 d={RAYCAST_MARK} /> },
  granola: { from: "#fbf3e4", to: "#ebd9b4", light: true, mark: <GranolaMark /> },
}

export interface MacAppIconProps {
  slug: MacAppSlug
  /** A real exported icon (`/tools/<slug>.png`). Replaces the drawn mock-up. */
  image?: string
  className?: string
}

/**
 * Renders a tool's Mac app icon: the real exported image when one exists,
 * otherwise a mock-up drawn to Apple's macOS icon guidelines.
 */
export function MacAppIcon({ slug, image, className }: MacAppIconProps) {
  const uid = useId()

  if (image) {
    return (
      <Image
        src={image}
        alt=""
        width={CANVAS}
        height={CANVAS}
        draggable={false}
        className={cn("block size-full select-none", className)}
      />
    )
  }

  const style = ICONS[slug]
  const fillId = `${uid}-fill`
  const sheenId = `${uid}-sheen`
  const shadowId = `${uid}-shadow`
  const clipId = `${uid}-clip`

  return (
    <svg
      viewBox={`0 0 ${CANVAS} ${CANVAS}`}
      className={cn("block size-full select-none", className)}
      aria-hidden
      focusable="false"
    >
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={style.from} />
          <stop offset="1" stopColor={style.to} />
        </linearGradient>
        <linearGradient id={sheenId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={style.light ? 0.6 : 0.22} />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="knob-sheen" cx="0.5" cy="0.2" r="0.8">
          <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <filter id={shadowId} x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="1.4" stdDeviation="2" floodColor="#000" floodOpacity="0.3" />
        </filter>
        <clipPath id={clipId}>
          <path d={SQUIRCLE} />
        </clipPath>
      </defs>
      <g transform={`translate(${INSET} ${INSET})`}>
        <g filter={`url(#${shadowId})`}>
          <path d={SQUIRCLE} fill={`url(#${fillId})`} />
        </g>
        <g clipPath={`url(#${clipId})`}>
          <rect width="100" height="100" fill={`url(#${sheenId})`} />
          {style.mark}
        </g>
        <path
          d={SQUIRCLE}
          fill="none"
          stroke={style.light ? "rgba(0,0,0,.14)" : "rgba(0,0,0,.25)"}
          strokeWidth="1.5"
        />
      </g>
    </svg>
  )
}
