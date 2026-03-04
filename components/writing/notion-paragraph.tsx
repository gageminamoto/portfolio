import type { NotionBlock } from "@/lib/notion"
import { NotionRichText } from "./notion-rich-text"

interface NotionParagraphProps {
  block: NotionBlock
}

export function NotionParagraph({ block }: NotionParagraphProps) {
  const paragraph = block.paragraph
  if (!paragraph?.rich_text?.length) {
    return <div className="h-5" aria-hidden="true" />
  }

  return (
    <p className="mb-5 text-base leading-7 text-foreground/90">
      <NotionRichText items={paragraph.rich_text} />
    </p>
  )
}
