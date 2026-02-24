import { NextResponse } from "next/server"
import { fetchCommitHistory } from "@/lib/github"

// Revalidate every 10 minutes
export const revalidate = 600

export async function GET() {
  try {
    const commits = await fetchCommitHistory(30)
    return NextResponse.json({ commits })
  } catch (error) {
    console.error("[commits/history] Failed to fetch:", error)
    return NextResponse.json(
      { commits: [], error: "Failed to fetch commit history" },
      { status: 500 }
    )
  }
}
