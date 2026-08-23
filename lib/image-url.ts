export const ALLOWED_IMAGE_HOSTS = [
  "prod-files-secure.s3.us-west-2.amazonaws.com",
  "www.notion.so",
  "images.unsplash.com",
  "s3.us-west-2.amazonaws.com",
] as const

export function isAllowedImageUrl(url: URL): boolean {
  return ALLOWED_IMAGE_HOSTS.some((hostname) => hostname === url.hostname)
}

export function getOptimizedImageUrl(
  originalUrl: string,
  options?: { width?: number; quality?: number }
): string {
  const params = new URLSearchParams({ url: originalUrl })
  if (options?.width) params.set("w", String(options.width))
  if (options?.quality) params.set("q", String(options.quality))
  return `/api/image?${params.toString()}`
}
