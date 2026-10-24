import { generateSeedPosts, generateSeedBlocks } from "@/lib/seed-posts"
import type { NotionBlock, NotionWritingPost } from "@/lib/notion"
import { ArticleContentMotion } from "./article-content-motion"

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short", day: "numeric", year: "numeric",
})

function extractHeadings(blocks: NotionBlock[]) {
  return blocks.flatMap((block) => {
    if (block.type === "heading_1" || block.type === "heading_2" || block.type === "heading_3") {
      const richText = block.type === "heading_1"
        ? block.heading_1.rich_text
        : block.type === "heading_2"
          ? block.heading_2.rich_text
          : block.heading_3.rich_text
      const text = richText.map((item) => item.plain_text).join("")
      const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "heading"
      return [{
        id: `${slug}-${block.id.replace(/-/g, "")}`,
        text,
        level: Number(block.type.at(-1)) as 1 | 2 | 3,
      }]
    }
    return []
  })
}

function formatDate(date: string | null): string | null {
  return date ? dateFormatter.format(new Date(date)) : null
}

interface ArticleContentProps {
  slug: string
  from?: string
  post: NotionWritingPost
  blocks: NotionBlock[]
  allPosts: NotionWritingPost[]
}

export function ArticleContent({ slug, from, post, blocks, allPosts }: ArticleContentProps) {
  const isSeed = slug.startsWith("seed-")
  const articleBlocks = isSeed ? generateSeedBlocks() : blocks
  const posts = isSeed ? [...allPosts, ...generateSeedPosts(5)] : allPosts
  const index = posts.findIndex((entry) => entry.slug === slug)
  const prevPost = index > 0 ? posts[index - 1] : null
  const nextPost = index >= 0 && index < posts.length - 1 ? posts[index + 1] : null
  const headings = extractHeadings(articleBlocks)
  const backToHome = from === "home"
  const formattedDate = formatDate(post.date)

  return (
    <ArticleContentMotion
      backToHome={backToHome}
      post={post}
      formattedDate={formattedDate}
      articleBlocks={articleBlocks}
      headings={headings}
      prevPost={prevPost}
      nextPost={nextPost}
    />
  )
}
