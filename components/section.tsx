import Link from "next/link"
import { ChevronRight } from "lucide-react"

export function Section({
  title,
  href,
  children,
}: {
  title: string
  href?: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      {href ? (
        <Link
          href={href}
          className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
        >
          <h2>{title}</h2>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      ) : (
        <h2 className="text-sm text-muted-foreground">{title}</h2>
      )}
      {children}
    </section>
  )
}
