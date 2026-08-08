import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { ArticleActions } from "./article-actions"

export default function LoadingArticle() {
  return (
    <div className="mx-auto w-full px-6 py-16 md:py-24 xl:grid xl:grid-cols-[clamp(16rem,18vw,20rem)_minmax(0,36rem)_clamp(16rem,18vw,20rem)] xl:items-start xl:justify-center">
      <div className="hidden xl:block" aria-hidden="true" />
      <main id="main-content" className="mx-auto w-full min-w-0 max-w-xl xl:max-w-none">
        <header className="mb-10 flex flex-col gap-6">
          <nav className="flex items-center justify-between">
            <Link href="/writing" className="group inline-flex items-center gap-1 rounded-sm text-sm text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground/50 transition-[color,transform] duration-150 ease-out group-hover:-translate-x-0.5 group-hover:text-foreground" aria-hidden="true" />
              Writing
            </Link>
            <ArticleActions />
          </nav>
          <div className="h-[30px] w-4/5 animate-pulse rounded bg-muted motion-reduce:animate-none" />
          <div className="h-5 w-24 animate-pulse rounded bg-muted motion-reduce:animate-none" />
        </header>

        <div className="space-y-5" aria-busy="true" aria-label="Loading article">
          <div className="h-7 w-full animate-pulse rounded bg-muted motion-reduce:animate-none" />
          <div className="h-7 w-5/6 animate-pulse rounded bg-muted motion-reduce:animate-none" />
          <div className="h-7 w-4/5 animate-pulse rounded bg-muted motion-reduce:animate-none" />
        </div>
      </main>
      <div className="hidden xl:block" aria-hidden="true" />
    </div>
  )
}
