import { NextRequest, NextResponse } from "next/server"
import sharp from "sharp"

const ALLOWED_HOSTS = [
  "prod-files-secure.s3.us-west-2.amazonaws.com",
  "www.notion.so",
  "images.unsplash.com",
  "s3.us-west-2.amazonaws.com",
]

const MAX_WIDTH = 2400
const DEFAULT_WIDTH = 1200
const DEFAULT_QUALITY = 80

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 })
  }

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 })
  }

  if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 403 })
  }

  const width = Math.min(
    parseInt(searchParams.get("w") || String(DEFAULT_WIDTH), 10) || DEFAULT_WIDTH,
    MAX_WIDTH
  )
  const quality = Math.min(
    Math.max(parseInt(searchParams.get("q") || String(DEFAULT_QUALITY), 10) || DEFAULT_QUALITY, 1),
    100
  )

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10_000)

    const response = await fetch(url, { signal: controller.signal })
    clearTimeout(timeout)

    if (!response.ok) {
      return new NextResponse("Upstream image fetch failed", {
        status: 502,
        headers: { "Cache-Control": "no-store" },
      })
    }

    const buffer = Buffer.from(await response.arrayBuffer())

    const optimized = await sharp(buffer)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toBuffer()

    return new NextResponse(optimized, {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
        "CDN-Cache-Control": "public, max-age=31536000",
      },
    })
  } catch (error) {
    console.error("[api/image] Processing failed:", error)
    return new NextResponse("Image processing failed", {
      status: 500,
      headers: { "Cache-Control": "no-store" },
    })
  }
}
