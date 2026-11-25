import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache } from "react"
import {
  fetchCachedAllPosts,
  fetchPostBlocks,
  isWritingConfigured,
  resolveWritingPostBySlug,
} from "@/lib/notion"
import { getSeedPost } from "@/lib/seed-posts"
import { JsonLd, articleJsonLd } from "@/lib/json-ld"
import { SITE_NAME, TWITTER_HANDLE } from "@/lib/site"
import { ArticleContent } from "./article-content"
import { ArticleUnavailable } from "./article-unavailable"

export const revalidate = 600
// Slugs published after the last build render on first request, then cache.
// A slug that is not found yet is only cached for one revalidate window.
export const dynamicParams = true

const resolvePostForRequest = cache(resolveWritingPostBySlug)

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

async function getArticle(slug: string) {
  try {
    const { post, allPosts: posts } = await resolvePostForRequest(slug)
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
    const { post } = await resolvePostForRequest(slug)
    return post
      ? {
          title: `${post.title} | Gage Minamoto`,
          alternates: { canonical: `/writing/${post.slug}` },
          authors: [{ name: SITE_NAME, url: "/" }],
          openGraph: {
            title: post.title,
            type: "article",
            url: `/writing/${post.slug}`,
            siteName: SITE_NAME,
            locale: "en_US",
            publishedTime: post.date ?? undefined,
            authors: ["/"],
          },
          twitter: {
            card: "summary",
            title: post.title,
            creator: TWITTER_HANDLE,
          },
        }
      : { title: "Not Found" }
  } catch {
    return { title: "Writing | Gage Minamoto" }
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params

  if (slug.startsWith("seed-")) {
    const post = getSeedPost(slug)
    if (!post) notFound()
    return <ArticleContent slug={slug} post={post} blocks={[]} allPosts={[]} />
  }

  if (!isWritingConfigured()) notFound()
  const article = await getArticle(slug)
  if (article.status === "not-found") notFound()
  if (article.status === "timeout") return <ArticleUnavailable timedOut />
  if (article.status === "error") return <ArticleUnavailable />
  if (!article.post) return <ArticleUnavailable />

  return (
    <>
      <JsonLd data={articleJsonLd(article.post)} />
      <ArticleContent slug={slug} post={article.post} blocks={article.blocks} allPosts={article.posts} />
    </>
  )
}
