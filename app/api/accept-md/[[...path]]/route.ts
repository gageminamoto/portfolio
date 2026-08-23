import { type NextRequest, NextResponse } from "next/server"
import {
  getMarkdownForPath,
  type GetMarkdownOptions,
  type NextMarkdownConfig,
} from "accept-md-runtime"

const markdownCache: NonNullable<GetMarkdownOptions["cache"]> = new Map()
const markdownConfig: NextMarkdownConfig = {
  include: ["/**"],
  exclude: ["/api/**", "/_next/**"],
  cleanSelectors: [
    "head",
    "title",
    "footer",
    ".no-markdown",
    "[data-no-markdown]",
    "script",
    "style",
  ],
  cache: true,
  maxCacheEntries: 250,
  fetchTimeoutMs: 10_000,
}

interface MarkdownRouteContext {
  params: Promise<{ path?: string[] }>
}

export async function GET(
  request: NextRequest,
  { params }: MarkdownRouteContext
) {
  const { path = [] } = await params
  const pathname = `/${path.join("/")}`
  const headers = new Headers(request.headers)
  headers.delete("accept")

  try {
    const markdown = await getMarkdownForPath({
      pathname,
      baseUrl: markdownConfig.baseUrl ?? request.nextUrl.origin,
      config: markdownConfig,
      cache: markdownConfig.cache === false ? undefined : markdownCache,
      headers,
    })

    return new NextResponse(markdown, {
      headers: {
        "Cache-Control":
          markdownConfig.cache === false
            ? "no-store"
            : "public, s-maxage=60, stale-while-revalidate",
        "Content-Type": "text/markdown; charset=utf-8",
        Vary: "Accept",
      },
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Markdown generation failed"
    const status = /Failed to fetch page: 404/.test(message) ? 404 : 500

    return NextResponse.json({ error: message }, { status })
  }
}
