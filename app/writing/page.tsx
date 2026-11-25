import type { Metadata } from "next"
import { fetchCachedAllPosts } from "@/lib/notion"
import { PUBLIC_PAGES, pageMetadata } from "@/lib/site"
import { WritingList } from "./writing-list"

export const revalidate = 600

export const metadata: Metadata = pageMetadata({
  title: "Writing | Gage Minamoto",
  socialTitle: "Writing",
  description: PUBLIC_PAGES.writing.description,
  path: PUBLIC_PAGES.writing.path,
})

export default async function WritingPage() {
  let initialPosts
  try {
    initialPosts = await fetchCachedAllPosts()
  } catch {
    // Falls back to client-side fetch via SWR
  }

  return <WritingList initialPosts={initialPosts} />
}
