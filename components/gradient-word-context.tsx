"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { useMounted } from "@/hooks/use-mounted"

const THEME_HUES: Record<string, { hue: number; chroma: number }> = {
  software: { hue: 250, chroma: 0.14 },
  brands:   { hue: 330, chroma: 0.15 },
  tools:    { hue: 145, chroma: 0.17 },
}

const GradientWordContext = createContext<{
  activeWord: string
  setActiveWord: (word: string) => void
  shaderEnabled: boolean
  setShaderEnabled: (enabled: boolean) => void
  cursorTrailActive: boolean
  setCursorTrailActive: (active: boolean) => void
  soundEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void
}>({ activeWord: "software", setActiveWord: () => {}, shaderEnabled: true, setShaderEnabled: () => {}, cursorTrailActive: false, setCursorTrailActive: () => {}, soundEnabled: true, setSoundEnabled: () => {} })

export function GradientWordProvider({ children }: { children: React.ReactNode }) {
  const [activeWord, setActiveWord] = useState("software")
  const [shaderEnabled, setShaderEnabledState] = useState(() => {
    if (typeof window === "undefined") return true
    return localStorage.getItem("shader-enabled") !== "false"
  })
  const [cursorTrailActive, setCursorTrailActive] = useState(false)
  const [soundEnabled, setSoundEnabledState] = useState(() => {
    if (typeof window === "undefined") return true
    return localStorage.getItem("sound-enabled") !== "false"
  })
  const { resolvedTheme } = useTheme()
  const mounted = useMounted()

  // Sync accent/ring CSS variables to the active section color
  useEffect(() => {
    const t = THEME_HUES[activeWord] ?? THEME_HUES.software
    const isDark = resolvedTheme === "dark"
    const root = document.documentElement

    const c = t.chroma
    if (isDark) {
      root.style.setProperty("--primary", `oklch(0.75 ${c} ${t.hue})`)
      root.style.setProperty("--primary-foreground", `oklch(0.15 ${c * 0.3} ${t.hue})`)
      root.style.setProperty("--accent", `oklch(0.25 ${c * 0.5} ${t.hue})`)
      root.style.setProperty("--accent-foreground", `oklch(0.90 ${c * 0.4} ${t.hue})`)
      root.style.setProperty("--ring", `oklch(0.50 ${c * 0.6} ${t.hue})`)
      root.style.setProperty("--border", `oklch(0.30 ${c * 0.35} ${t.hue})`)
    } else {
      root.style.setProperty("--primary", `oklch(0.55 ${c * 1.4} ${t.hue})`)
      root.style.setProperty("--primary-foreground", `oklch(0.98 ${c * 0.1} ${t.hue})`)
      root.style.setProperty("--accent", `oklch(0.95 ${c * 0.4} ${t.hue})`)
      root.style.setProperty("--accent-foreground", `oklch(0.30 ${c * 0.6} ${t.hue})`)
      root.style.setProperty("--ring", `oklch(0.65 ${c * 0.5} ${t.hue})`)
      root.style.setProperty("--border", `oklch(0.90 ${c * 0.25} ${t.hue})`)
    }

    return () => {
      root.style.removeProperty("--primary")
      root.style.removeProperty("--primary-foreground")
      root.style.removeProperty("--accent")
      root.style.removeProperty("--accent-foreground")
      root.style.removeProperty("--ring")
      root.style.removeProperty("--border")
    }
  }, [activeWord, resolvedTheme])

  function setShaderEnabled(enabled: boolean) {
    setShaderEnabledState(enabled)
    localStorage.setItem("shader-enabled", String(enabled))
  }

  function setSoundEnabled(enabled: boolean) {
    setSoundEnabledState(enabled)
    localStorage.setItem("sound-enabled", String(enabled))
  }

  return (
    <GradientWordContext.Provider value={{ activeWord, setActiveWord, shaderEnabled: mounted ? shaderEnabled : true, setShaderEnabled, cursorTrailActive, setCursorTrailActive, soundEnabled: mounted ? soundEnabled : true, setSoundEnabled }}>
      {children}
    </GradientWordContext.Provider>
  )
}

export function useGradientWord() {
  return useContext(GradientWordContext)
}
