import type { NotionBlock } from "@/lib/notion"
import { NotionRichText } from "./notion-rich-text"

type ParagraphBlock = Extract<NotionBlock, { type: "paragraph" }>

interface NotionParagraphProps {
  block: ParagraphBlock
}

export function NotionParagraph({ block }: NotionParagraphProps) {
  const paragraph = block.paragraph
  if (!paragraph?.rich_text?.length) {
    return <p aria-hidden="true" />
  }

  return (
    <p>
      <NotionRichText items={paragraph.rich_text} />
    </p>
  )
}
