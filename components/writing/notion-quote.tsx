import type { NotionBlock } from "@/lib/notion"
import { NotionRichText } from "./notion-rich-text"

type QuoteBlock = Extract<NotionBlock, { type: "quote" }>

interface NotionQuoteProps {
  block: QuoteBlock
}

export function NotionQuote({ block }: NotionQuoteProps) {
  const quote = block.quote

  return (
    <blockquote>
      <p>
        <NotionRichText items={quote.rich_text} />
      </p>
    </blockquote>
  )
}
