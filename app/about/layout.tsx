import type { Metadata } from "next"
import type { ReactNode } from "react"
import { PUBLIC_PAGES, pageMetadata } from "@/lib/site"

export const metadata: Metadata = pageMetadata({
  title: "About | Gage Minamoto",
  socialTitle: "About",
  description: PUBLIC_PAGES.about.description,
  path: PUBLIC_PAGES.about.path,
})

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children
}
