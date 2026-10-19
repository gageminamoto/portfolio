import { NextResponse } from "next/server"
import { fetchCachedAllPosts } from "@/lib/notion"

// Revalidate every 10 minutes
export const revalidate = 600

export async function GET() {
  try {
    const posts = await fetchCachedAllPosts()
    return NextResponse.json({ posts })
  } catch (error) {
    console.error(
      "[writing/route] Failed to fetch from Notion:",
      error instanceof Error ? error.message : "Unknown error"
    )
    return NextResponse.json(
      { posts: [], error: "Failed to fetch writing posts" },
      { status: 500 }
    )
  }
}
