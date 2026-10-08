import { IconSearch } from "@/components/site-icons"
import { BackLink } from "@/components/back-link"
import { Skeleton } from "@/components/ui/skeleton"

const rows = Array.from({ length: 6 })

export default function LoadingTools() {
  return (
    <main
      id="main-content"
      data-no-markdown
      className="mx-auto flex min-h-screen max-w-xl flex-col gap-12 px-6 py-16 md:py-24"
    >
      <header>
        <BackLink href="/">Home</BackLink>
      </header>

      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Tools</h1>
        <p className="text-sm text-muted-foreground">
          Everything I build with, stay productive, and keep learning.
        </p>
      </div>

      <section className="flex flex-col gap-5" aria-busy="true" aria-label="Loading tools">
        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
          <div className="h-10 w-full rounded-lg border border-border bg-background" />
        </div>

        <div className="flex gap-2">
          {[52, 76, 92].map((width) => (
            <Skeleton
              key={width}
              className="h-8 rounded-full motion-reduce:animate-none"
              style={{ width }}
            />
          ))}
        </div>

        <div className="flex flex-col">
          {rows.map((_, index) => (
            <div key={index} className="flex items-center gap-3 py-3">
              <Skeleton className="h-8 w-8 shrink-0 motion-reduce:animate-none" />
              <Skeleton className="h-4 w-28 shrink-0 motion-reduce:animate-none" />
              <Skeleton className="h-3 w-44 flex-1 motion-reduce:animate-none" />
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
