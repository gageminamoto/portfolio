"use client"

import Link from "next/link"

import type { NotionWritingPost } from "@/lib/notion"

interface ArticleFooterProps {
  prevPost: NotionWritingPost | null
  nextPost: NotionWritingPost | null
}

export function ArticleFooter({ prevPost, nextPost }: ArticleFooterProps) {
  if (!prevPost && !nextPost) return null

  return (
    <footer className="mt-12 border-t border-border pt-8">
      <div className="flex items-start justify-between gap-6">
        {prevPost ? (
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Previous article
            </span>
            <Link
              href={`/writing/${prevPost.slug}`}
              className="group inline-flex items-center gap-1 font-medium text-foreground underline decoration-muted-foreground/40 underline-offset-4 transition-[color,text-decoration-color] duration-150 ease-out hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
            >
              <span>{prevPost.title}</span>
            </Link>
          </div>
        ) : (
          <div />
        )}

        {nextPost && (
          <div className="flex flex-col gap-1 text-right ml-auto">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Next article
            </span>
            <Link
              href={`/writing/${nextPost.slug}`}
              className="group inline-flex items-center justify-end gap-1 font-medium text-foreground underline decoration-muted-foreground/40 underline-offset-4 transition-[color,text-decoration-color] duration-150 ease-out hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
            >
              <span>{nextPost.title}</span>
            </Link>
          </div>
        )}
      </div>
    </footer>
  )
}
