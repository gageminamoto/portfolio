import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { fetchCachedAllPosts, fetchPostBlocks, isWritingConfigured } from "@/lib/notion"
import { getSeedPost } from "@/lib/seed-posts"
import { ArticleContent } from "./article-content"
import { ArticleUnavailable } from "./article-unavailable"

export const revalidate = 600

interface ArticlePageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ from?: string }>
}

async function getArticle(slug: string) {
  try {
    const posts = await fetchCachedAllPosts()
    const post = posts.find((item) => item.slug === slug)
    if (!post) return { status: "not-found" as const, post: null, blocks: [], posts }

    const blocks = await fetchPostBlocks(post.id)
    return { status: "success" as const, post, blocks, posts }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("[writing] Failed to render article:", message)
    return {
      status: /timeout|timed out/i.test(message) ? "timeout" as const : "error" as const,
      post: null,
      blocks: [],
      posts: [],
    }
  }
}

export async function generateStaticParams() {
  if (!isWritingConfigured()) return []

  try {
    const posts = await fetchCachedAllPosts()
    return posts.map(({ slug }) => ({ slug }))
  } catch (error) {
    console.error("[writing] Failed to generate article paths", error instanceof Error ? error.message : error)
    return []
  }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  if (slug.startsWith("seed-")) return { title: `${getSeedPost(slug)?.title ?? "Writing"} | Gage Minamoto` }

  try {
    const posts = await fetchCachedAllPosts()
    const post = posts.find((item) => item.slug === slug)
    return post ? { title: `${post.title} | Gage Minamoto`, openGraph: { title: post.title, type: "article", publishedTime: post.date ?? undefined } } : { title: "Not Found" }
  } catch {
    return { title: "Writing | Gage Minamoto" }
  }
}

export default async function ArticlePage({ params, searchParams }: ArticlePageProps) {
  const { slug } = await params
  const { from } = await searchParams

  if (slug.startsWith("seed-")) {
    const post = getSeedPost(slug)
    if (!post) notFound()
    return <ArticleContent slug={slug} from={from} post={post} blocks={[]} allPosts={[]} />
  }

  if (!isWritingConfigured()) notFound()
  const article = await getArticle(slug)
  if (article.status === "not-found") notFound()
  if (article.status === "timeout") return <ArticleUnavailable timedOut />
  if (article.status === "error") return <ArticleUnavailable />
  if (!article.post) return <ArticleUnavailable />

  return <ArticleContent slug={slug} from={from} post={article.post} blocks={article.blocks} allPosts={article.posts} />
}
