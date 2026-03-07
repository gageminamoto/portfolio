import { NextResponse } from "next/server"
import { fetchTools } from "@/lib/notion"

// Revalidate every 10 minutes
export const revalidate = 600

export async function GET() {
  try {
    const { tools, lastUpdated } = await fetchTools()
    return NextResponse.json({ tools, lastUpdated })
  } catch (error) {
    console.error("[tools/route] Failed to fetch from Notion:", error)
    return NextResponse.json(
      { tools: [], lastUpdated: null, error: "Failed to fetch tools" },
      { status: 500 }
    )
  }
}
