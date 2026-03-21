import Link from "next/link"

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
          className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
        >
          <h2 className="flex items-center gap-1.5">
            {icon}
            {title}
          </h2>
        </Link>
      ) : (
        <h2 className="flex items-center gap-1.5 text-sm text-muted-foreground">
          {icon}
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}
