"use client"

import { useTheme } from "next-themes"
import { useEffect, useRef, useState } from "react"
import { Moon, Sun, Monitor, Sparkles, Volume2 } from "lucide-react"
import { useGradientWord } from "@/components/gradient-word-context"
import { useMounted } from "@/hooks/use-mounted"

export function ThemeToggle({
  placement = "bottom",
  compact = false,
}: {
  placement?: "bottom" | "top"
  compact?: boolean
} = {}) {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const { shaderEnabled, setShaderEnabled, soundEnabled, setSoundEnabled } = useGradientWord()
  const mounted = useMounted()
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

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
    return <div className={compact ? "h-3.5 w-3.5" : "h-8 w-8"} />
  }

  const isDark = resolvedTheme === "dark"

  const ThemeIcon = theme === "system" ? Monitor : isDark ? Sun : Moon

  const triggerClass = compact
    ? "inline-flex h-3.5 w-3.5 cursor-pointer items-center justify-center rounded-sm text-muted-foreground/40 transition-colors duration-150 hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    : "inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-[color,transform] duration-150 ease-out hover:text-foreground active:scale-[0.97]"

  const iconClass = compact ? "h-3.5 w-3.5" : "h-4 w-4"

  const isTop = placement === "top"
  const panelPosition = isTop ? "bottom-full mb-2 origin-bottom-right" : "top-full mt-2 origin-top-right"
  const enterAnim = isTop ? "animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2" : "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2"
  const exitAnim = isTop ? "animate-out fade-out-0 zoom-out-95 slide-out-to-bottom-2" : "animate-out fade-out-0 zoom-out-95 slide-out-to-top-2"

  return (
    <div ref={ref} className={compact ? "relative inline-flex" : "relative"}>
      <button
        onClick={() => open ? close() : setOpen(true)}
        className={triggerClass}
        aria-label="Display settings"
        aria-expanded={open}
      >
        <ThemeIcon className={iconClass} aria-hidden="true" />
      </button>

      {open && (
        <div
          className={`absolute right-0 ${panelPosition} z-50 w-fit rounded-lg border border-border bg-background p-1 shadow-md whitespace-nowrap ${closing ? exitAnim : enterAnim}`}
          onAnimationEnd={() => {
            if (closing) {
              setOpen(false)
              setClosing(false)
            }
          }}
        >
          <button
            onClick={() => setTheme("light")}
            className={`flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-150 ease-out hover:bg-accent ${theme === "light" ? "text-foreground" : "text-muted-foreground"}`}
          >
            <Sun className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Light</span>
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-150 ease-out hover:bg-accent ${theme === "dark" ? "text-foreground" : "text-muted-foreground"}`}
          >
            <Moon className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Dark</span>
          </button>
          <button
            onClick={() => setTheme("system")}
            className={`flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-150 ease-out hover:bg-accent ${theme === "system" ? "text-foreground" : "text-muted-foreground"}`}
          >
            <Monitor className="h-3.5 w-3.5" aria-hidden="true" />
            <span>System</span>
          </button>
          <div className="mx-1 my-1 border-t border-border" />
          <button
            onClick={() => setShaderEnabled(!shaderEnabled)}
            className="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground transition-colors duration-150 ease-out hover:bg-accent"
            aria-pressed={shaderEnabled}
          >
            <Sparkles className={`h-3.5 w-3.5 text-muted-foreground${shaderEnabled ? "" : " opacity-40"}`} aria-hidden="true" />
            <span>Effects {shaderEnabled ? "on" : "off"}</span>
          </button>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground transition-colors duration-150 ease-out hover:bg-accent"
            aria-pressed={soundEnabled}
          >
            <Volume2 className={`h-3.5 w-3.5 text-muted-foreground${soundEnabled ? "" : " opacity-40"}`} aria-hidden="true" />
            <span>Sound {soundEnabled ? "on" : "off"}</span>
          </button>
        </div>
      )}
    </div>
  )
}
