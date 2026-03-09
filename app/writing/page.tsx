import { fetchLatestPosts } from "@/lib/notion"
import { WritingList } from "./writing-list"

export const revalidate = 600

export default async function WritingPage() {
  let initialPosts
  try {
    initialPosts = await fetchLatestPosts(10)
  } catch {
    // Falls back to client-side fetch via SWR
  }

  return <WritingList initialPosts={initialPosts} />
}
