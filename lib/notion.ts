import { Client } from "@notionhq/client"
import { unstable_cache } from "next/cache"
import type {
  BlockObjectResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints"
import { resolveToolLink } from "./affiliate-links"
import { getImageDimensions, type ImageDimensions } from "./image-metadata"
import { displayWritingTitle } from "./writing-display"
import { slugify } from "./utils"
import {
  earlyDesignResources,
  normalizeExternalUrl,
  type EarlyDesignResource,
} from "./early-design-resources"

let notionClient: Client | null = null

function getNotionClient(): Client {
  if (!notionClient) {
    notionClient = new Client({
      auth: process.env.NOTION_API_KEY,
      notionVersion: "2025-09-03",
      // Avoid holding a route's loading UI forever when Notion is unavailable.
      timeoutMs: 8_000,
    })
  }

  return notionClient
}

function logNotionError(operation: string, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`[notion] ${operation} failed: ${message}`)
}

export function isWritingConfigured(): boolean {
  return Boolean(process.env.NOTION_API_KEY && process.env.NOTION_BLOG_DATABASE_ID)
}

const dataSourceCache = new Map<string, string>()

async function resolveDataSourceId(databaseId: string): Promise<string> {
  const cached = dataSourceCache.get(databaseId)
  if (cached) return cached

  const db = await getNotionClient().databases.retrieve({ database_id: databaseId })
  const dsId = "data_sources" in db ? db.data_sources[0]?.id : undefined
  if (!dsId) {
    throw new Error(`No data source found for database ${databaseId}`)
  }
  dataSourceCache.set(databaseId, dsId)
  return dsId
}

export interface NotionWritingPost {
  id: string
  title: string
  slug: string
  date: string | null
  url: string
}

let _warnedMissingDbId = false

function warnMissingDatabaseId(): void {
  if (!_warnedMissingDbId) {
    console.warn(
      "[notion] NOTION_BLOG_DATABASE_ID is not set — Notion writing features are disabled"
    )
    _warnedMissingDbId = true
  }
}

function getRawTitle(page: PageObjectResponse): string {
  const titleProp = Object.values(page.properties).find(
    (p) => p.type === "title"
  )
  if (!titleProp || titleProp.type !== "title") return "Untitled"
  return titleProp.title.map((t) => t.plain_text).join("") || "Untitled"
}

function getTitle(page: PageObjectResponse): string {
  return displayWritingTitle(getRawTitle(page))
}

function getSlug(page: PageObjectResponse): string {
  const slugProp = page.properties["Slug"]
  if (slugProp?.type === "rich_text") {
    const explicit = slugProp.rich_text.map((t) => t.plain_text).join("")
    if (explicit) return explicit
  }
  return slugify(getRawTitle(page))
}

function deduplicateSlugs(posts: NotionWritingPost[]): NotionWritingPost[] {
  const slugCount = new Map<string, number>()
  for (const post of posts) {
    slugCount.set(post.slug, (slugCount.get(post.slug) ?? 0) + 1)
  }
  return posts.map((post) => {
    if ((slugCount.get(post.slug) ?? 0) > 1) {
      return { ...post, slug: `${post.slug}-${post.id.slice(0, 8)}` }
    }
    return post
  })
}

function getDate(page: PageObjectResponse): string | null {
  const dateProp = page.properties["Date"] ?? page.properties["Published"]
  if (dateProp?.type === "date") return dateProp.date?.start ?? null
  const createdProp = page.properties["Created time"]
  if (createdProp?.type === "created_time") return createdProp.created_time
  return page.created_time ?? null
}

function mapWritingPosts(pages: PageObjectResponse[]): NotionWritingPost[] {
  return deduplicateSlugs(
    pages.map((page) => ({
      id: page.id,
      title: getTitle(page),
      slug: getSlug(page),
      date: getDate(page),
      url: page.url,
    }))
  )
}

