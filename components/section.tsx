import Link from "next/link"
import { AltArrowRight } from "@solar-icons/react"

export function Section({
  title,
  href,
  icon,
  children,
}: {
  title: string
  href?: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      {href ? (
        <Link
          href={href}
          className="group inline-flex w-fit items-center gap-1 rounded-full text-sm font-semibold tracking-[-0.01em] text-foreground transition-[color,transform] duration-150 ease-out hover:text-[var(--prototype-accent)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <h2 className="flex items-center gap-1.5">
            {icon}
            {title}
          </h2>
          <AltArrowRight
            size={14}
            weight="Linear"
            className="text-[var(--prototype-accent)] transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:text-[var(--prototype-accent)]"
          />
        </Link>
      ) : (
        <h2 className="flex items-center gap-1.5 text-sm font-semibold tracking-[-0.01em] text-foreground">
          {icon}
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}
