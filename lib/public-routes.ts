import { fetchCachedAllPosts, isWritingConfigured, type NotionWritingPost } from "@/lib/notion"

export async function listPublishedPosts(): Promise<NotionWritingPost[]> {
  if (!isWritingConfigured()) return []

  try {
    return await fetchCachedAllPosts()
  } catch (error) {
    console.error("[public-routes] Failed to list writing posts", error instanceof Error ? error.message : error)
    return []
  }
}
