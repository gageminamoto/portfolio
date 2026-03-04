import type { Metadata } from "next"
import { fetchPostBySlug } from "@/lib/notion"
import { ArticleContent } from "./article-content"

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await fetchPostBySlug(slug)

  if (!post) {
    return { title: "Not Found" }
  }

  return {
    title: `${post.title} — Gage Minamoto`,
    openGraph: {
      title: post.title,
      type: "article",
      publishedTime: post.date ?? undefined,
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params

  return <ArticleContent slug={slug} />
}
