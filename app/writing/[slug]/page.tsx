import type { Metadata } from "next"
import { fetchPostBySlug } from "@/lib/notion"
import { ArticleContent } from "./article-content"

interface ArticlePageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ from?: string }>
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params

  try {
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
  } catch {
    return { title: "Not Found" }
  }
}

export default async function ArticlePage({ params, searchParams }: ArticlePageProps) {
  const { slug } = await params
  const { from } = await searchParams

  return <ArticleContent slug={slug} from={from} />
}
