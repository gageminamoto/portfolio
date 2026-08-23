import { LayoutOne } from "@/components/layouts/layout-one"
import { fetchLatestPosts } from "@/lib/notion"

export const revalidate = 600

export default async function Page() {
  let initialPosts

  try {
    initialPosts = await fetchLatestPosts(5)
  } catch {
    // The client-side request remains available as a fallback.
  }

  return <LayoutOne initialPosts={initialPosts} />
}
