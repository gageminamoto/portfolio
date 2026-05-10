"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type WorkHoverContextValue = {
  hoveredWorkId: string | null
  setHoveredWorkId: (id: string | null) => void
}

const WorkHoverContext = createContext<WorkHoverContextValue | undefined>(undefined)

export function WorkHoverProvider({ children }: { children: ReactNode }) {
  const [hoveredWorkId, setHoveredWorkId] = useState<string | null>(null)
  return (
    <WorkHoverContext.Provider value={{ hoveredWorkId, setHoveredWorkId }}>
      {children}
    </WorkHoverContext.Provider>
  )
}

export function useWorkHover() {
  const ctx = useContext(WorkHoverContext)
  return ctx ?? { hoveredWorkId: null, setHoveredWorkId: () => {} }
}

export function workItemElementId(name: string) {
  return `work-${name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-")}`
}
