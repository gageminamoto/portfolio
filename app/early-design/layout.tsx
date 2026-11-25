import type { Metadata } from "next"
import type { ReactNode } from "react"
import { PUBLIC_PAGES, pageMetadata } from "@/lib/site"

export const metadata: Metadata = pageMetadata({
  title: "Early design resources · Gage Minamoto",
  socialTitle: "Early design resources",
  description: PUBLIC_PAGES.earlyDesign.description,
  path: PUBLIC_PAGES.earlyDesign.path,
})

export default function EarlyDesignLayout({ children }: { children: ReactNode }) {
  return children
}
