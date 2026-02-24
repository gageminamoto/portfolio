import { Client } from "@notionhq/client"
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"

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
    throw new Error("NOTION_BLOG_DATABASE_ID environment variable is not set")
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
