import { NextResponse } from "next/server"
import { fetchLatestCommit } from "@/lib/github"

// Revalidate every 10 minutes
export const revalidate = 600

export async function GET() {
  try {
    const commit = await fetchLatestCommit()
    return NextResponse.json({ commit })
  } catch (error) {
    console.error("[commits/route] Failed to fetch from GitHub:", error)
    return NextResponse.json(
      { commit: null, error: "Failed to fetch commit data" },
      { status: 500 }
    )
  }
}
