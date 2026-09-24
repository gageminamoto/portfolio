import type { NotionBlock } from "@/lib/notion"
import { getEmojiIcon } from "@/lib/notion-icon"
import { RichText } from "./rich-text"

type ParagraphBlock = Extract<NotionBlock, { type: "paragraph" }>

interface ArticleParagraphProps {
  block: ParagraphBlock
}

export function Paragraph({ block }: ArticleParagraphProps) {
  const paragraph = block.paragraph
  const icon =
    getEmojiIcon((block as { icon?: unknown }).icon) ??
    getEmojiIcon((paragraph as { icon?: unknown } | undefined)?.icon)
  const hasText = Boolean(paragraph?.rich_text?.length)

  if (!hasText && !icon) {
    return <div className="h-5" aria-hidden="true" />
  }

  return (
    <p className="mb-5 text-base leading-7 text-foreground/90">
      {icon ? (
        <span className="mr-1.5 inline-block align-baseline" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {hasText ? <RichText items={paragraph!.rich_text} /> : null}
    </p>
  )
}
