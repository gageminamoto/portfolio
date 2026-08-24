import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const rows = Array.from({ length: 5 })

export default function LoadingWriting() {
  return (
    <main
      id="main-content"
      data-no-markdown
      className="mx-auto flex min-h-screen max-w-xl flex-col gap-12 px-6 py-16 md:py-24"
    >
      <header>
        <Link
          href="/"
          className="group inline-flex items-center gap-1 rounded-sm text-sm text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ChevronLeft
            className="h-3.5 w-3.5 text-muted-foreground/50"
            aria-hidden="true"
          />
          Home
        </Link>
      </header>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Writing</h1>
      </div>

      <section className="flex flex-col gap-10" aria-busy="true" aria-label="Loading posts">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-5 w-20 motion-reduce:animate-none" />
          <div className="flex flex-col">
            {rows.map((_, index) => (
              <div key={index} className="flex items-center gap-3 py-3">
                <Skeleton className="h-5 w-48 shrink-0 motion-reduce:animate-none" />
                <Skeleton className="h-3 w-20 flex-1 motion-reduce:animate-none" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