async function fetchAllWritingPostsForDatabase(
  databaseId: string
): Promise<NotionWritingPost[]> {
  const dataSourceId = await resolveDataSourceId(databaseId)
  const allPages: PageObjectResponse[] = []
  let cursor: string | undefined = undefined

  do {
    const response = await getNotionClient().dataSources.query({
      data_source_id: dataSourceId,
      start_cursor: cursor,
      sorts: [
        {
          timestamp: "created_time",
          direction: "descending",
        },
      ],
    })
    allPages.push(...(response.results as PageObjectResponse[]))
    cursor = response.has_more ? response.next_cursor ?? undefined : undefined
  } while (cursor)

  return mapWritingPosts(allPages)
}

export async function fetchLatestPosts(limit = 3): Promise<NotionWritingPost[]> {
  const databaseId = process.env.NOTION_BLOG_DATABASE_ID

  if (!databaseId) {
    warnMissingDatabaseId()
    return []
  }

  const posts = await fetchAllWritingPostsForDatabase(databaseId)
  return posts.slice(0, limit)
}

export async function fetchAllPosts(): Promise<NotionWritingPost[]> {
  const databaseId = process.env.NOTION_BLOG_DATABASE_ID

  if (!databaseId) {
    warnMissingDatabaseId()
    return []
  }

  return fetchAllWritingPostsForDatabase(databaseId)
}

const getCachedAllPosts = unstable_cache(
  async () => fetchAllPosts(),
  ["notion-writing-posts"],
  { revalidate: 600, tags: ["notion-writing"] }
)

export async function fetchCachedAllPosts(): Promise<NotionWritingPost[]> {
  return getCachedAllPosts()
}

export async function fetchPostBySlug(
  slug: string
): Promise<NotionWritingPost | null> {
  const databaseId = process.env.NOTION_BLOG_DATABASE_ID

  if (!databaseId) {
    warnMissingDatabaseId()
    return null
  }

  // Try filtering by Slug property first (only if the property exists in the DB)
  try {
    const dataSourceId = await resolveDataSourceId(databaseId)
    const response = await getNotionClient().dataSources.query({
      data_source_id: dataSourceId,
      filter: {
        property: "Slug",
        rich_text: {
          equals: slug,
        },
      },
      page_size: 1,
    })

    if (response.results.length > 0) {
      const page = response.results[0] as PageObjectResponse
      return {
        id: page.id,
        title: getTitle(page),
        slug: getSlug(page),
        date: getDate(page),
        url: page.url,
      }
    }
  } catch (error) {
    // Slug property doesn't exist in this database — fall through to title-based matching
    logNotionError("query post by slug", error)
  }

  // Try matching by computed slug (title-derived)
  const allPosts = await fetchAllPosts()
  const matched = allPosts.find((p) => p.slug === slug)
  if (matched) return matched

  // Fall back: try fetching by page ID directly (backward compat for old UUID URLs)
  try {
    const page = (await getNotionClient().pages.retrieve({
      page_id: slug,
    })) as PageObjectResponse
    return {
      id: page.id,
      title: getTitle(page),
      slug: getSlug(page),
      date: getDate(page),
      url: page.url,
    }
  } catch {
    return null
  }
}

/** Resolve a writing post by slug, using the cached list first then a live Notion lookup. */
export async function resolveWritingPostBySlug(slug: string): Promise<{
  post: NotionWritingPost | null
  allPosts: NotionWritingPost[]
}> {
  const allPosts = await fetchCachedAllPosts()
  const post =
    allPosts.find((item) => item.slug === slug) ?? (await fetchPostBySlug(slug))
  return { post, allPosts }
}

export type NotionBlock = BlockObjectResponse & {
  children?: NotionBlock[]
  imageDimensions?: ImageDimensions
}

// ─── Tools ───────────────────────────────────────────────────────────

export type ToolCategory = string

export interface NotionToolItem {
  id: string
  name: string
  url: string | null
  description: string
  category: ToolCategory
  lastEdited: string
  affiliate: boolean
}

export interface ToolsResponse {
  tools: NotionToolItem[]
  lastUpdated: string | null
}

function getUrl(page: PageObjectResponse): string | null {
  const urlProp = page.properties["URL"]
  if (urlProp?.type === "url") return urlProp.url
  return null
}

