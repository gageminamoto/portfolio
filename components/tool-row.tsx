import { HoverLink } from "@/components/hover-link"
import { ArrowUpRight } from "lucide-react"

export function ToolRow({
  name,
  url,
  description,
  tag,
  isSkill,
}: {
  name: string
  url?: string
  description: string
  tag?: string
  isSkill?: boolean
}) {
  const displayName = isSkill ? `/${name}` : name
  const nameClass = isSkill
    ? "shrink-0 font-medium font-mono rounded-md bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
    : "shrink-0 font-medium"

  return (
    <div className="flex items-center gap-2 min-w-0">
      {url && isSkill ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${nameClass} inline-flex items-center gap-0.5 no-underline transition-colors duration-150 hover:bg-zinc-200 hover:text-black dark:hover:bg-zinc-700 dark:hover:text-white`}
        >
          {displayName}
          <ArrowUpRight size={10} className="shrink-0" />
        </a>
      ) : url ? (
        <HoverLink
          href={url}
          className="shrink-0 font-medium no-underline decoration-transparent hover:decoration-foreground"
        >
          {displayName}
        </HoverLink>
      ) : (
        <span className={`${nameClass} ${isSkill ? "" : "text-foreground"}`}>{displayName}</span>
      )}
      <span className="truncate text-sm text-muted-foreground">{description}</span>
      {tag && (
        <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{tag}</span>
      )}
    </div>
  )
}
