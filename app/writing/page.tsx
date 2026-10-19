import { fetchCachedAllPosts } from "@/lib/notion"
import { WritingList } from "./writing-list"

export const revalidate = 600

export default async function WritingPage() {
  let initialPosts
  try {
    initialPosts = await fetchCachedAllPosts()
  } catch {
    // Falls back to client-side fetch via SWR
  }

  return <WritingList initialPosts={initialPosts} />
}
