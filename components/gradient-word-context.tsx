"use client"

import { createContext, useContext, useEffect, useState } from "react"

const GradientWordContext = createContext<{
  activeWord: string
  setActiveWord: (word: string) => void
  shaderEnabled: boolean
  setShaderEnabled: (enabled: boolean) => void
  cursorTrailActive: boolean
  setCursorTrailActive: (active: boolean) => void
}>({ activeWord: "software", setActiveWord: () => {}, shaderEnabled: true, setShaderEnabled: () => {}, cursorTrailActive: false, setCursorTrailActive: () => {} })

export function GradientWordProvider({ children }: { children: React.ReactNode }) {
  const [activeWord, setActiveWord] = useState("software")
  const [shaderEnabled, setShaderEnabledState] = useState(true)
  const [cursorTrailActive, setCursorTrailActive] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("shader-enabled")
    if (stored === "false") setShaderEnabledState(false)
    setMounted(true)
  }, [])

  function setShaderEnabled(enabled: boolean) {
    setShaderEnabledState(enabled)
    localStorage.setItem("shader-enabled", String(enabled))
  }

  return (
    <GradientWordContext.Provider value={{ activeWord, setActiveWord, shaderEnabled: mounted ? shaderEnabled : true, setShaderEnabled, cursorTrailActive, setCursorTrailActive }}>
      {children}
    </GradientWordContext.Provider>
  )
}

export function useGradientWord() {
  return useContext(GradientWordContext)
}
