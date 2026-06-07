import { NextResponse } from "next/server"
import { fetchCommitHistory } from "@/lib/github"

export const dynamic = "force-dynamic"
export const revalidate = 300

type ActivityStatus = "online" | "recent" | "offline"

interface ActivityResponse {
  status: ActivityStatus
  label: string
  detail: string
  source: string
  url: string | null
  updatedAt: string | null
}

function normalizeStatus(status: string | undefined): ActivityStatus {
  if (status === "online" || status === "recent" || status === "offline") {
    return status
  }
  return "online"
}

function manualActivity(): ActivityResponse | null {
  const label = process.env.ACTIVITY_LABEL?.trim()
  const detail = process.env.ACTIVITY_DETAIL?.trim()

  if (!label && !detail) return null

  return {
    status: normalizeStatus(process.env.ACTIVITY_STATUS),
    label: label ?? "Currently active",
    detail: detail ?? "Making something for the web.",
    source: process.env.ACTIVITY_SOURCE?.trim() || "Manual status",
    url: process.env.ACTIVITY_URL?.trim() || null,
    updatedAt: process.env.ACTIVITY_UPDATED_AT?.trim() || null,
  }
}

function commitActivity(): Promise<ActivityResponse | null> {
  return fetchCommitHistory(1).then((commits) => {
    const latest = commits[0]
    if (!latest) return null

    const date = new Date(latest.date)
    const hoursSinceCommit = Number.isNaN(date.getTime())
      ? Number.POSITIVE_INFINITY
      : (Date.now() - date.getTime()) / (1000 * 60 * 60)

    return {
      status: hoursSinceCommit <= 12 ? "online" : hoursSinceCommit <= 24 * 14 ? "recent" : "offline",
      label: `Working on ${latest.repoName}`,
      detail: latest.message || "Pushing the latest project work.",
      source: "GitHub commit activity",
      url: latest.url,
      updatedAt: latest.date,
    }
  })
}

export async function GET() {
  try {
    const activity = manualActivity() ?? await commitActivity()
    return NextResponse.json({ activity })
  } catch (error) {
    console.error("[activity] Failed to resolve activity:", error)
    return NextResponse.json(
      { activity: null, error: "Failed to fetch activity" },
      { status: 500 }
    )
  }
}
