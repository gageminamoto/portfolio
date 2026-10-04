import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Early design resources · Gage Minamoto",
  description: "A short reading list for people new to design.",
  openGraph: {
    title: "Early design resources",
    description: "A short reading list for people new to design.",
  },
}

export default function EarlyDesignLayout({ children }: { children: ReactNode }) {
  return children
}
