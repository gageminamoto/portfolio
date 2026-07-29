import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { NotionBlocksRenderer } from "@/components/writing/notion-blocks-renderer"
import { TableOfContents } from "@/components/writing/table-of-contents"
import { ArticleFooter } from "@/components/writing/article-footer"
import { generateSeedPosts, getSeedPost, generateSeedBlocks } from "@/lib/seed-posts"
import type { NotionBlock, NotionWritingPost } from "@/lib/notion"
import { ArticleActions } from "./article-actions"

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

function formatDate(date: string | null): string {
  return date ? dateFormatter.format(new Date(date)) : ""
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
  const index = posts.findIndex((item) => item.slug === slug)
  const prevPost = index > 0 ? posts[index - 1] : null
  const nextPost = index >= 0 && index < posts.length - 1 ? posts[index + 1] : null
  const headings = extractHeadings(articleBlocks)
  const backToHome = from === "home"

  return (
    <div>
      <div className={`mx-auto w-full px-6 pt-16 md:pt-24 ${prevPost || nextPost ? "pb-0" : "pb-16 md:pb-24"} xl:grid xl:grid-cols-[clamp(16rem,18vw,20rem)_minmax(0,36rem)_clamp(16rem,18vw,20rem)] xl:items-start xl:justify-center`}>
        <div className="hidden xl:block" />
        <main id="main-content" className="min-w-0 max-w-xl xl:max-w-none mx-auto w-full">
          <header className="mb-10 flex flex-col gap-6">
            <nav className="flex items-center justify-between">
              <Link href={backToHome ? "/" : "/writing"} className="group inline-flex items-center gap-1 rounded-sm text-sm text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground/50 transition-[color,transform] duration-150 ease-out group-hover:-translate-x-0.5 group-hover:text-foreground" aria-hidden="true" />
                {backToHome ? "Home" : "Writing"}
              </Link>
              <ArticleActions />
            </nav>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground [text-wrap:balance]">{post.title}</h1>
            {post.date && <time dateTime={post.date} className="text-sm text-muted-foreground">{formatDate(post.date)}</time>}
          </header>

          {headings.length > 0 && <div className="xl:hidden"><TableOfContents headings={headings} variant="collapsible" /></div>}
          {articleBlocks.length > 0 ? <article><NotionBlocksRenderer blocks={articleBlocks} /></article> : <p className="text-sm text-muted-foreground">This article does not have any published content yet.</p>}
        </main>
        <aside className="hidden xl:sticky xl:top-6 xl:max-h-[calc(100vh-3rem)] xl:self-start xl:overflow-y-auto xl:pl-10 xl:block">
          {headings.length > 0 && <TableOfContents headings={headings} variant="list" />}
        </aside>
      </div>
      {(prevPost || nextPost) && <div className="px-6"><ArticleFooter prevPost={prevPost} nextPost={nextPost} /></div>}
    </div>
  )
}
