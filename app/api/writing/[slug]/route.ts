import { NextResponse } from "next/server"
import {
  fetchPostBySlug,
  fetchPostBlocks,
  fetchCachedAllPosts,
} from "@/lib/notion"

export const revalidate = 600

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const allPosts = await fetchCachedAllPosts()
    const post = allPosts.find((item) => item.slug === slug) ?? await fetchPostBySlug(slug)

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      )
    }

    const blocks = await fetchPostBlocks(post.id)

    return NextResponse.json({ post, blocks, allPosts })
  } catch (error) {
    console.error(
      "[writing/[slug]/route] Failed to fetch article:",
      error instanceof Error ? error.message : "Unknown error"
    )
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    )
  }
}
