import { formatDistanceToNowStrict } from "date-fns"

const GITHUB_USERNAME = "gageminamoto"

interface CommitData {
  hash: string
  additions: number
  deletions: number
  relativeTime: string
  repoName: string
  commitMessage: string
}

function formatRelativeTime(dateStr: string): string {
  const distance = formatDistanceToNowStrict(new Date(dateStr), {
    addSuffix: false,
  })
  // Compact: "3 hours" → "3hrs", "5 minutes" → "5min", "2 days" → "2d"
  return distance
    .replace(/ seconds?/, "s")
    .replace(/ minutes?/, "min")
    .replace(/ hours?/, "hrs")
    .replace(/ days?/, "d")
    .replace(/ months?/, "mo")
    .replace(/ years?/, "yr")
    + " ago"
}

function headers(): HeadersInit {
  const h: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "gageminamoto-portfolio",
  }
  if (process.env.GITHUB_TOKEN) {
    h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }
  return h
}

export interface CommitHistoryItem {
  sha: string
  hash: string
  message: string
  repoName: string
  repoFullName: string
  date: string        // ISO string
  authorName: string
  authorAvatar: string
  url: string         // link to commit on GitHub
  isPush: boolean     // was this the HEAD commit of a push event?
}

export async function fetchCommitHistory(
  limit: number = 30
): Promise<CommitHistoryItem[]> {
  try {
    // Use the events API for activity feed — gives push events across all repos
    const eventsRes = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=100`,
      { headers: headers() }
    )
    if (!eventsRes.ok) {
      console.error(`[github] events fetch failed: ${eventsRes.status}`)
      return []
    }

    const events = await eventsRes.json()
    if (!Array.isArray(events)) return []

    const commits: CommitHistoryItem[] = []

    for (const event of events) {
      if (event.type !== "PushEvent") continue
      const repoName = (event.repo?.name as string)?.split("/")[1] ?? event.repo?.name
      const repoFullName = event.repo?.name as string
      const eventCommits = event.payload?.commits

      if (!Array.isArray(eventCommits)) continue

      for (let i = eventCommits.length - 1; i >= 0; i--) {
        const c = eventCommits[i]
        commits.push({
          sha: c.sha,
          hash: (c.sha as string).slice(0, 7),
          message: (c.message as string)?.split("\n")[0] ?? "",
          repoName,
          repoFullName,
          date: event.created_at as string,
          authorName: c.author?.name ?? event.actor?.display_login ?? GITHUB_USERNAME,
          authorAvatar: event.actor?.avatar_url ?? "",
          url: `https://github.com/${repoFullName}/commit/${c.sha}`,
          isPush: i === eventCommits.length - 1,
        })

        if (commits.length >= limit) break
      }
      if (commits.length >= limit) break
    }

    return commits
  } catch (error) {
    console.error("[github] fetchCommitHistory error:", error)
    return []
  }
}

export async function fetchLatestCommit(): Promise<CommitData | null> {
  try {
    // 1. Get the most recently pushed repo
    const reposRes = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=1`,
      { headers: headers() }
    )
    if (!reposRes.ok) {
      console.error(`[github] repos fetch failed: ${reposRes.status}`)
      return null
    }

    const repos = await reposRes.json()
    if (!Array.isArray(repos) || repos.length === 0) {
      console.error("[github] no public repos found")
      return null
    }

    const repo = repos[0]
    const repoName = repo.full_name as string

    // 2. Get the latest commit on the default branch
    const commitsRes = await fetch(
      `https://api.github.com/repos/${repoName}/commits?per_page=1`,
      { headers: headers() }
    )
    if (!commitsRes.ok) {
      console.error(`[github] commits fetch failed: ${commitsRes.status}`)
      return null
    }

    const commits = await commitsRes.json()
    if (!Array.isArray(commits) || commits.length === 0) {
      console.error("[github] no commits found")
      return null
    }

    const sha = commits[0].sha as string

    // 3. Get full commit detail with stats (additions/deletions)
    const detailRes = await fetch(
      `https://api.github.com/repos/${repoName}/commits/${sha}`,
      { headers: headers() }
    )
    if (!detailRes.ok) {
      console.error(`[github] commit detail fetch failed: ${detailRes.status}`)
      return null
    }

    const detail = await detailRes.json()

    return {
      hash: sha.slice(0, 7),
      additions: detail.stats?.additions ?? 0,
      deletions: detail.stats?.deletions ?? 0,
      relativeTime: formatRelativeTime(
        detail.commit?.committer?.date ?? detail.commit?.author?.date ?? new Date().toISOString()
      ),
      repoName: repo.name as string,
      commitMessage: (detail.commit?.message as string)?.split("\n")[0] ?? "",
    }
  } catch (error) {
    console.error("[github] unexpected error:", error)
    return null
  }
}
