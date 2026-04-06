/** Returns a Google favicon service URL for a given site URL, or undefined if no URL. */
export function faviconUrl(siteUrl?: string, size = 64): string | undefined {
  if (!siteUrl) return undefined
  try {
    const domain = new URL(siteUrl).hostname
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`
  } catch {
    return undefined
  }
}
