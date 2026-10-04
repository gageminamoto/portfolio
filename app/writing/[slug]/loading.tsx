import { BackLink } from "@/components/back-link"
import { ArticleActions } from "./article-actions"

export default function LoadingArticle() {
  return (
    <div data-no-markdown className="mx-auto w-full px-6 py-16 md:py-24 xl:grid xl:grid-cols-[clamp(16rem,18vw,20rem)_minmax(0,36rem)_clamp(16rem,18vw,20rem)] xl:items-start xl:justify-center">
      <div className="hidden xl:block" aria-hidden="true" />
      <main id="main-content" className="mx-auto w-full min-w-0 max-w-xl xl:max-w-none">
        <header className="mb-10 flex flex-col gap-6">
          <nav className="flex items-center justify-between">
            <BackLink href="/writing">Writing</BackLink>
            <ArticleActions />
          </nav>
          <div className="h-[30px] w-4/5 animate-pulse rounded-sm bg-muted motion-reduce:animate-none" />
          <div className="h-5 w-24 animate-pulse rounded-sm bg-muted motion-reduce:animate-none" />
        </header>
        <div className="space-y-5" aria-busy="true" aria-label="Loading article">
          <div className="h-7 w-full animate-pulse rounded-sm bg-muted motion-reduce:animate-none" />
          <div className="h-7 w-5/6 animate-pulse rounded-sm bg-muted motion-reduce:animate-none" />
          <div className="h-7 w-4/5 animate-pulse rounded-sm bg-muted motion-reduce:animate-none" />
        </div>
      </main>
      <div className="hidden xl:block" aria-hidden="true" />
    </div>
  )
}
