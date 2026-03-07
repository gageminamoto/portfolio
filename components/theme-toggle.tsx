"use client"

import { useTheme } from "next-themes"
import { useEffect, useRef, useState } from "react"
import { Moon, Sun, Sparkles } from "lucide-react"
import { useGradientWord } from "@/components/gradient-word-context"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const { shaderEnabled, setShaderEnabled } = useGradientWord()
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  function close() {
    setClosing(true)
  }

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) close()
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") close()
    }
    document.addEventListener("mousedown", handleClick)
    document.addEventListener("keydown", handleKey)
    return () => {
      document.removeEventListener("mousedown", handleClick)
      document.removeEventListener("keydown", handleKey)
    }
  }, [open])

  if (!mounted) {
    return <div className="h-8 w-8" />
  }

  const isDark = theme === "dark"

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => open ? close() : setOpen(true)}
        className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground"
        aria-label="Display settings"
        aria-expanded={open}
      >
        {isDark ? (
          <Sun className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Moon className="h-4 w-4" aria-hidden="true" />
        )}
      </button>

      {open && (
        <div
          className={`absolute right-0 top-full mt-2 w-fit origin-top-right rounded-lg border border-border bg-background p-1 shadow-md whitespace-nowrap ${closing ? "animate-out fade-out-0 zoom-out-95 slide-out-to-top-2" : "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2"}`}
          onAnimationEnd={() => {
            if (closing) {
              setOpen(false)
              setClosing(false)
            }
          }}
        >
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground transition-colors duration-150 ease-out hover:bg-accent"
          >
            {isDark ? (
              <Sun className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            ) : (
              <Moon className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            )}
            <span>{isDark ? "Light mode" : "Dark mode"}</span>
          </button>
          <button
            onClick={() => setShaderEnabled(!shaderEnabled)}
            className="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground transition-colors duration-150 ease-out hover:bg-accent"
            aria-pressed={shaderEnabled}
          >
            <Sparkles className={`h-3.5 w-3.5 text-muted-foreground${shaderEnabled ? "" : " opacity-40"}`} aria-hidden="true" />
            <span>Effects {shaderEnabled ? "on" : "off"}</span>
          </button>
        </div>
      )}
    </div>
  )
}
