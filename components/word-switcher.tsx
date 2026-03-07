"use client"

import { useState, useRef, useLayoutEffect } from "react"
import { ChevronDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { useDialKit } from "dialkit"

interface WordSwitcherProps {
  options: string[]
  onWordChange?: (word: string) => void
}

export function WordSwitcher({ options, onWordChange }: WordSwitcherProps) {
  const [selected, setSelected] = useState(options[0])
  const [open, setOpen] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const p = useDialKit("Word Crossfade", {
    duration: [0.24, 0.05, 1],
    yOffset: [6, 0, 20],
    blur: [4, 0, 10],
    widthDuration: [0.26, 0.1, 1],
  })

  const measureRef = useRef<HTMLSpanElement>(null)
  const [widths, setWidths] = useState<Record<string, number>>({})

  useLayoutEffect(() => {
    const measure = () => {
      if (!measureRef.current) return
      const spans = measureRef.current.children
      const newWidths: Record<string, number> = {}
      options.forEach((option, i) => {
        const el = spans[i] as HTMLElement
        if (el) newWidths[option] = el.getBoundingClientRect().width
      })
      setWidths(newWidths)
    }
    measure()
    document.fonts.ready.then(measure)
  }, [options])

  const handleSelect = (option: string) => {
    if (option !== selected) {
      setSelected(option)
      onWordChange?.(option)
    }
    setOpen(false)
  }

  const currentWidth = widths[selected]

  return (
    <>
      <span
        ref={measureRef}
        aria-hidden
        className="pointer-events-none"
        style={{ position: "absolute", visibility: "hidden", whiteSpace: "nowrap" }}
      >
        {options.map((option) => (
          <span key={option} className="inline-block">{option}</span>
        ))}
      </span>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className="inline-flex items-center gap-0.5 rounded-md px-1 -mx-1 text-foreground underline decoration-dashed decoration-muted-foreground/50 underline-offset-[3px] transition-colors hover:decoration-foreground cursor-pointer"
          >
            <motion.span
              className="inline-flex overflow-hidden"
              animate={{ width: currentWidth || "auto" }}
              transition={{
                duration: prefersReducedMotion ? 0 : p.widthDuration,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={selected}
                  className="inline-block whitespace-nowrap"
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : p.yOffset, filter: prefersReducedMotion ? "none" : `blur(${p.blur}px)` }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -p.yOffset, filter: prefersReducedMotion ? "none" : `blur(${p.blur}px)` }}
                  transition={{ duration: prefersReducedMotion ? 0 : p.duration, ease: [0.23, 1, 0.32, 1] }}
                  style={{ willChange: "filter, opacity, transform" }}
                >
                  {selected}
                </motion.span>
              </AnimatePresence>
            </motion.span>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-auto min-w-[120px] p-1"
        >
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className={`flex w-full rounded-sm px-2 py-1.5 text-sm transition-colors cursor-pointer ${
                option === selected
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {option}
            </button>
          ))}
        </PopoverContent>
      </Popover>
    </>
  )
}
