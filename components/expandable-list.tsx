"use client"

import { useState, type CSSProperties, type ReactNode } from "react"
import { useReducedMotion } from "framer-motion"
import { IconChevronDown } from "@/components/site-icons"
import { cn } from "@/lib/utils"

/* ─────────────────────────────────────────────────────────
 * SHOW MORE STORYBOARD
 *
 * Open (ms after click)
 *    0   list grows on a strong ease-out; bottom fade on the
 *        last visible row eases away; chevron turns
 *  +60   hidden rows fade in behind the growth
 *  ~300–600 settled (longer lists take a little longer)
 *
 * Close mirrors it: hidden rows fade out first, then the list
 * folds up on the same curve and the bottom fade returns.
 * ───────────────────────────────────────────────────────── */

const EASE = "cubic-bezier(0.19, 1, 0.22, 1)"
const LAG = 0.06 // s: fade trails height on open, leads it on close
const FADE = { open: 0.25, close: 0.2 }
const BOTTOM_FADE = "2rem"

// Register the bottom-fade length so the browser can transition it. Done here
// rather than with @property in CSS, which the CSS build drops when no
// stylesheet uses the variable.
if (typeof window !== "undefined" && "registerProperty" in CSS) {
  try {
    CSS.registerProperty({
      name: "--list-fade",
      syntax: "<length>",
      inherits: false,
      initialValue: "0px",
    })
  } catch {
    // Already registered (hot reload or a second import).
  }
}

/** Grow time scales with how many rows move, so 1 row doesn't drag and 25 don't snap. */
function heightDuration(hiddenCount: number) {
  return Math.min(0.6, 0.3 + hiddenCount * 0.015)
}

interface ExpandableListProps<T> {
  items: T[]
  getKey: (item: T) => string
  renderRow: (item: T) => ReactNode
  /** Plural noun for the button label, e.g. "posts". */
  noun: string
  initialCount?: number
  onMouseLeave?: () => void
}

export function ExpandableList<T>({
  items,
  getKey,
  renderRow,
  noun,
  initialCount = 5,
  onMouseLeave,
}: ExpandableListProps<T>) {
  const [expanded, setExpanded] = useState(false)
  const reduceMotion = useReducedMotion()
  const hidden = items.slice(initialCount)
  const hasMore = hidden.length > 0
  const height = heightDuration(hidden.length)

  const listStyle = hasMore
    ? ({
        "--list-fade": expanded ? "0rem" : BOTTOM_FADE,
        maskImage: "linear-gradient(to bottom, black calc(100% - var(--list-fade)), transparent)",
        transition: reduceMotion
          ? "--list-fade 0.2s ease"
          : expanded
            ? `--list-fade 0.2s ${EASE}`
            : `--list-fade ${height}s ${EASE} ${LAG}s`,
      } as CSSProperties)
    : undefined

  const growStyle: CSSProperties = {
    transition: reduceMotion
      ? "none"
      : `grid-template-rows ${height}s ${EASE} ${expanded ? 0 : LAG}s`,
  }

  const hiddenRowsStyle: CSSProperties = {
    opacity: expanded ? 1 : 0,
    transition: expanded
      ? `opacity ${FADE.open}s ease-out ${reduceMotion ? 0 : LAG}s`
      : `opacity ${FADE.close}s ease-out`,
  }

  return (
    <div className="flex flex-col" onMouseLeave={onMouseLeave} style={listStyle}>
      {items.slice(0, initialCount).map((item) => (
        <div key={getKey(item)} className="contents">
          {renderRow(item)}
        </div>
      ))}

      {hasMore && (
        <>
          <div
            className={cn("grid", expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
            style={growStyle}
          >
            <div className="overflow-hidden">
              {/* inert while collapsed so hidden rows can't take focus */}
              <div className="flex flex-col" style={hiddenRowsStyle} inert={!expanded}>
                {hidden.map((item) => (
                  <div key={getKey(item)} className="contents">
                    {renderRow(item)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="group flex cursor-pointer items-center justify-center py-1"
            aria-expanded={expanded}
            aria-label={expanded ? `Show fewer ${noun}` : `Show ${hidden.length} more ${noun}`}
          >
            <IconChevronDown
              className={cn(
                "size-4 text-muted-foreground group-hover:text-foreground",
                expanded && "rotate-180",
              )}
              style={{
                transition: reduceMotion
                  ? "color 150ms ease"
                  : `color 150ms ease, transform ${height}s ${EASE}`,
              }}
            />
          </button>
        </>
      )}
    </div>
  )
}
