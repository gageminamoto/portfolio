import { NextResponse } from "next/server"
import { fetchCommitHistory } from "@/lib/github"

export const dynamic = "force-dynamic"
export const revalidate = 600

export async function GET() {
  try {
    console.log("[v0] /api/commits/history called")
    const commits = await fetchCommitHistory(30)
    console.log("[v0] /api/commits/history returned", commits.length, "commits")
    return NextResponse.json({ commits })
  } catch (error) {
    console.error("[commits/history] Failed to fetch:", error)
    return NextResponse.json(
      { commits: [], error: "Failed to fetch commit history" },
      { status: 500 }
    )
  }
}
