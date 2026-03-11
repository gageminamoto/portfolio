export function getOptimizedImageUrl(
  originalUrl: string,
  options?: { width?: number; quality?: number }
): string {
  const params = new URLSearchParams({ url: originalUrl })
  if (options?.width) params.set("w", String(options.width))
  if (options?.quality) params.set("q", String(options.quality))
  return `/api/image?${params.toString()}`
}