function getDescription(page: PageObjectResponse): string {
  const descProp = page.properties["Description"]
  if (descProp?.type === "rich_text") {
    return descProp.rich_text.map((t) => t.plain_text).join("") || ""
  }
  return ""
}

function getCategory(page: PageObjectResponse): ToolCategory {
  const catProp = page.properties["Category"]
  if (catProp?.type === "select") {
    const category = catProp.select?.name?.trim()
    if (category) return category
  }
  return "Build"
}

function getAffiliateFlag(page: PageObjectResponse): boolean {
  const prop = page.properties["Affiliate"]
  if (prop?.type === "checkbox") return prop.checkbox
  return false
}

export async function fetchTools(): Promise<ToolsResponse> {
  const databaseId = process.env.NOTION_TOOLS_DATABASE_ID

  if (!databaseId) {
    console.warn("[notion] NOTION_TOOLS_DATABASE_ID is not set — tools feature is disabled")
    return { tools: [], lastUpdated: null }
  }

  const dataSourceId = await resolveDataSourceId(databaseId)
  const allPages: PageObjectResponse[] = []
  let cursor: string | undefined = undefined

  do {
    const response = await getNotionClient().dataSources.query({
      data_source_id: dataSourceId,
      start_cursor: cursor,
      sorts: [
        { property: "Category", direction: "ascending" },
      ],
    })
    allPages.push(...(response.results as PageObjectResponse[]))
    cursor = response.has_more ? response.next_cursor ?? undefined : undefined
  } while (cursor)

  let latestEdit: string | null = null

  const tools: NotionToolItem[] = allPages.map((page) => {
    const edited = page.last_edited_time
    if (!latestEdit || edited > latestEdit) {
      latestEdit = edited
    }

    const name = getTitle(page)
    const { url, affiliate } = resolveToolLink(
      name,
      getUrl(page),
      getAffiliateFlag(page),
    )

    return {
      id: page.id,
      name,
      url,
      description: getDescription(page),
      category: getCategory(page),
      lastEdited: edited,
      affiliate,
    }
  })

  return { tools, lastUpdated: latestEdit }
}

// ─── Early design resources ──────────────────────────────────────────
// Expected Notion schema: Title (title), URL (url), Note (rich text),
// Order (number), Published (checkbox).

export interface NotionEarlyDesignResource {
  id: string
  title: string
  url?: string
  note?: string
}

export function isEarlyDesignConfigured(): boolean {
  return Boolean(process.env.NOTION_API_KEY && process.env.NOTION_EARLY_DESIGN_DB_ID)
}

function getEarlyDesignTitle(page: PageObjectResponse): string {
  const titleProp = Object.values(page.properties).find((p) => p.type === "title")
  if (!titleProp || titleProp.type !== "title") return ""
  return titleProp.title.map((t) => t.plain_text).join("").trim()
}

function getNote(page: PageObjectResponse): string | undefined {
  const noteProp = page.properties["Note"]
  if (noteProp?.type === "rich_text") {
    const note = noteProp.rich_text.map((t) => t.plain_text).join("").trim()
    if (note) return note
  }
  return undefined
}

function getOrder(page: PageObjectResponse): number | null {
  const orderProp = page.properties["Order"]
  if (orderProp?.type === "number" && typeof orderProp.number === "number") {
    return orderProp.number
  }
  return null
}

function isPublishedResource(page: PageObjectResponse): boolean {
  const prop = page.properties["Published"]
  if (prop?.type === "checkbox") return prop.checkbox
  return true
}

function mapEarlyDesignResource(
  page: PageObjectResponse
): (NotionEarlyDesignResource & { order: number | null }) | null {
  const title = getEarlyDesignTitle(page)
  if (!title) return null

  const url = normalizeExternalUrl(getUrl(page))
  const note = getNote(page)

  return {
    id: page.id,
    title,
    ...(url ? { url } : {}),
    ...(note ? { note } : {}),
    order: getOrder(page),
  }
}

