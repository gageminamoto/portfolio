import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { ArticleActions } from "./article-actions"

export default function LoadingArticle() {
  return (
    <main id="main-content" className="mx-auto max-w-xl px-6 py-16 md:py-24">
      <header className="mb-10 flex flex-col gap-6">
        <nav className="flex items-center justify-between">
          <Link href="/writing" className="group inline-flex items-center gap-1 rounded-sm text-sm text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
            <ChevronLeft className="h-3.5 w-3.5 transition-transform duration-150 ease-out group-hover:-translate-x-0.5" aria-hidden="true" />
            Writing
          </Link>
          <ArticleActions />
        </nav>
      </header>

      <div aria-busy="true" aria-label="Loading article">
        <div className="h-8 w-4/5 animate-pulse rounded bg-muted" />
        <div className="mt-4 h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="mt-16 space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </main>
  )
}
