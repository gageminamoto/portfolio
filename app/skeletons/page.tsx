import Link from "next/link"
import { ChevronLeft, Search } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const writingRows = Array.from({ length: 5 })
const toolRows = Array.from({ length: 6 })

function Preview({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 border-t border-border pt-8">
      <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{title}</h2>
      {children}
    </section>
  )
}

function WritingRows({ count = 5 }: { count?: number }) {
  return (
    <div className="flex flex-col" aria-busy="true" aria-label="Loading writing posts">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 py-3">
          <Skeleton className="h-5 w-48 shrink-0 motion-reduce:animate-none" />
          <Skeleton className="h-3 w-20 flex-1 motion-reduce:animate-none" />
        </div>
      ))}
    </div>
  )
}

export default function SkeletonsPage() {
  return (
    <main id="main-content" className="mx-auto flex min-h-screen max-w-xl flex-col gap-12 px-6 py-16 md:py-24">
      <header className="flex flex-col gap-6">
        <Link href="/" className="inline-flex items-center gap-1 self-start rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground/50" aria-hidden="true" />
          Home
        </Link>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Skeleton loaders</h1>
          <p className="text-sm text-muted-foreground">A temporary preview of every loading state used across the site.</p>
        </div>
      </header>

      <Preview title="Writing page">
        <Skeleton className="h-5 w-20 motion-reduce:animate-none" />
        <WritingRows />
      </Preview>

      <Preview title="Writing section">
        <WritingRows count={3} />
      </Preview>

      <Preview title="Tools page">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" aria-hidden="true" />
          <div className="h-10 w-full rounded-lg border border-border bg-background" />
        </div>
        <div className="flex gap-2">
          {[52, 76, 92].map((width) => <Skeleton key={width} className="h-8 rounded-full motion-reduce:animate-none" style={{ width }} />)}
        </div>
        <div className="flex flex-col" aria-busy="true" aria-label="Loading tools">
          {toolRows.map((_, index) => (
            <div key={index} className="flex items-center gap-3 py-3">
              <Skeleton className="h-8 w-8 shrink-0 motion-reduce:animate-none" />
              <Skeleton className="h-4 w-28 shrink-0 motion-reduce:animate-none" />
              <Skeleton className="h-3 w-44 flex-1 motion-reduce:animate-none" />
            </div>
          ))}
        </div>
      </Preview>

      <Preview title="Tools cards">
        <div className="grid grid-cols-2 gap-3" aria-busy="true" aria-label="Loading tool cards">
          {toolRows.map((_, index) => (
            <div key={index} className="flex flex-col gap-3 rounded-xl border border-border/50 p-5">
              <Skeleton className="h-8 w-8 motion-reduce:animate-none" />
              <Skeleton className="h-4 w-24 motion-reduce:animate-none" />
              <Skeleton className="h-3 w-full motion-reduce:animate-none" />
            </div>
          ))}
        </div>
      </Preview>

      <Preview title="Article">
        <div className="flex flex-col gap-6">
          <Skeleton className="h-[30px] w-4/5 motion-reduce:animate-none" />
          <Skeleton className="h-5 w-24 motion-reduce:animate-none" />
          <div className="space-y-5" aria-busy="true" aria-label="Loading article">
            <Skeleton className="h-7 w-full motion-reduce:animate-none" />
            <Skeleton className="h-7 w-5/6 motion-reduce:animate-none" />
            <Skeleton className="h-7 w-4/5 motion-reduce:animate-none" />
          </div>
        </div>
      </Preview>

      <Preview title="Commit history">
        <div className="flex flex-col gap-6" aria-busy="true" aria-label="Loading commits">
          {[0, 1, 2].map((group) => (
            <div key={group} className="flex flex-col gap-2">
              <Skeleton className="h-3 w-24 motion-reduce:animate-none" />
              {[0, 1, 2].map((row) => (
                <div key={row} className="flex items-center gap-3 py-2">
                  <Skeleton className="h-4 w-4 motion-reduce:animate-none" />
                  <Skeleton className="h-3 w-20 motion-reduce:animate-none" />
                  <Skeleton className="h-3 w-3 motion-reduce:animate-none" />
                  <Skeleton className="h-3 flex-1 motion-reduce:animate-none" />
                  <Skeleton className="h-3 w-12 motion-reduce:animate-none" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </Preview>
    </main>
  )
}
