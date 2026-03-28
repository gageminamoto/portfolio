"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useMounted } from "@/hooks/use-mounted"

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
  const mounted = useMounted()

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
