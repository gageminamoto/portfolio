import type { NotionBlock } from "@/lib/notion"
import { NotionRichText } from "./notion-rich-text"

interface NotionQuoteProps {
  block: NotionBlock
}

export function NotionQuote({ block }: NotionQuoteProps) {
  const quote = block.quote

  return (
    <blockquote className="my-6 border-l-2 border-foreground/20 pl-5 italic text-foreground/80">
      <p className="text-base leading-7">
        <NotionRichText items={quote.rich_text} />
      </p>
    </blockquote>
  )
}
