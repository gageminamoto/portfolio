import "server-only"

import sharp from "sharp"
import { isAllowedImageUrl } from "./image-url"

export interface ImageDimensions {
  width: number
  height: number
}

export async function getImageDimensions(src: string): Promise<ImageDimensions | undefined> {
  let url: URL
  try {
    url = new URL(src)
  } catch {
    return undefined
  }
  if (!isAllowedImageUrl(url)) return undefined

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10_000)

  try {
    const response = await fetch(src, {
      headers: { Range: "bytes=0-65535" },
      signal: controller.signal,
    })
    if (!response.ok) return undefined

    const buffer = Buffer.from(await response.arrayBuffer())
    const { width, height } = await sharp(buffer).metadata()

    if (!width || !height) return undefined
    return { width, height }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.warn(`[image-metadata] Failed to read image dimensions: ${message}`)
    return undefined
  } finally {
    clearTimeout(timeout)
  }
}
