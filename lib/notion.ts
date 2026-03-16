import { Client } from "@notionhq/client"
import type {
  BlockObjectResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints"

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
  notionVersion: "2025-09-03",
})

const dataSourceCache = new Map<string, string>()

async function resolveDataSourceId(databaseId: string): Promise<string> {
  const cached = dataSourceCache.get(databaseId)
  if (cached) return cached

  const db = await notion.databases.retrieve({ database_id: databaseId })
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

function getTitle(page: PageObjectResponse): string {
  const titleProp = Object.values(page.properties).find(
    (p) => p.type === "title"
  )
  if (!titleProp || titleProp.type !== "title") return "Untitled"
  return titleProp.title.map((t) => t.plain_text).join("") || "Untitled"
}

function getSlug(page: PageObjectResponse): string {
  const slugProp = page.properties["Slug"]
  if (slugProp?.type === "rich_text") {
    return slugProp.rich_text.map((t) => t.plain_text).join("") || page.id
  }
  // Fall back to the page ID for a stable slug that survives title changes
  return page.id
}

function getDate(page: PageObjectResponse): string | null {
  const dateProp = page.properties["Date"] ?? page.properties["Published"]
  if (dateProp?.type === "date") return dateProp.date?.start ?? null
  const createdProp = page.properties["Created time"]
  if (createdProp?.type === "created_time") return createdProp.created_time
  return page.created_time ?? null
}

export async function fetchLatestPosts(limit = 3): Promise<NotionWritingPost[]> {
  const databaseId = process.env.NOTION_BLOG_DATABASE_ID

  if (!databaseId) {
    warnMissingDatabaseId()
    return []
  }

  const dataSourceId = await resolveDataSourceId(databaseId)
  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    page_size: limit,
    sorts: [
      {
        timestamp: "created_time",
        direction: "descending",
      },
    ],
  })

  return (response.results as PageObjectResponse[]).map((page) => ({
    id: page.id,
    title: getTitle(page),
    slug: getSlug(page),
    date: getDate(page),
    url: page.url,
  }))
}

export async function fetchAllPosts(): Promise<NotionWritingPost[]> {
  const databaseId = process.env.NOTION_BLOG_DATABASE_ID

  if (!databaseId) {
    warnMissingDatabaseId()
    return []
  }

  const dataSourceId = await resolveDataSourceId(databaseId)
  const allPages: PageObjectResponse[] = []
  let cursor: string | undefined = undefined

  do {
    const response = await notion.dataSources.query({
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

  return allPages.map((page) => ({
    id: page.id,
    title: getTitle(page),
    slug: getSlug(page),
    date: getDate(page),
    url: page.url,
  }))
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
    const response = await notion.dataSources.query({
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
  } catch {
    // Slug property doesn't exist in this database — fall through to title-based matching
  }

  // Fall back: try fetching by page ID directly (slug is the page ID)
  try {
    const page = (await notion.pages.retrieve({
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

export type NotionBlock = BlockObjectResponse & {
  children?: NotionBlock[]
}

// ─── Tools ───────────────────────────────────────────────────────────

export type ToolCategory = "Build" | "Productivity" | "Skills"

export interface NotionToolItem {
  id: string
  name: string
  url: string | null
  description: string
  category: ToolCategory
  lastEdited: string
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
  if (catProp?.type === "select" && catProp.select?.name) {
    return catProp.select.name as ToolCategory
  }
  return "Build"
}

function getOrder(page: PageObjectResponse): number {
  const orderProp = page.properties["Order"]
  if (orderProp?.type === "number" && orderProp.number != null) {
    return orderProp.number
  }
  return 999
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
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      start_cursor: cursor,
      sorts: [
        { property: "Category", direction: "ascending" },
        { property: "Order", direction: "ascending" },
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

    return {
      id: page.id,
      name: getTitle(page),
      url: getUrl(page),
      description: getDescription(page),
      category: getCategory(page),
      lastEdited: edited,
    }
  })

  return { tools, lastUpdated: latestEdit }
}

// ─── Post Blocks ─────────────────────────────────────────────────────

export async function fetchPostBlocks(
  pageId: string
): Promise<NotionBlock[]> {
  const blocks: NotionBlock[] = []
  let cursor: string | undefined = undefined

  do {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
      page_size: 100,
    })

    for (const block of response.results as BlockObjectResponse[]) {
      const notionBlock: NotionBlock = { ...block }

      if (block.has_children) {
        notionBlock.children = await fetchPostBlocks(block.id)
      }

      blocks.push(notionBlock)
    }

    cursor = response.has_more ? response.next_cursor ?? undefined : undefined
  } while (cursor)

  return blocks
}
