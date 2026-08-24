"use client"

import type { ReactNode } from "react"
import { SWRConfig } from "swr"
import type { ToolsResponse } from "@/lib/notion"

export function ToolsDataProvider({
  children,
  initialData,
}: {
  children: ReactNode
  initialData: ToolsResponse
}) {
  return (
    <SWRConfig value={{ fallback: { "/api/tools": initialData } }}>
      {children}
    </SWRConfig>
  )
}
