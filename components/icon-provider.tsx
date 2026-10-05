"use client"

import { SolarProvider } from "@solar-icons/react"

export function IconProvider({ children }: { children: React.ReactNode }) {
  return (
    <SolarProvider value={{ weight: "Bold", color: "currentColor", size: "1em" }}>
      {children}
    </SolarProvider>
  )
}
