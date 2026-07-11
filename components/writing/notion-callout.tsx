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
    <div className="my-6 flex gap-3 rounded-lg border border-border bg-muted/30 p-4">
      {icon && (
        <span className="mt-0.5 shrink-0 text-lg" aria-hidden="true">
          {icon}
        </span>
      )}
      <div className="min-w-0 text-base leading-7 text-foreground/90">
        <NotionRichText items={callout.rich_text} />
      </div>
    </div>
  )
}
