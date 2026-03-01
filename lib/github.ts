import { formatDistanceToNowStrict } from "date-fns"

const GITHUB_USERNAME = "gageminamoto"

// Add org/collab repos here that won't show up in the user's public repos list
// Format: "owner/repo"
const EXTRA_REPOS = (process.env.GITHUB_EXTRA_REPOS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter((s) => s.includes("/") && !s.startsWith("ghp_") && !s.startsWith("github_pat_"))

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
  isPrivate: boolean  // private repo — don't link externally
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
    console.log("[v0] events response type:", typeof events, "isArray:", Array.isArray(events), "length:", Array.isArray(events) ? events.length : "N/A")
    if (!Array.isArray(events)) return []

    const eventTypes = events.slice(0, 10).map((e: { type: string }) => e.type)
    console.log("[v0] first 10 event types:", eventTypes)

    const commits: CommitHistoryItem[] = []

    // Build a set of private repo full_names for lookup
    const privateRepoNames = new Set<string>()

    // If authenticated, fetch user's private repos to know which events are private
    if (process.env.GITHUB_TOKEN) {
      const privateReposRes = await fetch(
        `https://api.github.com/user/repos?visibility=private&per_page=100&sort=pushed`,
        { headers: headers() }
      )
      if (privateReposRes.ok) {
        const privateRepos = await privateReposRes.json()
        if (Array.isArray(privateRepos)) {
          for (const r of privateRepos) {
            privateRepoNames.add(r.full_name as string)
          }
        }
      }
    }

    for (const event of events) {
      if (event.type !== "PushEvent") continue
      const repoName = (event.repo?.name as string)?.split("/")[1] ?? event.repo?.name
      const repoFullName = event.repo?.name as string
      const isPrivate = privateRepoNames.has(repoFullName)
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
          url: isPrivate ? "" : `https://github.com/${repoFullName}/commit/${c.sha}`,
          isPush: i === eventCommits.length - 1,
          isPrivate,
        })

        if (commits.length >= limit) break
      }
      if (commits.length >= limit) break
    }

    // Fetch from repos API to supplement events (gets full history + private repos)
    console.log("[v0] fetching commits from repos API")

    // Build a list of all repos: public + private (authenticated) + extra
    const allRepos: { full_name: string; name: string; isPrivate: boolean }[] = []

    // Public repos
    const publicReposRes = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=5`,
      { headers: headers() }
    )
    if (publicReposRes.ok) {
      const repos = await publicReposRes.json()
      if (Array.isArray(repos)) {
        for (const repo of repos) {
          allRepos.push({ full_name: repo.full_name, name: repo.name, isPrivate: false })
        }
      }
    }

    // Private repos (requires authenticated token)
    if (process.env.GITHUB_TOKEN) {
      for (const repoFullName of privateRepoNames) {
        if (!allRepos.some((r) => r.full_name === repoFullName)) {
          const name = repoFullName.split("/")[1] ?? repoFullName
          allRepos.push({ full_name: repoFullName, name, isPrivate: true })
        }
      }
    }

    // Add extra repos (org repos, collab repos)
    for (const extra of EXTRA_REPOS) {
      const name = extra.split("/")[1] ?? extra
      if (!allRepos.some((r) => r.full_name === extra)) {
        allRepos.push({ full_name: extra, name, isPrivate: false })
      }
    }

    console.log("[v0] repos to fetch:", allRepos.map((r) => `${r.full_name}${r.isPrivate ? " (private)" : ""}`))

    // Fetch commits from each repo, filtering by author
    const perRepo = Math.max(Math.ceil(limit / allRepos.length), 6)
    for (const repo of allRepos) {
      const commitsRes = await fetch(
        `https://api.github.com/repos/${repo.full_name}/commits?author=${GITHUB_USERNAME}&per_page=${perRepo}`,
        { headers: headers() }
      )
      if (!commitsRes.ok) {
        console.log("[v0] failed to fetch commits for", repo.full_name, commitsRes.status)
        continue
      }
      const repoCommits = await commitsRes.json()
      if (!Array.isArray(repoCommits)) continue

      for (const c of repoCommits) {
        // Deduplicate by sha (events API may have already added it)
        if (commits.some((existing) => existing.sha === c.sha)) continue

        commits.push({
          sha: c.sha,
          hash: (c.sha as string).slice(0, 7),
          message: (c.commit?.message as string)?.split("\n")[0] ?? "",
          repoName: repo.name,
          repoFullName: repo.full_name,
          date: c.commit?.committer?.date ?? c.commit?.author?.date ?? "",
          authorName: c.commit?.author?.name ?? GITHUB_USERNAME,
          authorAvatar: c.author?.avatar_url ?? "",
          url: repo.isPrivate ? "" : (c.html_url ?? `https://github.com/${repo.full_name}/commit/${c.sha}`),
          isPush: false,
          isPrivate: repo.isPrivate,
        })
      }
    }

    // Sort all commits by date descending
    commits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    console.log("[v0] total commits returned:", commits.length)
    return commits.slice(0, limit)
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
