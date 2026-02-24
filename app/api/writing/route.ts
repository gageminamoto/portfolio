import { NextResponse } from "next/server"
import { fetchLatestPosts } from "@/lib/notion"

// Revalidate every 10 minutes
export const revalidate = 600

export async function GET() {
  try {
    const posts = await fetchLatestPosts(3)
    return NextResponse.json({ posts })
  } catch (error) {
    console.error("[writing/route] Failed to fetch from Notion:", error)
    return NextResponse.json(
      { error: "Failed to fetch writing posts" },
      { status: 500 }
    )
  }
}
