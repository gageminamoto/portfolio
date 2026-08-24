import type { NotionBlock } from "@/lib/notion"
import { RichText } from "./rich-text"

type QuoteBlock = Extract<NotionBlock, { type: "quote" }>

interface ArticleQuoteProps {
  block: QuoteBlock
}

export function Quote({ block }: ArticleQuoteProps) {
  const quote = block.quote

  return (
    <blockquote className="my-6 border-l-2 border-foreground/20 pl-5 italic text-foreground/80">
      <p className="text-base leading-7">
        <RichText items={quote.rich_text} />
      </p>
    </blockquote>
  )
}
