const CLEANSHOT_AFFILIATE_URL = "https://go.cleanshot.com/gage"

function hostnameOf(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return null
  }
}

function isCleanShot(name: string, url: string | null): boolean {
  if (name.trim().toLowerCase() === "cleanshot x") return true
  const host = url ? hostnameOf(url) : null
  return host === "cleanshot.com" || host === "go.cleanshot.com"
}

export function resolveToolLink(
  name: string,
  url: string | null,
  flagged = false,
): { url: string | null; affiliate: boolean } {
  if (isCleanShot(name, url)) {
    return { url: CLEANSHOT_AFFILIATE_URL, affiliate: true }
  }
  return { url, affiliate: flagged }
}

/** Prefer the product domain for favicons when the href is an affiliate short link. */
export function faviconHostname(url: string): string | null {
  const host = hostnameOf(url)
  if (!host) return null
  if (host === "go.cleanshot.com") return "cleanshot.com"
  return host
}

export function toolLinkRel(affiliate: boolean): string {
  return affiliate ? "noopener noreferrer sponsored" : "noopener noreferrer"
}
