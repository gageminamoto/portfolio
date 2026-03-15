"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { usePathname } from "next/navigation"
import { useGradientWord } from "@/components/gradient-word-context"

export const CHECKLIST_ITEMS = [
  { id: "read-article", label: "Read something I wrote" },
  { id: "visit-about", label: "Find out who I am" },
  { id: "try-theme", label: "Switch up the vibe" },
] as const

export type ChecklistItemId = (typeof CHECKLIST_ITEMS)[number]["id"]

type GradientVariant = "blue" | "violet" | "peach" | null

interface ChecklistState {
  checked: Record<string, boolean>
  achievementUnlocked: boolean
  activeGradient: GradientVariant
}

const defaultState: ChecklistState = {
  checked: Object.fromEntries(CHECKLIST_ITEMS.map((i) => [i.id, false])),
  achievementUnlocked: false,
  activeGradient: null,
}

const STORAGE_KEY = "visitor-checklist"

interface ChecklistContextValue {
  checked: Record<string, boolean>
  toggleItem: (id: string) => void
  markItem: (id: string) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  restart: () => void
  resetKey: number
  progress: { completed: number; total: number }
  isComplete: boolean
  achievementUnlocked: boolean
  activeGradient: GradientVariant
  setActiveGradient: (variant: GradientVariant) => void
  mounted: boolean
}

const ChecklistContext = createContext<ChecklistContextValue>({
  checked: defaultState.checked,
  toggleItem: () => {},
  markItem: () => {},
  isOpen: false,
  setIsOpen: () => {},
  restart: () => {},
  resetKey: 0,
  progress: { completed: 0, total: CHECKLIST_ITEMS.length },
  isComplete: false,
  achievementUnlocked: false,
  activeGradient: null,
  setActiveGradient: () => {},
  mounted: false,
})

function persist(state: ChecklistState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function ChecklistProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ChecklistState>(defaultState)
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [resetKey, setResetKey] = useState(0)
  const pathname = usePathname()
  const { shaderEnabled } = useGradientWord()

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<ChecklistState>
        setState((prev) => ({
          ...prev,
          ...parsed,
          checked: { ...prev.checked, ...parsed.checked },
        }))
      }
    } catch {}
    setMounted(true)
  }, [])

  // Apply gradient to document (only when effects are enabled)
  useEffect(() => {
    if (!mounted) return
    if (state.activeGradient && shaderEnabled) {
      document.documentElement.setAttribute("data-gradient", state.activeGradient)
    } else {
      document.documentElement.removeAttribute("data-gradient")
    }
  }, [state.activeGradient, shaderEnabled, mounted])

  // Auto-detect route visits
  useEffect(() => {
    if (!mounted) return
    if (pathname === "/about") {
      markItem("visit-about")
    } else if (pathname?.startsWith("/writing/") && pathname !== "/writing") {
      markItem("read-article")
    }
  }, [pathname, mounted])

  const updateState = useCallback((updater: (prev: ChecklistState) => ChecklistState) => {
    setState((prev) => {
      const next = updater(prev)
      persist(next)

      // Check if just completed all items
      const completed = Object.values(next.checked).filter(Boolean).length
      if (completed === CHECKLIST_ITEMS.length && !next.achievementUnlocked) {
        const unlocked = { ...next, achievementUnlocked: true }
        persist(unlocked)
        return unlocked
      }

      return next
    })
  }, [])

  const toggleItem = useCallback((id: string) => {
    updateState((prev) => ({
      ...prev,
      checked: { ...prev.checked, [id]: !prev.checked[id] },
    }))
  }, [updateState])

  const markItem = useCallback((id: string) => {
    updateState((prev) => {
      if (prev.checked[id]) return prev
      return { ...prev, checked: { ...prev.checked, [id]: true } }
    })
  }, [updateState])

  const restart = useCallback(() => {
    const fresh: ChecklistState = {
      ...defaultState,
      checked: Object.fromEntries(CHECKLIST_ITEMS.map((i) => [i.id, false])),
    }
    setState(fresh)
    persist(fresh)
    setResetKey((k) => k + 1)
  }, [])

  const setActiveGradient = useCallback((variant: GradientVariant) => {
    updateState((prev) => ({ ...prev, activeGradient: variant }))
  }, [updateState])

  const completed = Object.values(state.checked).filter(Boolean).length
  const total = CHECKLIST_ITEMS.length

  return (
    <ChecklistContext.Provider
      value={{
        checked: state.checked,
        toggleItem,
        markItem,
        isOpen,
        setIsOpen,
        restart,
        resetKey,
        progress: { completed, total },
        isComplete: completed === total,
        achievementUnlocked: state.achievementUnlocked,
        activeGradient: state.activeGradient,
        setActiveGradient,
        mounted,
      }}
    >
      {children}
    </ChecklistContext.Provider>
  )
}

export function useChecklist() {
  return useContext(ChecklistContext)
}
