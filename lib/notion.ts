import { Client } from "@notionhq/client"
import type {
  BlockObjectResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints"

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

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
  // Fall back to a url-safe version of the title
  return getTitle(page)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
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

  const response = await notion.databases.query({
    database_id: databaseId,
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

  const allPages: PageObjectResponse[] = []
  let cursor: string | undefined = undefined

  do {
    const response = await notion.databases.query({
      database_id: databaseId,
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
    const response = await notion.databases.query({
      database_id: databaseId,
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

  // Fall back: fetch all and match by generated slug
  const allPosts = await fetchAllPosts()
  return allPosts.find((p) => p.slug === slug) ?? null
}

export type NotionBlock = BlockObjectResponse & {
  children?: NotionBlock[]
}

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
