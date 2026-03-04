"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import type { NotionWritingPost } from "@/lib/notion"

interface ArticleFooterProps {
  nextPost: NotionWritingPost | null
}

export function ArticleFooter({ nextPost }: ArticleFooterProps) {
  return (
    <footer className="mt-12 border-t border-border pt-8">

      {nextPost && (
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            Next article
          </span>
          <Link
            href={`/writing/${nextPost.slug}`}
            className="group inline-flex items-center gap-1 font-medium text-foreground underline decoration-muted-foreground/40 underline-offset-4 transition-[color,text-decoration-color] duration-150 ease-out hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
          >
            <span>{nextPost.title}</span>
            <ChevronRight className="h-3.5 w-3.5 opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100" />
          </Link>
        </div>
      )}
    </footer>
  )
}
