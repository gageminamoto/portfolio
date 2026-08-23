import type { ReactNode } from "react"
import { fetchTools, type ToolsResponse } from "@/lib/notion"
import { ToolsDataProvider } from "./tools-data-provider"

export const revalidate = 600

const emptyTools: ToolsResponse = { tools: [], lastUpdated: null }

export default async function ToolsLayout({ children }: { children: ReactNode }) {
  let initialData = emptyTools

  try {
    initialData = await fetchTools()
  } catch {
    // The page's client-side request remains available as a fallback.
  }

  return (
    <ToolsDataProvider initialData={initialData}>
      {children}
    </ToolsDataProvider>
  )
}
