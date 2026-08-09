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
    <div className="my-6 flex gap-3 rounded-[10px] bg-muted p-4 text-xs/4 antialiased">
      {icon && (
        <span className="mt-0.5 shrink-0 text-lg" aria-hidden="true">
          {icon}
        </span>
      )}
      <div className="min-w-0">
        <div className="inline-block font-sans text-base/7 text-foreground">
          <NotionRichText items={callout.rich_text} />
        </div>
      </div>
    </div>
  )
}