async function queryEarlyDesignPages(
  dataSourceId: string,
  options: { filterPublished: boolean; sortByOrder: boolean }
): Promise<PageObjectResponse[]> {
  const allPages: PageObjectResponse[] = []
  let cursor: string | undefined = undefined

  do {
    const response = await getNotionClient().dataSources.query({
      data_source_id: dataSourceId,
      start_cursor: cursor,
      ...(options.filterPublished
        ? {
            filter: {
              property: "Published",
              checkbox: { equals: true },
            },
          }
        : {}),
      sorts: options.sortByOrder
        ? [{ property: "Order", direction: "ascending" as const }]
        : [{ timestamp: "created_time", direction: "ascending" as const }],
    })
    allPages.push(...(response.results as PageObjectResponse[]))
    cursor = response.has_more ? response.next_cursor ?? undefined : undefined
  } while (cursor)

  return allPages
}

export async function fetchEarlyDesignResources(): Promise<
  NotionEarlyDesignResource[]
> {
  const databaseId = process.env.NOTION_EARLY_DESIGN_DB_ID

  if (!databaseId) {
    console.warn(
      "[notion] NOTION_EARLY_DESIGN_DB_ID is not set — using fallback early design resources"
    )
    return []
  }

  const dataSourceId = await resolveDataSourceId(databaseId)

  let pages: PageObjectResponse[]
  try {
    pages = await queryEarlyDesignPages(dataSourceId, {
      filterPublished: true,
      sortByOrder: true,
    })
  } catch (error) {
    logNotionError("query early design with Published/Order", error)
    pages = await queryEarlyDesignPages(dataSourceId, {
      filterPublished: false,
      sortByOrder: false,
    })
  }

  const mapped = pages
    .filter(isPublishedResource)
    .map(mapEarlyDesignResource)
    .filter((item): item is NotionEarlyDesignResource & { order: number | null } =>
      item !== null
    )
    .sort((a, b) => {
      if (a.order == null && b.order == null) return 0
      if (a.order == null) return 1
      if (b.order == null) return -1
      return a.order - b.order
    })

  return mapped.map(({ order: _order, ...resource }) => resource)
}

const getCachedEarlyDesignResources = unstable_cache(
  async () => fetchEarlyDesignResources(),
  ["notion-early-design-resources"],
  { revalidate: 600, tags: ["notion-early-design"] }
)

export async function fetchCachedEarlyDesignResources(): Promise<
  NotionEarlyDesignResource[]
> {
  return getCachedEarlyDesignResources()
}

/** Notion list when configured; otherwise the hard-coded fallback. */
export async function getEarlyDesignResources(): Promise<EarlyDesignResource[]> {
  if (!isEarlyDesignConfigured()) {
    return earlyDesignResources
  }

  try {
    return await fetchCachedEarlyDesignResources()
  } catch (error) {
    logNotionError("fetch early design resources", error)
    return earlyDesignResources
  }
}

// ─── Post Blocks ─────────────────────────────────────────────────────

export async function fetchPostBlocks(
  pageId: string
): Promise<NotionBlock[]> {
  const blocks: NotionBlock[] = []
  let cursor: string | undefined = undefined

  do {
    const response = await getNotionClient().blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
      page_size: 100,
    })

    const pageBlocks = await Promise.all(
      (response.results as BlockObjectResponse[]).map(async (block) => {
        try {
          const notionBlock: NotionBlock = { ...block }
          if (block.type === "image") {
            const src =
              block.image.type === "external"
                ? block.image.external.url
                : block.image.file.url
            notionBlock.imageDimensions = await getImageDimensions(src)
          }
          if (block.has_children) {
            notionBlock.children = await fetchPostBlocks(block.id)
          }
          return notionBlock
        } catch (error) {
          logNotionError(`process block ${block.id}`, error)
          return null
        }
      })
    )
    blocks.push(...pageBlocks.filter((block): block is NotionBlock => block !== null))

    cursor = response.has_more ? response.next_cursor ?? undefined : undefined
  } while (cursor)

  return blocks
}
