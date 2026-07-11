import type { NotionBlock } from "@/lib/notion"
import { NotionRichText } from "./notion-rich-text"

type CalloutBlock = Extract<NotionBlock, { type: "callout" }>

interface NotionCalloutProps {
  block: CalloutBlock
}

export function NotionCallout({ block }: NotionCalloutProps) {
  const callout = block.callout
  const icon =
    callout.icon?.type === "emoji" ? callout.icon.emoji : null

  return (
    <aside className="mt-[var(--typeset-flow)] flex gap-3 rounded-lg border border-border bg-muted/30 p-4">
      {icon && (
        <span className="mt-0.5 shrink-0 text-lg" aria-hidden="true">
          {icon}
        </span>
      )}
      <div className="min-w-0">
        <NotionRichText items={callout.rich_text} />
      </div>
    </aside>
  )
}
