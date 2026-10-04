import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Early design resources · Gage Minamoto",
  description:
    "A curated list for people new to design — essays and practices worth sitting with.",
  openGraph: {
    title: "Early design resources",
    description:
      "A curated list for people new to design — essays and practices worth sitting with.",
  },
}

export default function EarlyDesignLayout({ children }: { children: ReactNode }) {
  return children
}
