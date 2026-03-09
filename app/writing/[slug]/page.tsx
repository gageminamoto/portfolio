import type { Metadata } from "next"
import { fetchPostBySlug } from "@/lib/notion"
import type { NotionWritingPost } from "@/lib/notion"
import { ArticleContent } from "./article-content"

interface ArticlePageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ from?: string }>
}

async function getPost(slug: string): Promise<NotionWritingPost | null> {
  try {
    return await fetchPostBySlug(slug)
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)

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

export default async function ArticlePage({ params, searchParams }: ArticlePageProps) {
  const { slug } = await params
  const { from } = await searchParams
  const post = await getPost(slug)

  return <ArticleContent slug={slug} from={from} initialPost={post ?? undefined} />
}
