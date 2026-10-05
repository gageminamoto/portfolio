import Link from "next/link"
import { ChevronLeft } from "@/components/icons"

interface BackLinkProps {
  href: string
  children: React.ReactNode
}

export function BackLink({ href, children }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1 rounded-sm text-sm text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <ChevronLeft
        className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50 transition-[color,transform] duration-150 ease-out group-hover:-translate-x-0.5 group-hover:text-foreground"
        aria-hidden="true"
      />
      {children}
    </Link>
  )
}
