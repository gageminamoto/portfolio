import type { MetadataRoute } from "next"
import { listPublishedPosts } from "@/lib/public-routes"
import { PUBLIC_PAGES, absoluteUrl } from "@/lib/site"

export const revalidate = 600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await listPublishedPosts()

  return [
    ...Object.values(PUBLIC_PAGES).map(({ path }) => ({ url: absoluteUrl(path) })),
    ...posts.map((post) => ({
      url: absoluteUrl(`/writing/${post.slug}`),
      ...(post.date ? { lastModified: post.date } : {}),
    })),
  ]
}
