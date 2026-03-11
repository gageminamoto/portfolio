import { NextResponse } from "next/server"
import {
  fetchPostBySlug,
  fetchPostBlocks,
  fetchAllPosts,
} from "@/lib/notion"

export const revalidate = 600

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const post = await fetchPostBySlug(slug)

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      )
    }

    const [blocks, allPosts] = await Promise.all([
      fetchPostBlocks(post.id),
      fetchAllPosts(),
    ])

    return NextResponse.json({ post, blocks, allPosts })
  } catch (error) {
    console.error("[writing/[slug]/route] Failed to fetch article:", error)
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    )
  }
}
