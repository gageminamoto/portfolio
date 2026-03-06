import { HoverLink } from "@/components/hover-link"

export function ToolRow({
  name,
  url,
  description,
}: {
  name: string
  url: string
  description: string
}) {
  return (
    <div className="flex items-baseline gap-2 min-w-0">
      <HoverLink
        href={url}
        className="shrink-0 font-medium no-underline decoration-transparent hover:decoration-foreground"
      >
        {name}
      </HoverLink>
      <span className="truncate text-sm text-muted-foreground">{description}</span>
    </div>
  )
}
