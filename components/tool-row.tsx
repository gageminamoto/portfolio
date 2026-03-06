import { HoverLink } from "@/components/hover-link"

export function ToolRow({
  name,
  url,
  description,
  tag,
}: {
  name: string
  url?: string
  description: string
  tag?: string
}) {
  return (
    <div className="flex items-baseline gap-2 min-w-0">
      {url ? (
        <HoverLink
          href={url}
          className="shrink-0 font-medium no-underline decoration-transparent hover:decoration-foreground"
        >
          {name}
        </HoverLink>
      ) : (
        <span className="shrink-0 font-medium text-foreground">{name}</span>
      )}
      <span className="truncate text-sm text-muted-foreground">{description}</span>
      {tag && (
        <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{tag}</span>
      )}
    </div>
  )
}
