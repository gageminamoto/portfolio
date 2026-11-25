import type { Metadata } from "next"
import type { ReactNode } from "react"
import { fetchTools, type ToolsResponse } from "@/lib/notion"
import { PUBLIC_PAGES, pageMetadata } from "@/lib/site"
import { ToolsDataProvider } from "./tools-data-provider"

export const revalidate = 600

export const metadata: Metadata = pageMetadata({
  title: "Tools | Gage Minamoto",
  socialTitle: "Tools",
  description: PUBLIC_PAGES.tools.description,
  path: PUBLIC_PAGES.tools.path,
})

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
